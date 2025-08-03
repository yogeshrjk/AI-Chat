import { marked } from "marked";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Copy,
  Plus,
  Mic,
  MicOff,
  ArrowUp,
  Play,
  Pause,
  Download,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { jwtDecode } from "jwt-decode";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Wave } from "../ui/Wave";

export function TextToSpeech() {
  const [text, setText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const audioRef = useRef(null);

  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const token = localStorage.getItem("token");
  let userID = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userID = decoded.userId;
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }

  const ADD_CHAT = gql`
    mutation AddChat($message: String!, $userID: ID!) {
      addChat(message: $message, userID: $userID) {
        _id
        message
        ttsFile
        createdAt
      }
    }
  `;

  const GET_CHAT = gql`
    query GetTtsChats($userID: ID!) {
      getTtsChats(userID: $userID) {
        _id
        userID
        message
        ttsFile
        createdAt
      }
    }
  `;

  const [addChat] = useMutation(ADD_CHAT);
  const { data, loading, error, refetch } = useQuery(GET_CHAT, {
    variables: { userID },
  });
  // useEffect(() => {
  //   console.log("GET_CHAT →", { data, loading, error });
  // }, [data, loading, error]);

  // if (loading)
  //   return (
  //     <div className="flex items-center justify-center gap-2 h-[60vh]">
  //       <div className="h-4 w-4  animate-spin rounded-full border-2 border-[#103d46] border-t-transparent"></div>
  //       <p className="">Loading Notes...</p>
  //     </div>
  //   );
  // if (error)
  //   return (
  //     <p className="px-10 py-5 text-red-500">
  //       Error loading Notes: {error.message}
  //     </p>
  //   );

  useEffect(() => {
    if (data?.getTtsChats) {
      const chats = data.getTtsChats.map((chat) => ({
        type: "audio",
        content: chat.message,
        ttsFile: chat.ttsFile,
      }));
      setMessages(chats);
    }
  }, [data]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setText(textarea.value);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (listening) {
      setText(transcript);
    }
  }, [transcript, listening]);

  const handleSend = async () => {
    if (!text.trim()) return;

    const generatingMsg = {
      type: "generating",
      content: "Generating speech...",
    };
    setMessages((prev) => [...prev, generatingMsg]);

    try {
      const { data } = await addChat({
        variables: {
          message: text.trim(),
          userID,
        },
      });

      const ttsMsg = {
        userID: userID,
        type: "audio",
        content: data.addChat.message,
        ttsFile: data.addChat.ttsFile,
      };

      setMessages((prev) =>
        prev.map((msg) => (msg.type === "generating" ? ttsMsg : msg))
      );
      setText("");
    } catch (error) {
      console.error("GraphQL addChat error", error);
    }
  };

  const togglePlay = (fileUrl, index) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingIndex(null);
    }

    if (playingIndex !== index) {
      const audio = new Audio(fileUrl);
      audioRef.current = audio;
      setPlayingIndex(index);
      audio.play();
      audio.onended = () => {
        setPlayingIndex(null);
      };
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="h-full md:px-10 md:py-5 select-text">
      <div className="h-full flex flex-col rounded-md">
        <div
          className="px-2 md:px-0 md:w-[60%] mx-auto flex-1 overflow-y-auto break-words max-w-full rounded-t-xl pb-10"
          style={{
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {messages.length === 0 && (
            <div className="flex flex-col gap-4 h-full justify-center items-center">
              <div className="text-black/80 dark:text-white/80  text-md md:text-xl lg:text-2xl font-bold">
                Convert your text into realistic speech.
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`relative shadow-md min-h-[2.5rem] text-sm md:text-md md:px-4 p-3 my-5 rounded-md whitespace-wrap bg-white/40 dark:bg-[#111] backdrop-blur-md text-black/80 dark:text-white/80 self-start mr-auto w-fit max-w-full overflow-x-auto`}
            >
              {msg.type === "generating" ? (
                <div className="italic text-gray-400">{msg.content}</div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked(msg.content || ""),
                  }}
                />
              )}
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2 items-center">
                  <button
                    className="text-black/40 dark:text-white/60 hover:text-black dark:hover:text-white"
                    onClick={() => togglePlay(msg.ttsFile, index)}
                  >
                    {playingIndex === index ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    {playingIndex === index ? (
                      <Wave />
                    ) : (
                      <span className="flex gap-4">Play Audio</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Download
                    className="h-5 w-5 items-center dark:text:white/60 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = msg.ttsFile;
                      link.download = "audio.mp3";
                      link.click();
                    }}
                  />
                  <button
                    title="Copy Message"
                    onClick={() => {
                      navigator.clipboard.writeText(msg.content);
                      setCopiedIndex(index);
                      setTimeout(() => setCopiedIndex(null), 2000);
                    }}
                  >
                    <Copy className="w-4 h-4 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white" />
                    {copiedIndex === index && (
                      <div className="absolute bottom-0 right-0 text-xs text-white bg-black px-2 py-1 rounded">
                        Copied!
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="relative p-4 flex flex-col-reverse bg-white dark:bg-black/60  backdrop-blur-md w-full sm:w-[80%] md:w-[60%] max-w-full sm:rounded-b-xl mx-auto"
          // style={{
          //   boxShadow: "rgba(35, 35, 35,0.8)0px -25px 20px -10px",
          // }}
        >
          <div className="w-full flex items-end">
            <textarea
              name="input-text"
              ref={textareaRef}
              value={text}
              placeholder="Ask anything"
              onInput={handleInput}
              className="w-full mb-8 md:px-2 text-sm text-black/80 dark:text-white/80 scrollbar-none max-h-[12rem] overflow-y-auto resize-none scrollbar-none placeholder-black/40 dark:placeholder-white/40 placeholder:align-bottom focus:outline-none focus:ring-0 bg-none"
              style={{ height: "2.5rem" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            ></textarea>
            <Plus className="absolute bottom-2.5 left-2 text-black/80 dark:text-white/80 rounded-full h-6.5 w-6.5 p-1 hover:scale-110" />
            {listening ? (
              <MicOff
                className="absolute bottom-2.5 right-10 animate-pulse text-black/80 dark:text-white/80 rounded-full h-6.5 w-6.5 p-1 hover:scale-110"
                onClick={() => {
                  SpeechRecognition.stopListening();
                  setText(transcript);
                  resetTranscript();
                }}
              />
            ) : (
              <Mic
                className="absolute bottom-2.5 right-10 text-black/80 dark:text-white/80 rounded-full h-6.5 w-6.5 p-1 hover:scale-110"
                onClick={() => {
                  resetTranscript();
                  SpeechRecognition.startListening({
                    continuous: true,
                    language: "en-IN",
                  });
                }}
              />
            )}
            <ArrowUp
              className="absolute bottom-3 right-3 bg-[#111] dark:bg-white text-white dark:text-black rounded-full h-6 w-6 p-0.5 hover:scale-110"
              onClick={() => handleSend()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
