import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck, Reply, Trash2, Smile, X } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const EMOJIS = ["❤️", "😂", "😮", "😢", "👍", "🔥"];

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    typingUser,
    setReplyTo,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [showEmojiFor, setShowEmojiFor] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState(null); // { messageId, isMine }
  const [isDeleting, setIsDeleting] = useState(false);

  // Long press for mobile
  const longPressTimer = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingUser]);

  const openDeleteModal = (message) => {
    const isMine = message.senderId === authUser._id;
    setDeleteModal({ messageId: message._id, isMine });
    setShowEmojiFor(null);
  };

  const handleDelete = async (scope) => {
    if (!deleteModal) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/messages/${deleteModal.messageId}`, {
        data: { deleteFor: scope },
      });
      useChatStore.setState((state) => ({
        messages: state.messages.filter((m) => m._id !== deleteModal.messageId),
      }));
      toast.success(scope === "everyone" ? "Deleted for everyone" : "Deleted for you");
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot delete message");
    } finally {
      setIsDeleting(false);
      setDeleteModal(null);
    }
  };

  const handleReact = async (messageId, emoji) => {
    try {
      await axiosInstance.post(`/messages/${messageId}/react`, { emoji });
      getMessages(selectedUser._id);
    } catch (error) {
      toast.error("Could not react");
    }
    setShowEmojiFor(null);
  };

  const handleTouchStart = (message) => {
    longPressTimer.current = setTimeout(() => openDeleteModal(message), 500);
  };
  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <>
      <div
        className="flex-1 flex flex-col overflow-auto"
        onClick={() => setShowEmojiFor(null)}
      >
        <ChatHeader />

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isMine = message.senderId === authUser._id;
            const isEmojiOpen = showEmojiFor === message._id;

            return (
              <div key={message._id} className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={isMine ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                      alt="profile pic"
                    />
                  </div>
                </div>

                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>

                <div className={`group flex items-center gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Bubble */}
                  <div
                    className={`chat-bubble flex flex-col max-w-xs sm:max-w-sm md:max-w-md cursor-pointer select-none ${
                      isMine ? "bg-primary text-primary-content" : "bg-base-200"
                    }`}
                    onContextMenu={(e) => { e.preventDefault(); openDeleteModal(message); }}
                    onTouchStart={() => handleTouchStart(message)}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchEnd}>
                    {message.replyTo && (
                      <div className="bg-black/10 p-2 rounded mb-1 border-l-4 border-primary text-xs">
                        <p className="font-semibold opacity-70 mb-0.5">
                          {message.replyTo.senderId === authUser._id ? "You" : selectedUser.fullName}
                          </p>
                          <p className="truncate opacity-80 italic">
                            {message.replyTo.text || "Attachment"}
                            </p>
                            </div>
                          )}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                        onClick={() => window.open(message.image, "_blank")}
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                    {isMine && (
                      <div className="flex justify-end mt-1">
                        {message.status === "sent" && <Check size={14} className="opacity-70" />}
                        {message.status === "delivered" && <CheckCheck size={14} className="opacity-70" />}
                        {message.status === "seen" && <CheckCheck size={14} className="text-blue-400" />}
                      </div>
                    )}
                  </div>

                  {/* Hover action buttons */}
                  <div className={`flex flex-col gap-1 transition-opacity duration-150 opacity-0 group-hover:opacity-100 ${isEmojiOpen ? "opacity-100" : ""}`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setReplyTo(message); }}
                      className="btn btn-xs btn-ghost btn-circle bg-base-200 hover:bg-base-300"
                      title="Reply"
                    >
                      <Reply size={13} />
                    </button>

                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowEmojiFor(isEmojiOpen ? null : message._id); }}
                        className="btn btn-xs btn-ghost btn-circle bg-base-200 hover:bg-base-300"
                        title="React"
                      >
                        <Smile size={13} />
                      </button>
                      {isEmojiOpen && (
                        <div
                          className={`absolute bottom-8 ${isMine ? "right-0" : "left-0"} flex gap-1 bg-base-100 border border-base-300 rounded-full px-2 py-1 shadow-lg z-10`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {EMOJIS.map((emoji) => (
                            <button key={emoji} onClick={() => handleReact(message._id, emoji)}
                              className="text-lg hover:scale-125 transition-transform">
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Trash button → opens delete modal */}
                    <button
                      onClick={(e) => { e.stopPropagation(); openDeleteModal(message); }}
                      className="btn btn-xs btn-ghost btn-circle bg-base-200 hover:bg-error hover:text-white"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {message.reactions?.length > 0 && (
                  <div className={`flex gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                    {message.reactions.map((r, i) => (
                      <span key={i} className="text-xs bg-base-300 rounded-full px-1.5 py-0.5 shadow-sm">{r.emoji}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {typingUser === selectedUser._id && (
            <div className="chat chat-start">
              <div className="chat-bubble bg-base-200 text-xs italic flex items-center gap-2">
                {selectedUser.fullName} is typing
                <span className="loading loading-dots loading-xs"></span>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        <MessageInput />
      </div>

      {/* ✅ WhatsApp-style Delete Modal */}
      {deleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => !isDeleting && setDeleteModal(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Bottom sheet / modal */}
          <div
            className="relative z-10 w-full sm:w-96 bg-base-100 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-base-200">
              <div className="flex items-center gap-2">
                <Trash2 size={18} className="text-error" />
                <span className="font-semibold">Delete Message?</span>
              </div>
              <button
                onClick={() => !isDeleting && setDeleteModal(null)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                <X size={16} />
              </button>
            </div>

            {/* Options */}
            <div className="p-3 space-y-1">
              {/* Delete for Everyone — only if sender */}
              {deleteModal.isMine && (
                <button
                  onClick={() => handleDelete("everyone")}
                  disabled={isDeleting}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-error/10 active:bg-error/20 transition-colors disabled:opacity-50 text-left group/btn"
                >
                  <div className="size-10 rounded-full bg-error/10 flex items-center justify-center shrink-0 group-hover/btn:bg-error/20 transition-colors">
                    <Trash2 size={18} className="text-error" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-error">Delete for everyone</p>
                    <p className="text-xs text-base-content/50 mt-0.5">Remove this message for all participants</p>
                  </div>
                </button>
              )}

              {/* Delete for Me */}
              <button
                onClick={() => handleDelete("me")}
                disabled={isDeleting}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-base-200 active:bg-base-300 transition-colors disabled:opacity-50 text-left"
              >
                <div className="size-10 rounded-full bg-base-200 flex items-center justify-center shrink-0">
                  <Trash2 size={18} className="text-base-content/60" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Delete for me</p>
                  <p className="text-xs text-base-content/50 mt-0.5">Only you will no longer see this message</p>
                </div>
              </button>

              {/* Cancel */}
              <button
                onClick={() => setDeleteModal(null)}
                disabled={isDeleting}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-base-200 active:bg-base-300 transition-colors disabled:opacity-50 text-left"
              >
                <div className="size-10 rounded-full bg-base-200 flex items-center justify-center shrink-0">
                  <X size={18} className="text-base-content/60" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Cancel</p>
                </div>
              </button>
            </div>

            {isDeleting && (
              <div className="px-5 pb-4 pt-1 flex items-center gap-2 text-sm text-base-content/50">
                <span className="loading loading-spinner loading-xs" />
                Deleting...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatContainer;