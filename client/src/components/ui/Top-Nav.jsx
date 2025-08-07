import {
  EllipsisVertical,
  ChevronDown,
  ChevronUp,
  Share,
  Check,
  Trash2,
  Sun,
  Moon,
  Bug,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DeleteConfirmation } from "../ui/DeleteConfirmation";
import BugForm from "./ReportForm";
import { gql, useMutation } from "@apollo/client";

export const TopBar = ({
  model,
  setModel,
  setCurrModelProp,
  darkMode,
  setDarkMode,
  userID,
}) => {
  const [showModels, setShowModels] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const dropdownRef = useRef(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    userID: null,
  });

  const DELETE_CHAT = gql`
    mutation deleteChatsByUser($userID: ID!) {
      deleteChatsByUser(userID: $userID)
    }
  `;
  const DELETE_TTS_CHAT = gql`
    mutation deleteTtsChatsByUser($userID: ID!) {
      deleteTtsChatsByUser(userID: $userID)
    }
  `;

  const [deleteChats] = useMutation(DELETE_CHAT);
  const [deleteTtsChats] = useMutation(DELETE_TTS_CHAT);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowModels(false);
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onClick={(e) => {
        // Close only if the click target is outside the profile and bell icons
        const isClickInsideIcon =
          e.target.closest(".ellipsis-icn") || e.target.closest(".chevron-icn");
        if (!isClickInsideIcon) {
          setShowModels(false);
          setShowOptions(false);
        }
      }}
    >
      {/* TopBar */}
      <div className="flex items-center px-4 py-2 w-full select-none bg-white/80 dark:bg-black/40">
        <div
          className="chevron-icn flex items-center gap-1 hover:bg-black/10 dark:hover:bg-white/10 py-1 px-2 rounded-lg cursor-pointer mx-auto sm:mx-0"
          onClick={() => setShowModels(!showModels)}
        >
          <span className="text-sm ">AI-Chat</span>
          {!showModels ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </div>
        <div className="flex items-center absolute right-3">
          <button
            onClick={() => {
              const newMode = !darkMode;
              setDarkMode(newMode);
              const theme = newMode ? "dark" : "light";
              localStorage.setItem("theme", theme);
              if (theme === "dark") {
                document.documentElement.classList.add("dark");
              } else {
                document.documentElement.classList.remove("dark");
              }
            }}
            className="text-xl text-[rgb(35,35,35)] dark:text-white/80  hover:bg-black/10 dark:hover:bg-white/10 p-1.5 rounded-lg cursor-pointer"
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun fill="currentColor" className="w-5 h-5" />
            ) : (
              <Moon fill="currentColor" className="w-5 h-5" />
            )}
          </button>
          <Share className="h-8 w-8 hover:bg-black/10 dark:hover:bg-white/10  p-2 rounded-lg cursor-pointer" />
          <EllipsisVertical
            className="ellipsis-icn h-8 w-8 hover:bg-black/10 dark:hover:bg-white/10  p-2 rounded-lg cursor-pointer"
            onClick={() => setShowOptions(!showOptions)}
          />
        </div>
      </div>
      {showOptions && (
        <div className="absolute top-11 right-0 w-full sm:w-auto flex items-start z-50 select-none">
          <div className="bg-white/80 dark:bg-[#111] backdrop-blur-md p-4 sm:rounded-bl-lg w-full sm:w-auto space-y-1 ">
            <div
              className="flex gap-2 items-center hover:bg-black/10 dark:hover:bg-white/10 px-4 py-2 rounded-md text-black dark:text-white/90 "
              onClick={() => {
                setShowReportForm(true);
                console.log("Clicked Report");
              }}
            >
              <Bug className="w-4 h-4 " />
              <span className="text-sm">Report</span>
            </div>
            <div
              className="flex gap-2 items-center hover:bg-black/10 dark:hover:bg-white/10 px-4 py-2 rounded-md text-red-400 hover:text-red-600"
              onClick={() => setDeleteConfirm({ show: true, userID: userID })}
            >
              <Trash2 className="w-4 h-4 " />
              <span className="text-sm">Delete</span>
            </div>
          </div>
        </div>
      )}
      {showModels && (
        <div className="absolute top-11 w-full sm:w-auto flex items-start z-50 select-none">
          <div className="bg-white/80 dark:bg-[#111] backdrop-blur-md p-4 sm:rounded-br-lg w-full sm:w-auto ">
            {model.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-5 justify-between items-center text-black dark:text-white/90 hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded cursor-pointer "
                onClick={() => {
                  // Update selection in parent state
                  setModel(
                    model.map((m) => ({
                      ...m,
                      selected: m.modelId === item.modelId,
                    }))
                  );
                  setCurrModelProp(item.modelId);
                  setShowModels(false);
                }}
              >
                <div>
                  <span className="text-xs font-medium text-black dark:text-white/90">
                    {item.developer} :
                  </span>
                  <span className="text-xs text-black dark:text-white/90">
                    {item.modelId}
                  </span>
                </div>
                {item.selected && (
                  <Check className="h-4 w-4 text-black dark:text-white/90" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {deleteConfirm.show && (
        <DeleteConfirmation
          onConfirm={() => {
            deleteChats({ variables: { userID: deleteConfirm.userID } });
            deleteTtsChats({
              variables: { userID: deleteConfirm.userID },
            });
            setDeleteConfirm({ show: false, userID: null });
            window.location.reload();
          }}
          onCancel={() => setDeleteConfirm({ show: false, userID: null })}
        />
      )}
      {showReportForm && (
        <div className="fixed inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <BugForm closeForm={setShowReportForm} />
        </div>
      )}
    </div>
  );
};
