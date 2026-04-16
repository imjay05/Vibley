import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  friends: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadCounts: {},      // { userId: count }
  friendRequests: [],
  searchResults: [],
  replyTo: null,

  setReplyTo: (msg) => set({ replyTo: msg }),

  searchUsers: async (query) => {
    if (!query) return set({ searchResults: [] });
    try {
      const res = await axiosInstance.get(`/users/search?query=${query}`);
      set({ searchResults: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Search failed");
    }
  },

  sendFriendRequest: async (userId) => {
    try {
      const res = await axiosInstance.post(`/users/request/${userId}`);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  },

  getFriends: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/users/friends");
      set({ friends: res.data });
    } catch (error) {
      toast.error("Could not load friends");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getFriendRequests: async () => {
    try {
      const res = await axiosInstance.get("/users/requests");
      set({ friendRequests: res.data });
    } catch (error) {
      console.log("Error fetching requests", error);
    }
  },

  handleRequest: async (requestId, action) => {
    try {
      const res = await axiosInstance.post(`/users/${action}/${requestId}`);
      toast.success(res.data.message);
      get().getFriendRequests();
      get().getFriends();
    } catch (error) {
      toast.error("Action failed");
    }
  },

  // ✅ Fetch unread counts from backend
  getUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread");
      // Backend returns [{ _id: senderId, count: N }]
      // Convert to { senderId: count }
      const counts = {};
      res.data.forEach(({ _id, count }) => {
        counts[_id] = count;
      });
      set({ unreadCounts: counts });
    } catch (error) {
      console.log("Error fetching unread counts", error);
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      // Clear unread count for this user when opening chat
      set((state) => {
        const updated = { ...state.unreadCounts };
        delete updated[userId];
        return { unreadCounts: updated };
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageFromSelectedUser) {
        // ✅ Increment unread count locally (no API call needed)
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [newMessage.senderId]: (state.unreadCounts[newMessage.senderId] || 0) + 1,
          },
        }));
        return;
      }
      set({ messages: [...get().messages, newMessage] });
    });

    socket.on("messageSeen", ({ by }) => {
      set({
        messages: get().messages.map((msg) =>
          msg.senderId === by ? { ...msg, status: "seen" } : msg
        ),
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageSeen");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));