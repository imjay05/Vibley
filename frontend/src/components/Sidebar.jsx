import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, UserPlus, Bell } from "lucide-react";

const Sidebar = () => {
  const friends = useChatStore((state) => state.friends);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const isUsersLoading = useChatStore((state) => state.isUsersLoading);
  const friendRequests = useChatStore((state) => state.friendRequests);
  const unreadCounts = useChatStore((state) => state.unreadCounts);
  const getFriends = useChatStore((state) => state.getFriends);
  const getFriendRequests = useChatStore((state) => state.getFriendRequests);
  const getUnreadCounts = useChatStore((state) => state.getUnreadCounts);

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getFriends();
    getFriendRequests();
    getUnreadCounts(); // ✅ load unread counts on mount
  }, []);

  const filteredFriends = showOnlineOnly
    ? friends.filter((user) => onlineUsers.includes(user._id))
    : friends;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>

          <div className="flex gap-3">
            {/* ✅ Bell opens friend REQUESTS modal */}
            <button
              className="relative p-1 hover:bg-base-200 rounded-full transition-colors"
              onClick={() => document.getElementById("friend_requests_modal").showModal()}
            >
              <Bell className="size-5" />
              {friendRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-error text-white text-[10px] rounded-full flex items-center justify-center">
                  {friendRequests.length}
                </span>
              )}
            </button>

            {/* ✅ Plus opens ADD CONTACT modal */}
            <button
              className="p-1 hover:bg-base-200 rounded-full transition-colors"
              onClick={() => document.getElementById("add_contact_modal").showModal()}
            >
              <UserPlus className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredFriends.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}>
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium truncate">{user.fullName}</div>
                {/* ✅ Unread badge */}
                {unreadCounts[user._id] > 0 && (
                  <span className="ml-2 min-w-[20px] h-5 bg-primary text-primary-content text-[11px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCounts[user._id]}
                  </span>
                )}
              </div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredFriends.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No contacts yet</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;