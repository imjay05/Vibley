import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, formatRelativeTime } from "../lib/utils";
import { Check, CheckCheck, Clock, Reply, Trash2 } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

 const StatusLabel = ({ message }) => {
  const { status, seenAt, createdAt } = message;

  if (status === "sending") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-purple-700 mt-0.5">
        <Clock className="size-2.5" />
        Sending…
      </span>
    );
  }

  if (status === "sent") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-purple-700 mt-0.5">
        <Check className="size-2.5" />
        Sent · {formatRelativeTime(createdAt)}
      </span>
    );
  }

  if (status === "delivered") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-purple-700 mt-0.5">
        <CheckCheck className="size-2.5 opacity-60" />
        Delivered · {formatRelativeTime(createdAt)}
      </span>
    );
  }

  if (status === "seen") {
    return (
      <span className="flex items-center gap-0.5 text-[10px] text-purple-700 mt-0.5">
        <CheckCheck className="size-2.5" />
        Seen · {formatRelativeTime(seenAt || createdAt)}
      </span>
    );
  }

  return null;
};

const DeleteModal = ({ modal, isDeleting, onDelete, onClose }) => {
  if (!modal) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left"
            >
              <div className="size-9 bg-red-50 rounded-full flex items-center justify-center">
                <Trash2 className="size-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-500">
                  Delete for everyone
                </p>
                <p className="text-xs text-gray-400">
                  Removes for all participants
                </p>
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
              <p className="text-sm font-semibold text-gray-700">
                Delete for me
              </p>
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

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    setReplyTo,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const longPressTimer = useRef(null);
  // Tick every 30s so relative timestamps stay fresh
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  if (!selectedUser?._id) return;

  getMessages(selectedUser._id);
  subscribeToMessages();

  return () => unsubscribeFromMessages();
}, [selectedUser?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openDeleteModal = (message) => {
    setDeleteModal({
      messageId: message._id,
      isMine: message.senderId === authUser._id,
    });
  };

  const handleDelete = async (scope) => {
    if (!deleteModal) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/messages/${deleteModal.messageId}`, {
        data: { deleteFor: scope },
      });
      useChatStore.setState((s) => ({
        messages: s.messages.filter((m) => m._id !== deleteModal.messageId),
      }));
      toast.success(
        scope === "everyone" ? "Deleted for everyone" : "Deleted for you"
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot delete");
    } finally {
      setIsDeleting(false);
      setDeleteModal(null);
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-gray-50">
          {messages.map((message, i) => {
            const isMine = message.senderId === authUser._id;
            const isSending = message.status === "sending";

            return (
              <div
                key={message._id}
                className={`flex items-end gap-2 msg-row animate-fade-up ${
                  isMine ? "flex-row-reverse" : ""
                }`}
                style={{ animationDelay: `${Math.min(i * 20, 300)}ms` }}
              >
                <img
                  src={
                    isMine
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="avatar"
                  className="size-7 rounded-full object-cover flex-shrink-0 mb-1"
                />

                <div
                  className={`flex items-end gap-1 ${
                    isMine ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                    <div
                      className={`msg-bubble px-3 py-2 rounded-2xl text-sm shadow-sm transition-opacity ${
                        isMine
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                      } ${isSending ? "opacity-60" : "opacity-100"}`}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (!isSending) openDeleteModal(message);
                      }}
                      onTouchStart={() => {
                        if (!isSending)
                          longPressTimer.current = setTimeout(
                            () => openDeleteModal(message),
                            500
                          );
                      }}
                      onTouchEnd={() => clearTimeout(longPressTimer.current)}
                      onTouchMove={() => clearTimeout(longPressTimer.current)}
                    >
                      {/* Reply preview */}
                      {message.replyTo && (
                        <div
                          className={`mb-1.5 px-2 py-1 rounded-lg border-l-2 text-xs ${
                            isMine
                              ? "bg-blue-500/50 border-blue-200"
                              : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          <p className="font-semibold opacity-80">
                            {message.replyTo.senderId === authUser._id
                              ? "You"
                              : selectedUser.fullName}
                          </p>
                          <p className="opacity-70 truncate">
                            {message.replyTo.text || "Attachment"}
                          </p>
                        </div>
                      )}

                      {message.image && (
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="max-w-[180px] rounded-lg mb-1.5 cursor-pointer"
                          onClick={() =>
                            window.open(message.image, "_blank")
                          }
                        />
                      )}
                      {message.text && (
                        <p className="leading-relaxed">{message.text}</p>
                      )}

                      {/* Time row inside bubble */}
                      <div
                        className={`flex items-center gap-1 mt-0.5 ${
                          isMine ? "justify-end" : "justify-start"
                        }`}>
                        <span
                          className={`text-[10px] ${
                            isMine ? "text-blue-200" : "text-gray-400"
                          }`}>
                          {formatMessageTime(message.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Status label BELOW the bubble — only for outgoing */}
                    {isMine && <StatusLabel message={message} />}
                  </div>
                  {!isSending && (
                    <div
                      className={`msg-actions flex flex-col gap-1 mb-6 ${
                        isMine ? "items-end" : "items-start"
                      }`}>
                      <button
                        onClick={() => setReplyTo(message)}
                        className="size-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm transition-colors"
                        title="Reply">
                        <Reply className="size-3 text-gray-500" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(message)}
                        className="size-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-200 shadow-sm transition-colors"
                        title="Delete">
                        <Trash2 className="size-3 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messageEndRef} />
        </div>

        <MessageInput />
      </div>

      <DeleteModal
        modal={deleteModal}
        isDeleting={isDeleting}
        onDelete={handleDelete}
        onClose={() => setDeleteModal(null)}
      />
    </>
  );
};

export default ChatContainer;