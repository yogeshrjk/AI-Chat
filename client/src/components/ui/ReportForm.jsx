import { useState } from "react";
import { SquareX } from "lucide-react";
import axios from "axios";

export default function BugForm({ closeForm }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]); // NEW
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // DEBUG: Log selected files
    console.log("Selected files:", selectedFiles);
    console.log("Files count:", selectedFiles.length);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // DEBUG: Log each file being appended
    selectedFiles.forEach((file, index) => {
      console.log(`Appending file ${index}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
      });
      formData.append("files", file);
    });

    try {
      // IMPORTANT: Don't set Content-Type header - let axios handle it
      const { data } = await axios.post(
        import.meta.env.VITE_GRAPHQL_URI + "/api/report",
        formData
      );
      console.log("Report response:", data);
      setMessage("✅ Bug reported successfully!");
      setTitle("");
      setDescription("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response?.data);
      setMessage(
        `❌ Failed to report bug: ${
          error.response?.data?.details || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-[#111] backdrop-blur-md max-w-sm w-full p-10 rounded-lg shadow-lg text-center">
      <SquareX
        className="absolute right-2 top-2 w-5 h-5 text-black dark:text-white hover:text-red-400 cursor-pointer"
        onClick={() => closeForm(false)}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <label
            htmlFor="bugTitle"
            className="ml-1 text-black dark:text-white/80 text-sm flex justify-start"
          >
            Bug title
          </label>
          <input
            id="bugTitle"
            className="border border-black dark:border-white/20 bg-transparent p-2 w-full text-sm text-black dark:text-white rounded-md"
            type="text"
            placeholder="Enter the issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="bugDescription"
            className="ml-1 text-black dark:text-white/80 text-sm flex justify-start"
          >
            Bug description
          </label>
          <textarea
            id="bugDescription"
            className="border border-black dark:border-white/20 bg-transparent p-2 w-full text-sm text-black dark:text-white rounded-md"
            placeholder="Describe the bug"
            value={description}
            rows={10}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        {/* File Upload */}
        <div className="space-y-2">
          <label
            htmlFor="snapshot"
            className="ml-1 text-black dark:text-white/80 text-sm flex justify-start"
          >
            Add snapshot
          </label>
          <input
            id="snapshot"
            className="border border-black dark:border-white/20 bg-transparent p-2 w-full text-sm text-black dark:text-white/50 rounded-md"
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </div>
        {/* Submit Button */}
        <button
          className="bg-[#111] dark:bg-white/10 hover:scale-105 dark:hover:bg-white/20 transition-colors text-white dark:text-white/70 dark:hover:text-black text-sm px-4 py-2 rounded-md w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Bug"}
        </button>

        {/* Feedback Message */}
        {message && (
          <p className="text-xs text-black dark:text-white/70 mt-2">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
