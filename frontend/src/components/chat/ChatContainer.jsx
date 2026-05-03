import { useChatStore } from "../../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime } from "../../lib/Utils";
import { Reply, Trash2 } from "lucide-react";
import { axiosInstance } from "../../lib/Axios";
import toast from "react-hot-toast";
import StatusLabel from "./StatusLabel";
import DeleteModal from "./DeleteModal";

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
                style={{ animationDelay: `${Math.min(i * 20, 300)}ms` }}>
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
                  }`}>
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
                      onTouchMove={() => clearTimeout(longPressTimer.current)}>
                      {message.replyTo && (
                        <div
                          className={`mb-1.5 px-2 py-1 rounded-lg border-l-2 text-xs ${
                            isMine
                              ? "bg-blue-500/50 border-blue-200"
                              : "bg-gray-100 border-gray-300"
                          }`}>
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
                          onClick={() => window.open(message.image, "_blank")}
                        />
                      )}
                      {message.text && (
                        <p className="leading-relaxed">{message.text}</p>
                      )}

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