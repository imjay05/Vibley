import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X, Reply, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  const { sendMessage, selectedUser, replyTo, setReplyTo } = useChatStore();
  const { socket, authUser } = useAuthStore();

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!socket || !selectedUser) return;

    socket.emit("typing", {
      to: selectedUser._id,
      from: authUser._id,
    });

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { to: selectedUser._id });
    }, 2000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };


  const clearAttachments = () => {
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        replyTo: replyTo?._id,
      });

      // Clear everything
      setText("");
      clearAttachments();
      setReplyTo(null);
      socket?.emit("stopTyping", { to: selectedUser._id });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-4 w-full">
      {/* ↳ Reply Preview */}
      {replyTo && (
        <div className="mb-2 flex items-center justify-between bg-base-300 p-2 rounded-lg border-l-4 border-primary">
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-primary flex items-center gap-1">
              <Reply size={12} /> Replying to {replyTo.senderId === authUser._id ? "yourself" : "friend"}
            </span>
            <p className="text-sm opacity-70 truncate">{replyTo.text || "Attachment"}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="btn btn-ghost btn-circle btn-xs">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Attachment Previews */}
      {(imagePreview) && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview}
            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            alt="Preview"/>
            <button onClick={clearAttachments}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center">
              <X size={12} />
              </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={handleTyping}/>
          
          <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={handleImageChange} />

          <div className="flex gap-1">
            <button type="button" className="btn btn-ghost btn-circle btn-sm" onClick={() => imageInputRef.current?.click()}>
              <Image size={20} className="text-zinc-400" />
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-sm btn-circle" disabled={!text.trim() && !imagePreview}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;