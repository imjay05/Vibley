import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X, Reply } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  const { sendMessage, selectedUser, replyTo, setReplyTo } = useChatStore();
  const { authUser } = useAuthStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) return toast.error("Select an image file");
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({ text: text.trim(), image: imagePreview, replyTo: replyTo?._id });
      setText("");
      clearImage();
      setReplyTo(null);
    } catch {
      toast.error("Failed to send");
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 px-4 py-3">
      {/* Reply preview */}
      {replyTo && (
        <div className="mb-2 flex items-center justify-between bg-blue-50 border-l-2 border-blue-500 px-3 py-2 rounded-lg">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Reply className="size-3 text-blue-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-blue-600">
              {replyTo.senderId === authUser._id ? "Yourself" : selectedUser.fullName}
            </span>
            <span className="text-xs text-gray-500 truncate">{replyTo.text || "Attachment"}</span>
          </div>
          <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="mb-2 relative inline-block">
          <img src={imagePreview} className="h-16 w-16 object-cover rounded-xl border border-gray-200" alt="Preview" />
          <button onClick={clearImage}
            className="absolute -top-1.5 -right-1.5 size-5 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors">
            <X className="size-3" />
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={handleImageChange} />
        <button type="button" onClick={() => imageInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0">
          <Image className="size-5 text-gray-400" />
        </button>
        <input
          type="text"
          className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-gray-50 transition-colors placeholder:text-gray-400"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit"
          disabled={!text.trim() && !imagePreview}
          className="size-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
          <Send className="size-4 text-white" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;