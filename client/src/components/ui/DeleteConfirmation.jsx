export const DeleteConfirmation = (props) => {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#111] max-w-sm w-full p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold text-black dark:text-white mb-3">
          Are you sure?
        </h2>
        <p className="text-black/60 dark:text-white/60 mb-6">
          This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-5 py-1 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            onClick={props.onConfirm}
          >
            Delete
          </button>
          <button
            className="px-5 py-1 bg-black/80 dark:bg-white/60  text-white dark:text-black rounded-md hover:bg-black dark:hover:bg-white transition-colors duration-200"
            onClick={props.onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
