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
  CornerDownRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const navigation = [
  { name: "New Chat", icon: SquarePen, key: "chat", url: "/newchat" },
  { name: "Image Generator", icon: Images, key: "images" },
  { name: "Voice Chat", icon: AudioLines, key: "voice", url: "/voiceChat" },
  { name: "Text to speech", icon: Speech, key: "tts", url: "/tts" },
  { name: "Settings", icon: Settings, key: "settings", url: "/settings" },
];

export function Sidebar({
  isNavOpen,
  toggleSidebar,
  userID,
  onSelectConversation,
}) {
  const [isMobileVisible, setIsMobileVisible] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  const GET_USER = gql`
    query getUser($userID: ID!) {
      getUser(_id: $userID) {
        _id
        firstName
        lastName
        email
        profilePic
      }
    }
  `;
  const GET_CONVERSATIONS = gql`
    query GetConversations($userID: ID!) {
      getConversations(userID: $userID) {
        _id
        title
        createdAt
      }
    }
  `;

  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: { userID },
  });
  const {
    data: convoData,
    loading: convoLoading,
    refetch: refetchConversations,
  } = useQuery(GET_CONVERSATIONS, {
    variables: { userID },
  });

  const user = data?.getUser;
  useEffect(() => {
    refetchConversations();
  }, []);
  if (loading) return null;
  if (!user) return <p className="text-red-500">User not found</p>;
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
              {navigation.map((item) => {
                if (item.name === "New Chat") {
                  return (
                    <Link
                      to={item.url}
                      key={item.key}
                      onClick={() => {
                        sessionStorage.setItem("newChat", "true");
                        sessionStorage.removeItem("conversationID");
                        onSelectConversation(null);
                      }}
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
                  );
                } else {
                  return (
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
                  );
                }
              })}
            </nav>
            {isNavOpen && (
              <div className="flex justify-between items-center px-2 py-2 mx-2 mb-2 text-[0.8300rem] hover:bg-black/20 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white rounded-lg select-none cursor-pointer">
                <div className="flex gap-2 items-center">
                  <History className="h-4 w-4" />
                  Recent Chats
                </div>
                {showRecent ? (
                  <ChevronUp
                    className="h-4 w-4 mr-5"
                    onClick={() => setShowRecent(false)}
                  />
                ) : (
                  <ChevronDown
                    className="h-4 w-4 mr-5"
                    onClick={() => setShowRecent(true)}
                  />
                )}
              </div>
            )}
            <div className="px-2 max-h-[40vh] lg:max-h-[50vh] ml-2 space-y-1 overflow-y-auto">
              {convoData?.getConversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => {
                    onSelectConversation(conv._id);
                    refetchConversations();
                  }}
                  className={`w-full flex gap-2 text-left text-sm truncate px-2 py-2 rounded-lg ${
                    conv._id === sessionStorage.getItem("conversationID")
                      ? "text-black dark:text-white"
                      : "text-black/60 dark:text-white/60 hover:bg-black/20 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                  } ${
                    (isNavOpen && showRecent) || isMobileVisible
                      ? "block"
                      : "hidden"
                  }`}
                >
                  <CornerDownRight className="h-4 w-4" />
                  {conv.title || "Untitled"}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`flex items-center gap-4 mb-4 ${
              !isNavOpen && !isMobileVisible ? "mx-auto" : "ml-4"
            }`}
          >
            <img
              src={user.profilePic}
              width={"35px"}
              alt="profile pic"
              className={`rounded-full  ${!isNavOpen && "ml-3"}`}
            />
            {user && (
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
                <span className="text-sm">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs">{user.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
