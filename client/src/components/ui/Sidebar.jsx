import {
  SquarePen,
  Images,
  History,
  Settings,
  PanelLeftOpen,
  PanelLeftClose,
  BotMessageSquare,
  AudioLines,
  Speech,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
const navigation = [
  { name: "New Chat", icon: SquarePen, key: "chat", url: "/newchat" },
  { name: "Image Generator", icon: Images, key: "images" },
  { name: "Voice Chat", icon: AudioLines, key: "voice", url: "/voiceChat" },
  { name: "Text to speech", icon: Speech, key: "tts", url: "/tts" },
  { name: "Settings", icon: Settings, key: "settings", url: "/settings" },
  { name: "History", icon: History, key: "history" },
];

export function Sidebar({ isNavOpen, toggleSidebar }) {
  const [isMobileVisible, setIsMobileVisible] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileVisible((prev) => !prev)}
        className="absolute top-3.5 left-5 block sm:hidden z-50"
      >
        {isMobileVisible ? (
          <PanelLeftOpen className="h-5 w-5 transition-transform duration-200 rotate-180 " />
        ) : (
          <PanelLeftClose className="h-5 w-5 transition-transform duration-200 rotate-180" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`group fixed bg-white/80 dark:bg-black/40 dark:backdrop-blur-md left-0 top-0 z-40 h-screen overflow-hidden shadow-md shadow-r-lg transition-all duration-300 ${
          isNavOpen ? "sm:w-64" : "w-full sm:w-15"
        } ${isMobileVisible ? "block" : "hidden"} sm:block`}
      >
        <div className="flex justify-between h-full flex-col">
          <div>
            {/* Header */}
            <div
              className={`flex h-12 items-center px-2 ${
                isNavOpen ? "justify-between" : "justify-center"
              }`}
            >
              <div
                className={`logo text-lg p-2 rounded-md ${
                  isNavOpen ? "block" : "hidden"
                }`}
              >
                <BotMessageSquare />
              </div>

              <button
                size="icon"
                onClick={toggleSidebar}
                className="hidden sm:block"
              >
                {isNavOpen ? (
                  <PanelLeftOpen className="h-5 w-5 transition-transform duration-200 rotate-180 " />
                ) : (
                  <PanelLeftClose className="h-5 w-5 transition-transform duration-200 rotate-180" />
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col items-center gap-1 p-2 mt-2">
              {navigation.map((item) => (
                <Link
                  to={item.url}
                  key={item.key}
                  {...(!isNavOpen ? { title: item.name } : {})}
                  className={`w-full flex items-center text-[0.8300rem] hover:bg-black/20 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white rounded-lg ${
                    isNavOpen
                      ? "justify-start p-2"
                      : "sm:justify-center px-1 py-2 ml-5 sm:ml-0"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span
                    className={`ml-3 transition-opacity duration-200 ${
                      isNavOpen ? "block" : " block sm:hidden"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div
            className={`flex items-center gap-4 mb-4 ${
              !isNavOpen && !isMobileVisible ? "mx-auto" : "ml-4"
            }`}
          >
            <img
              src="./ab.jpg"
              width={"35px"}
              alt="profile pic"
              className={`rounded-full  ${!isNavOpen && "ml-3"}`}
            />
            <div
              className={`
    flex flex-col
    ${
      isNavOpen || isMobileVisible
        ? "transition-all duration-500 delay-200 opacity-100"
        : "opacity-0 pointer-events-none"
    }
  `}
            >
              <span className="text-sm">Yogesh Rajak</span>
              <span className="text-xs">yrajak9@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
