import { useState, useEffect } from "react";
import { Sidebar } from "../ui/Sidebar";
import { TopBar } from "../ui/Top-Nav";
import { Outlet } from "react-router-dom";
export default function Dashboard() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [currModel, setCurrModel] = useState("llama-3.1-8b-instant");
  const [modelList, setModelList] = useState([
    {
      developer: "Meta",
      modelId: "llama-3.1-8b-instant",
      selected: true,
    },
    {
      developer: "Meta",
      modelId: "llama-3.3-70b-versatile",
      selected: false,
    },
    {
      developer: "Google",
      modelId: "gemma2-9b-it",
      selected: false,
    },
  ]);

  //dark theme
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "light"
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
            />
          </div>

          {/* Main content */}
          <div className="overflow-y-auto h-screen">
            <Outlet context={{ model: currModel }} />
          </div>
        </div>
      </div>
    </>
  );
}
