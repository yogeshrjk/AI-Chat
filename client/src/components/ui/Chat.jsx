import { Highlight, themes } from "prism-react-renderer";
import { gql, useMutation, useQuery } from "@apollo/client";
import { marked } from "marked";
import { Link } from "react-router-dom";
import {
  Copy,
  Images,
  Speech,
  Mic,
  MicOff,
  ArrowUp,
  Volume2,
  VolumeOff,
  Share,
} from "lucide-react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { franc } from "franc";
import { useOutletContext } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Chat() {
  const { model, userID, conversationID, refetchConversations } =
    useOutletContext();
  const welcomeMessages = [
    "Hello, how can I assist you today?",
    "What's on your mind, I'm all ears!",
    "Need help, advice, or just someone to talk to?",
    "I'm here to listen and help, what's up?",
    "Hello, I can answer any question you have or just chat!",
    "Hi, how can I make your day better?",
    "What can I help you with, ask me anything!",
    "Hello, I'm here to provide assistance and conversation.",
    "Hi, I'm happy to help, what's your priority?",
    "Need answers, advice, or just a chat?",
    "Hello, I'm your AI chat assistant, how can I help?",
    "Hi, what's going on that you'd like to talk about?",
    "I'm here to help you with any questions or topics.",
    "Hello, how can I assist you, ask me anything!",
    "Hi, need help or just a chat, I'm here for you?",
  ];
  function getWelcomeMessage() {
    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  }

  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [welcomeMessage, setWelcomeMessage] = useState(getWelcomeMessage());
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const ADD_CHAT = gql`
    mutation AddChat(
      $userMessage: String!
      $aiResponse: String!
      $userID: ID!
      $conversationID: ID!
    ) {
      addChat(
        userMessage: $userMessage
        aiResponse: $aiResponse
        userID: $userID
        conversationID: $conversationID
      ) {
        _id
        userMessage
        aiResponse
        createdAt
      }
    }
  `;

  const CREATE_CONVERSATION = gql`
    mutation CreateConversation($userID: ID!, $title: String) {
      createConversation(userID: $userID, title: $title) {
        _id
        title
        createdAt
      }
    }
  `;

  const GET_CHATS = gql`
    query GetChats($userID: ID!, $conversationID: ID!) {
      getChats(userID: $userID, conversationID: $conversationID) {
        _id
        userID
        userMessage
        aiResponse
        createdAt
      }
    }
  `;

  const [addChat] = useMutation(ADD_CHAT);
  const [createConversation] = useMutation(CREATE_CONVERSATION);
  const { data, loading, error, refetch } = useQuery(GET_CHATS, {
    variables: { userID, conversationID },
    skip: !conversationID,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getChats) {
      const chats = data.getChats.flatMap((chat) => [
        { role: "user", content: chat.userMessage },
        { role: "assistant", content: chat.aiResponse },
      ]);
      setMessages(chats);
    }
  }, [data]);

  // Refetch chats when conversationID changes to ensure up-to-date messages
  useEffect(() => {
    if (!conversationID && sessionStorage.getItem("newChat") === "true") {
      setMessages([]); // Clear previous conversation from UI
    }
  }, [conversationID]);

  // SpeechRecognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  useEffect(() => {
    if (messages.length === 0) {
      setWelcomeMessage(getWelcomeMessage());
    }
  }, [messages.length]);

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

    const newUserMessage = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      let currentConversationID = conversationID;
      const isNewChat = sessionStorage.getItem("newChat") === "true";
      if (!currentConversationID || isNewChat) {
        const shortTitle = newUserMessage.content
          .split(" ")
          .slice(0, 4)
          .join(" ");
        const { data } = await createConversation({
          variables: {
            userID,
            title: shortTitle,
          },
        });
        currentConversationID = data.createConversation._id;
        sessionStorage.setItem("conversationID", currentConversationID);
        sessionStorage.removeItem("newChat");
        await refetchConversations?.();
      }

      let response;
      if (model === "openai/gpt-oss-120b:novita") {
        response = await axios.post(
          "https://router.huggingface.co/v1/chat/completions",
          {
            model,
            messages: updatedMessages,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model,
            messages: updatedMessages,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
            },
          }
        );
      }
      const assistantMessage = response.data.choices[0].message;
      const cleanResponse = assistantMessage.content
        .replace(/<think>.*?<\/think>/gs, "")
        .trim();

      if (!cleanResponse) {
        throw new Error("No AI response received.");
      }
      console.log("Sending to addChat:", {
        userMessage: newUserMessage.content,
        aiResponse: cleanResponse,
        userID,
        conversationID: currentConversationID,
      });
      const { data: chatData } = await addChat({
        variables: {
          userMessage: newUserMessage.content,
          aiResponse: cleanResponse,
          userID,
          conversationID: currentConversationID,
        },
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: chatData.addChat.aiResponse },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }
  };
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="h-full md:pb-5 select-text">
      <div className="h-full flex flex-col rounded-md">
        <div
          className="px-2 md:px-0 md:w-[80%] lg:w-[60%] mx-auto flex-1 overflow-y-auto break-words max-w-full pb-2"
          style={{
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {messages.length === 0 && (
            <div className="flex flex-col gap-4 h-full justify-center items-center">
              <div className="text-black/80 dark:text-white/80 text-md md:text-xl lg:text-2xl font-bold ">
                {welcomeMessage}
              </div>
            </div>
          )}

          {messages.map((msg, index) => {
            if (!msg?.content) return null;
            const parts = msg.content.split(/```(\w+)?\n([\s\S]*?)```/g);
            return (
              <div
                key={index}
                className={`relative shadow-md min-h-[2.5rem] text-sm md:text-md md:px-4 p-3 my-5 rounded-md whitespace-wrap ${
                  msg.role === "user"
                    ? "bg-white/40 dark:bg-white/30 backdrop-blur-md text-black/80 dark:text-white/80 self-end ml-auto w-fit"
                    : "bg-black/60 backdrop-blur-md text-white/80 self-start mr-auto w-fit max-w-[calc(100vw-1rem)] md:max-w-full overflow-x-auto pb-10"
                }`}
              >
                {parts.map((part, i) => {
                  if (i % 3 === 1) {
                    const language = part || "text";
                    const code = parts[i + 1] || "";
                    return (
                      <Highlight
                        key={i}
                        theme={themes.vsDark}
                        code={code.trim()}
                        language={language}
                      >
                        {({ style, tokens, getLineProps, getTokenProps }) => (
                          <pre
                            style={{ ...style, backgroundColor: "transparent" }}
                            className="overflow-x-auto p-3 rounded-md"
                          >
                            {tokens.map((line, i) => (
                              <div key={i} {...getLineProps({ line })}>
                                <span className="inline-block w-6 text-gray-400 select-none">
                                  {i + 1}
                                </span>
                                {line.map((token, key) => (
                                  <span
                                    key={key}
                                    {...getTokenProps({ token })}
                                  />
                                ))}
                              </div>
                            ))}
                          </pre>
                        )}
                      </Highlight>
                    );
                  } else if (i % 3 === 0) {
                    // Check for table in the HTML output
                    const html = marked(part);
                    const hasTable = html.includes("<table");
                    return hasTable ? (
                      <div key={i} className="overflow-x-auto max-w-screen">
                        <div
                          className="markdown-output"
                          dangerouslySetInnerHTML={{
                            __html: html,
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        key={i}
                        dangerouslySetInnerHTML={{
                          __html: html,
                        }}
                      />
                    );
                  }
                  return null;
                })}

                {msg.role === "assistant" && (
                  <div className="flex absolute gap-2 bottom-4 right-4 ">
                    <button
                      onClick={() => {
                        if (isSpeaking) {
                          responsiveVoice.cancel();
                          setIsSpeaking(false);
                        } else {
                          const cleanedText = msg.content.replace(
                            /\*\*|\*/g,
                            ""
                          );
                          const langCode = franc(cleanedText);
                          const voiceMap = {
                            hin: "Hindi Male",
                            fra: "French Female",
                            spa: "Spanish Female",
                            eng: "Hindi Male",
                          };
                          const voice = voiceMap[langCode] || "Hindi Male";
                          setIsSpeaking(true);
                          responsiveVoice.speak(cleanedText, voice, {
                            onend: () => {
                              responsiveVoice.pause();
                              setIsSpeaking(false);
                            },
                          });
                        }
                      }}
                    >
                      {isSpeaking ? (
                        <VolumeOff
                          className="w-4.5 h-4.5 animate-pulse
                           text-white/60 hover:text-white"
                        />
                      ) : (
                        <Volume2
                          className="w-4.5 h-4.5 
                           text-white/60 hover:text-white"
                        />
                      )}
                    </button>
                    <button
                      title="Copy Message"
                      onClick={() => {
                        navigator.clipboard.writeText(msg.content);
                        setCopiedIndex(index);
                        setTimeout(() => setCopiedIndex(null), 2000);
                      }}
                    >
                      <Copy className="w-4 h-4 text-white/60 hover:text-white" />
                      {copiedIndex === index && (
                        <div className="absolute top-0 right-0 text-xs text-white bg-black px-2 py-1 rounded">
                          Copied!
                        </div>
                      )}
                    </button>
                    <button
                      title="Share"
                      onClick={() => {
                        const shareText = msg.content
                          .replace(/\*\*|\*/g, "")
                          .trim();
                        const shareData = {
                          title: "Shared from AI-Chat",
                          text: shareText,
                          url: window.location.href,
                        };

                        if (navigator.share) {
                          navigator
                            .share(shareData)
                            .catch((err) =>
                              console.error("Share failed:", err)
                            );
                        } else {
                          // fallback: copy to clipboard
                          navigator.clipboard.writeText(shareText);
                          alert(
                            "Copied to clipboard (sharing not supported on this device)"
                          );
                        }
                      }}
                    >
                      <Share className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        {/* input area */}
        <div
          className="relative p-4 flex flex-col-reverse bg-white dark:bg-black/60 backdrop-blur-md w-full md:w-[60%] max-w-full sm:rounded-b-xl mx-auto"
          // style={{
          //   boxShadow: "rgba(35, 35, 35,0.8)0px -25px 20px -10px",
          // }}
        >
          <div className="w-full flex items-end ">
            <textarea
              name="input-text"
              ref={textareaRef}
              value={text}
              placeholder="Ask anything"
              onInput={handleInput}
              className="w-full mb-8 md:px-2 text-sm text-black/80 dark:text-white/80 md:w-[80%] lg:w-[60%] overflow-y-auto resize-none scrollbar-none placeholder-black/40 dark:placeholder-white/40 placeholder:align-bottom focus:outline-none focus:ring-0 bg-none"
              style={{ height: "2.5rem" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            ></textarea>
            <Link to="/generateImage">
              <Images className="absolute bottom-2.5 left-2 text-black/80 dark:text-white/80 h-6.5 w-6.5 p-1 hover:scale-110" />
            </Link>
            <Link to="/tts">
              <Speech className="absolute bottom-2.5 left-8 text-black/80 dark:text-white/80 h-6.5 w-6.5 p-1 hover:scale-110" />
            </Link>
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
              onClick={() => {
                handleSend();
                setText("");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
