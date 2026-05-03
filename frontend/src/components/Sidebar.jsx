import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, UserPlus, Bell } from "lucide-react";
import { useVibeStore } from "../store/useVibeStore";

const Sidebar = () => {
const { friends, selectedUser, setSelectedUser, isUsersLoading,
    friendRequests, unreadCounts, getFriends, getFriendRequests, getUnreadCounts } = useChatStore();
const { friendVibes } = useVibeStore();
const hasVibe = (userId) => friendVibes.some((v) => v.userId?._id === userId);
const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getFriends();
    getFriendRequests();
    getUnreadCounts();
  }, []);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-gray-100 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-gray-500" />
          <span className="font-semibold text-sm hidden lg:block text-gray-800">Contacts</span>
        </div>
        <div className="flex gap-1">
          <button
            className="relative p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => document.getElementById("friend_requests_modal").showModal()}>
            <Bell className="size-4 text-gray-500" />
            {friendRequests.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-4 bg-red-500 text-white 
                               text-[9px] font-bold rounded-full flex items-center justify-center">
                {friendRequests.length}
              </span>
            )}
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => document.getElementById("add_contact_modal").showModal()}>
            <UserPlus className="size-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Friends list */}
      <div className="overflow-y-auto flex-1 py-2">
        {friends.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">No contacts yet</p>
        )}
        {friends.map((user, i) => (
          <button key={user._id} onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 
                      transition-colors animate-slide-left ${selectedUser?._id === user._id ? 
                      "bg-blue-50 border-r-2 border-blue-500" : ""}`}
            style={{ animationDelay: `${i * 30}ms` }}>
            <div className={`relative mx-auto lg:mx-0 flex-shrink-0 ${hasVibe(user._id) ? 
                 "ring-2 ring-purple-500 ring-offset-1 rounded-full" : ""}`}>
              <img 
                 src={user.profilePic || "/avatar.png"} 
                 alt={user.fullName}
                className="size-10 object-cover rounded-full" />
                {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-white" />
              )}
            </div>
            <div className="hidden lg:flex flex-col text-left min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-gray-800 truncate">{user.fullName}</span>
                {unreadCounts[user._id] > 0 && (
                  <span className="ml-2 min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] 
                        font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCounts[user._id]}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};


export default Sidebar;