import { Trash2 } from "lucide-react";

const DeleteModal = ({ modal, isDeleting, onDelete, onClose }) => {
  if (!modal) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose} />
      <div className="relative z-10 w-full sm:w-80 bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold text-sm">Delete message</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none">
            ×
          </button>
        </div>
        <div className="p-3 space-y-1">
          {modal.isMine && (
            <button
              onClick={() => onDelete("everyone")}
              disabled={isDeleting}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left">
              <div className="size-9 bg-red-50 rounded-full flex items-center justify-center">
                <Trash2 className="size-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-500">Delete for everyone</p>
                <p className="text-xs text-gray-400">Removes for all participants</p>
              </div>
            </button>
          )}
          <button
            onClick={() => onDelete("me")}
            disabled={isDeleting}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <div className="size-9 bg-gray-100 rounded-full flex items-center justify-center">
              <Trash2 className="size-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Delete for me</p>
              <p className="text-xs text-gray-400">Only you won't see this</p>
            </div>
          </button>
        </div>
        {isDeleting && (
          <p className="px-5 pb-3 text-xs text-gray-400 flex items-center gap-1">
            <span className="loading loading-spinner loading-xs" /> Deleting…
          </p>
        )}
      </div>
    </div>
  );
};

export default DeleteModal;