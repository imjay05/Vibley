import { useState } from "react";
import { Trash2, MessageCircle, Send, Clock } from "lucide-react";
import { useVibeStore } from "../store/useVibeStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatRelativeTime } from "../lib/utils";

const VibeCard = ({ vibe, isMine }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { deleteMyVibe, replyToVibe } = useVibeStore();
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
      <div className="relative">
        <img src={vibe.memeUrl} alt="vibe meme" className="w-full object-contain max-h-64" />
        {vibe.caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
            <p className="text-white text-sm font-bold text-center drop-shadow">{vibe.caption}</p>
          </div>
        )}
      </div>

      {/* Mood tag */}
      {vibe.moodText && (
        <div className="px-3 py-1.5 bg-purple-50">
          <p className="text-xs text-purple-700 italic">"{vibe.moodText}"</p>
        </div>
      )}

      {/* Replies */}
      {!isMine && (
        <div className="px-3 py-2 border-t border-gray-50">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors mb-2">
            <MessageCircle className="size-3.5" />
            {vibe.replies?.length > 0 ? `${vibe.replies.length} repl${vibe.replies.length > 1 ? "ies" : "y"}` : "Reply"}
          </button>

          {showReplies && (
            <div className="space-y-1.5">
              {vibe.replies?.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <img src={r.fromId?.profilePic || "/avatar.png"} className="size-5 rounded-full object-cover mt-0.5" />
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
                  className="flex-1 bg-gray-100 rounded-xl px-3 py-1.5 text-xs outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="size-7 bg-blue-600 disabled:opacity-40 rounded-xl flex items-center justify-center">
                  <Send className="size-3 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My own vibe shows replies received */}
      {isMine && vibe.replies?.length > 0 && (
        <div className="px-3 py-2 border-t border-gray-50 space-y-1.5">
          <p className="text-[10px] text-gray-400 font-medium">REACTIONS</p>
          {vibe.replies.map((r, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <img src={r.fromId?.profilePic || "/avatar.png"} className="size-5 rounded-full object-cover mt-0.5" />
              <div className="bg-gray-100 rounded-xl px-2.5 py-1.5 flex-1">
                <p className="text-[10px] font-semibold text-gray-700">{r.fromId?.fullName}</p>
                <p className="text-xs text-gray-600">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VibeCard;