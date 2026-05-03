import { X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="size-9 rounded-full object-cover"/>
          {isOnline && (
            <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-white" />
          )}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">
            {selectedUser.fullName}
          </p>
          <p className={`text-xs ${isOnline ? "text-green-500" : "text-gray-400"}`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <button
        onClick={() => setSelectedUser(null)}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
        <X className="size-4 text-gray-500" />
      </button>
    </div>
  );
};

export default ChatHeader;