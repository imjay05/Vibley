import { useState } from "react";
import { Trash2, MessageCircle, Send, Clock, Pencil, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { useVibeStore } from "../../store/useVibeStore";
import { useAuthStore } from "../../store/useAuthStore";
import { formatRelativeTime } from "../../lib/utils";

const VibeCard = ({ vibe, isMine }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [draftCaption, setDraftCaption] = useState(vibe.userCaption || "");

  const { deleteMyVibe, replyToVibe, updateVibeCaption } = useVibeStore();
  const { authUser } = useAuthStore();

  const timeLeft = () => {
    const ms = new Date(vibe.expiresAt) - Date.now();
    if (ms <= 0) return "Expired";
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h left` : `${m}m left`;
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await replyToVibe(vibe._id, replyText.trim());
    setReplyText("");
  };

  const handleSaveCaption = async () => {
    await updateVibeCaption(vibe._id, draftCaption.trim());
    setIsEditingCaption(false);
  };

  const handleCancelCaption = () => {
    setDraftCaption(vibe.userCaption || "");
    setIsEditingCaption(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <img
            src={vibe.userId?.profilePic || "/avatar.png"}
            className="size-8 rounded-full object-cover"
            alt={vibe.userId?.fullName}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {isMine ? "Your vibe" : vibe.userId?.fullName}
            </p>
            <p className="text-[10px] text-gray-400">{formatRelativeTime(vibe.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
            <Clock className="size-3" />{timeLeft()}
          </span>
          {isMine && (
            <button
              onClick={deleteMyVibe}
              className="p-1 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="size-3.5 text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Meme image */}
      <div>
        <img src={vibe.memeUrl} alt="vibe meme" className="w-full object-contain max-h-64" />
      </div>

      {/* User caption */}
      <div className="px-3 py-2 border-t border-gray-50">
        {isEditingCaption ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              value={draftCaption}
              onChange={(e) => setDraftCaption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveCaption();
                if (e.key === "Escape") handleCancelCaption();
              }}
              placeholder="Write your caption…"
              maxLength={120}
              className="flex-1 bg-gray-100 rounded-xl px-3 py-1.5 text-xs
                         outline-none placeholder:text-gray-400"
            />
            <button
              onClick={handleSaveCaption}
              className="size-7 bg-purple-600 hover:bg-purple-700 rounded-xl
                         flex items-center justify-center transition-colors">
              <Check className="size-3 text-white" />
            </button>
            <button
              onClick={handleCancelCaption}
              className="size-7 bg-gray-200 hover:bg-gray-300 rounded-xl
                         flex items-center justify-center transition-colors">
              <X className="size-3 text-gray-600" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingCaption(true)}
            className="flex items-center gap-1.5 w-full text-left group">
            {vibe.userCaption ? (
              <p className="text-xs text-gray-700 italic flex-1">"{vibe.userCaption}"</p>
            ) : (
              <p className="text-xs text-gray-400 italic flex-1">
                {isMine ? "Add a caption to your vibe…" : "Add your own caption…"}
              </p>
            )}
            <Pencil className="size-3 text-gray-300 group-hover:text-purple-400
                               transition-colors shrink-0" />
          </button>
        )}
      </div>

      {/* Replies — for others' vibes */}
      {!isMine && (
        <div className="px-3 py-2 border-t border-gray-50">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-xs text-gray-500
                       hover:text-blue-600 transition-colors mb-2">
            <MessageCircle className="size-3.5" />
            {vibe.replies?.length > 0
              ? `${vibe.replies.length} repl${vibe.replies.length > 1 ? "ies" : "y"}`
              : "Reply"}
          </button>

          {showReplies && (
            <div className="space-y-1.5">
              {vibe.replies?.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <img
                    src={r.fromId?.profilePic || "/avatar.png"}
                    className="size-5 rounded-full object-cover mt-0.5" />
                  <div className="bg-gray-100 rounded-xl px-2.5 py-1.5 flex-1">
                    <p className="text-[10px] font-semibold text-gray-700">
                      {r.fromId?._id === authUser._id ? "You" : r.fromId?.fullName}
                    </p>
                    <p className="text-xs text-gray-600">{r.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReply()}
                  placeholder="Send a reply…"
                  className="flex-1 bg-gray-100 rounded-xl px-3 py-1.5 text-xs
                             outline-none placeholder:text-gray-400" />
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="size-7 bg-blue-600 disabled:opacity-40 rounded-xl
                             flex items-center justify-center">
                  <Send className="size-3 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My vibe — reactions (collapsible) */}
      {isMine && vibe.replies?.length > 0 && (
        <div className="border-t border-gray-50">
          {/* Clickable reactions header */}
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="w-full flex items-center justify-between px-3 py-2
                       hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-1.5">
              <MessageCircle className="size-3.5 text-purple-400" />
              <p className="text-[10px] text-gray-500 font-medium">
                {vibe.replies.length} REACTION{vibe.replies.length > 1 ? "S" : ""}
              </p>
            </div>
            {showReactions
              ? <ChevronUp className="size-3.5 text-gray-400" />
              : <ChevronDown className="size-3.5 text-gray-400" />}
          </button>

          {/* Expanded reactions list */}
          {showReactions && (
            <div className="px-3 pb-2 space-y-1.5">
              {vibe.replies.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <img
                    src={r.fromId?.profilePic || "/avatar.png"}
                    className="size-5 rounded-full object-cover mt-0.5" />
                  <div className="bg-gray-100 rounded-xl px-2.5 py-1.5 flex-1">
                    {/* Name is now always shown */}
                    <p className="text-[10px] font-semibold text-purple-600">
                      {r.fromId?.fullName}
                    </p>
                    <p className="text-xs text-gray-600">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VibeCard;