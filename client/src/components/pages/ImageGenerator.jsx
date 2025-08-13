import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Images, ArrowUp, Copy, Download } from "lucide-react";

export default function ImageGenerator() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    const userMsg = { role: "user", content: prompt.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    try {
      const imgElement = await puter.ai.txt2img(prompt.trim(), false);
      const canvas = document.createElement("canvas");
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imgElement, 0, 0);
      const imgURL = canvas.toDataURL();

      const assistantMsg = {
        role: "assistant",
        content: imgURL,
        isImage: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Image generation error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Failed to generate image." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full md:pb-5 select-text">
      <div className="h-full flex flex-col rounded-md">
        {/* Messages */}
        <div
          className="px-2 md:px-0 md:w-[80%] lg:w-[60%] mx-auto flex-1 overflow-y-auto break-words max-w-full pb-2"
          style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`relative shadow-md min-h-[2.5rem] text-sm md:text-md md:px-4 p-3 my-5 rounded-md whitespace-wrap ${
                msg.role === "user"
                  ? "bg-white/40 dark:bg-white/30 backdrop-blur-md text-black/80 dark:text-white/80 self-end ml-auto w-fit"
                  : "bg-black/60 backdrop-blur-md text-white/80 self-start mr-auto w-fit max-w-full overflow-x-auto pb-10"
              }`}
            >
              {msg.isImage ? (
                <div className="flex flex-col items-start">
                  <img
                    src={msg.content}
                    alt="Generated"
                    className="max-w-xs rounded-md"
                  />
                  <div className="absolute bottom-3 right-4 flex gap-2 mt-2">
                    <button
                      title="Copy Image URL"
                      onClick={() => {
                        navigator.clipboard.writeText(msg.content);
                      }}
                    >
                      <Copy className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                    <a href={msg.content} download="generated.png">
                      <Download className="w-4 h-4 text-white/60 hover:text-white" />
                    </a>
                  </div>
                </div>
              ) : (
                msg.content
              )}
            </div>
          ))}
          {loading && (
            <div className="relative shadow-md min-h-[2.5rem] text-sm md:text-md md:px-4 p-3 my-5 rounded-md whitespace-wrap bg-black/60 backdrop-blur-md text-white/80 self-start mr-auto w-fit max-w-full overflow-x-auto pb-10">
              <span className="animate-pulse">Generating...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="relative p-4 flex flex-col-reverse bg-white dark:bg-black/60 backdrop-blur-md w-full md:w-[60%] max-w-full sm:rounded-b-xl mx-auto">
          <div className="w-full flex items-end">
            <textarea
              value={prompt}
              placeholder="Enter image description..."
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full mb-8 md:px-2 text-sm text-black/80 dark:text-white/80 md:w-[80%] lg:w-[60%] resize-none scrollbar-none placeholder-black/40 dark:placeholder-white/40 focus:outline-none bg-none"
              style={{ height: "2.5rem" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateImage();
                }
              }}
            />
            <Link to="/chat">
              <Images className="absolute bottom-2.5 left-2 text-black/80 dark:text-white/80 h-6.5 w-6.5 p-1 hover:scale-110" />
            </Link>
            <ArrowUp
              className="absolute bottom-3 right-3 bg-[#111] dark:bg-white text-white dark:text-black rounded-full h-6 w-6 p-0.5 hover:scale-110"
              onClick={generateImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
