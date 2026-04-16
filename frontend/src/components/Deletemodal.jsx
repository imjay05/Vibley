import { Trash2, X } from "lucide-react";

const DeleteModal = ({ deleteModal, isDeleting, onDelete, onClose }) => {
  if (!deleteModal) return null;

  return (
    <div
      className="delete-modal-overlay"
      onClick={() => !isDeleting && onClose()}>
      <div className="delete-modal-backdrop" />

      <div
        className="delete-modal-sheet"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="delete-modal-header">
          <div className="delete-modal-title">
            <Trash2 size={18} className="text-error" />
            <span>Delete Message?</span>
          </div>
          <button
            onClick={() => !isDeleting && onClose()}
            className="btn btn-ghost btn-xs btn-circle">
            <X size={16} />
          </button>
        </div>

        {/* Options */}
        <div className="delete-modal-options">
          {deleteModal.isMine && (
            <button
              onClick={() => onDelete("everyone")}
              disabled={isDeleting}
              className="delete-option-btn danger">
              <div className="delete-option-icon danger">
                <Trash2 size={18} className="text-error" />
              </div>
              <div>
                <p className="delete-option-label danger">Delete for everyone</p>
                <p className="delete-option-sublabel">Remove this message for all participants</p>
              </div>
            </button>
          )}

          <button
            onClick={() => onDelete("me")}
            disabled={isDeleting}
            className="delete-option-btn neutral">
            <div className="delete-option-icon neutral">
              <Trash2 size={18} className="text-base-content/60" />
            </div>
            <div>
              <p className="delete-option-label">Delete for me</p>
              <p className="delete-option-sublabel">Only you will no longer see this message</p>
            </div>
          </button>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="delete-option-btn neutral">
            <div className="delete-option-icon neutral">
              <X size={18} className="text-base-content/60" />
            </div>
            <div>
              <p className="delete-option-label">Cancel</p>
            </div>
          </button>
        </div>

        {isDeleting && (
          <div className="deleting-row">
            <span className="loading loading-spinner loading-xs" />
            Deleting...
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteModal;