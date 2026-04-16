import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck, Reply, Trash2, Smile } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import DeleteModal from "./DeleteModal";
import "./ChatContainer.css";

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

  const [deleteModal, setDeleteModal] = useState(null); // { messageId, isMine }
  const [isDeleting, setIsDeleting] = useState(false);

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
      <div className="chat-container">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <>
      <div className="chat-container" onClick={() => setShowEmojiFor(null)}>
        <ChatHeader />

        <div className="message-list">
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

                <div className={`group message-actions-group ${isMine ? "mine" : "theirs"}`}>
                  {/* Bubble */}
                  <div
                    className={`chat-bubble chat-bubble-custom ${
                      isMine ? "bg-primary text-primary-content" : "bg-base-200"
                    }`}
                    onContextMenu={(e) => { e.preventDefault(); openDeleteModal(message); }}
                    onTouchStart={() => handleTouchStart(message)}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchEnd}
                  >
                    {message.replyTo && (
                      <div className="reply-preview">
                        <p className="reply-preview-sender">
                          {message.replyTo.senderId === authUser._id ? "You" : selectedUser.fullName}
                        </p>
                        <p className="reply-preview-text">
                          {message.replyTo.text || "Attachment"}
                        </p>
                      </div>
                    )}
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="message-image"
                        onClick={() => window.open(message.image, "_blank")}
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                    {isMine && (
                      <div className="message-status">
                        {message.status === "sent" && <Check size={14} className="status-icon" />}
                        {message.status === "delivered" && <CheckCheck size={14} className="status-icon" />}
                        {message.status === "seen" && <CheckCheck size={14} className="status-icon seen" />}
                      </div>
                    )}
                  </div>

                  {/* Hover action buttons */}
                  <div className={`message-action-buttons ${isEmojiOpen ? "emoji-open" : ""}`}>
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
                          className={`emoji-picker ${isMine ? "mine" : "theirs"}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {EMOJIS.map((emoji) => (
                            <button key={emoji} onClick={() => handleReact(message._id, emoji)} className="emoji-btn">
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

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
                  <div className={`reactions-row ${isMine ? "mine" : "theirs"}`}>
                    {message.reactions.map((r, i) => (
                      <span key={i} className="reaction-badge">{r.emoji}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {typingUser === selectedUser._id && (
            <div className="chat chat-start">
              <div className="chat-bubble bg-base-200 typing-bubble">
                {selectedUser.fullName} is typing
                <span className="loading loading-dots loading-xs"></span>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        <MessageInput />
      </div>

      <DeleteModal
        deleteModal={deleteModal}
        isDeleting={isDeleting}
        onDelete={handleDelete}
        onClose={() => setDeleteModal(null)}
      />
    </>
  );
};

export default ChatContainer;