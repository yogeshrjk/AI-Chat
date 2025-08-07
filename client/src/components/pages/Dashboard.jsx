import { useState, useEffect } from "react";
import { Sidebar } from "../ui/Sidebar";
import { TopBar } from "../ui/Top-Nav";
import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
export default function Dashboard() {
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
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currModel, setCurrModel] = useState("llama-3.1-8b-instant");
  const [conversationID, setConversationID] = useState(() => {
    return sessionStorage.getItem("conversationID") || null;
  });
  const [modelList, setModelList] = useState([
    {
      developer: "Meta",
      modelId: "llama-3.1-8b-instant",
      selected: false,
    },
    {
      developer: "Meta",
      modelId: "llama-3.3-70b-versatile",
      selected: false,
    },
    {
      developer: "Google",
      modelId: "gemma2-9b-it",
      selected: true,
    },
    {
      developer: "OpenAI",
      modelId: "openai/gpt-oss-120b:novita",
      selected: false,
    },
  ]);

  //dark theme
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  // Sync dark mode with document and localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isNavOpen={isNavOpen}
          toggleSidebar={() => setIsNavOpen(!isNavOpen)}
          userID={userID}
          onSelectConversation={(id) => {
            sessionStorage.setItem("conversationID", id);
            setConversationID(id);
          }}
        />

        {/* Right side layout */}
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ${
            isNavOpen ? "sm:ml-64" : "sm:ml-15"
          }`}
        >
          {/* Topbar */}
          <div className="h-12 shadow z-10">
            <TopBar
              model={modelList}
              setModel={setModelList}
              setCurrModelProp={setCurrModel}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              userID={userID}
            />
          </div>

          {/* Main content */}
          <div className="overflow-y-auto h-screen">
            <Outlet
              context={{ model: currModel, userID: userID, conversationID }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
