import { LogOut, Trash2 } from "lucide-react";
export const Settings = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#111] shadow-md rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-black dark:text-white text-center">
          Account Settings
        </h2>

        <div className="space-y-4 text-sm">
          <button className="flex justify-between items-center w-full text-left px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300 dark:bg-[rgb(35,35,35)] dark:text-white dark:hover:bg-black">
            Delete all chats <Trash2 className="h-4 w-4" />
          </button>

          <button className="w-full text-left px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300 dark:bg-[rgb(35,35,35)] dark:text-white dark:hover:bg-black">
            About
          </button>

          <button
            className="flex justify-between items-center w-full text-left px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300 dark:bg-[rgb(35,35,35)] dark:text-white dark:hover:bg-black"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              window.location.href = "/";
            }}
          >
            Logout <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
