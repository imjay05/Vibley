import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  friends: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadCounts: {},
  friendRequests: [],
  searchResults: [],
  replyTo: null,

  // Store named socket handlers so we can remove only ours
  _socketHandlers: {},

  setReplyTo: (msg) => set({ replyTo: msg }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  searchUsers: async (query) => {
    if (!query) return set({ searchResults: [] });
    try {
      const res = await axiosInstance.get(`/users/search?query=${query}`);
      set({ searchResults: res.data });
    } catch {
      toast.error("Search failed");
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
    } catch {
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
    } catch {
      toast.error("Action failed");
    }
  },

  getUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread");
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
      set((state) => {
        const updated = { ...state.unreadCounts };
        delete updated[userId];
        return { unreadCounts: updated };
      });
    } catch {
      toast.error("Could not fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      senderId: useAuthStore.getState().authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image || null,
      status: "sending",
      createdAt: new Date().toISOString(),
      replyTo: null,
    };
    set({ messages: [...messages, optimistic] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({
        messages: get().messages.map((m) =>
          m._id === tempId ? res.data : m
        ),
      });
    } catch {
      set({ messages: get().messages.filter((m) => m._id !== tempId) });
      toast.error("Failed to send");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    const handleNewMessage = (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) {
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [newMessage.senderId]:
              (state.unreadCounts[newMessage.senderId] || 0) + 1,
          },
        }));
        return;
      }
      set({ messages: [...get().messages, newMessage] });
    };

    const handleMessagesSeen = ({ by }) => {
      if (by.toString() !== selectedUser._id.toString()) return;
      set({
        messages: get().messages.map((msg) =>
          msg.senderId === useAuthStore.getState().authUser._id &&
          msg.status !== "seen"
            ? { ...msg, status: "seen", seenAt: new Date().toISOString() }
            : msg
        ),
      });
    };

    const handleMessagesDelivered = ({ to }) => {
      if (to.toString() !== selectedUser._id.toString()) return;
      set({
        messages: get().messages.map((msg) =>
          msg.senderId === useAuthStore.getState().authUser._id &&
          msg.status === "sent"
            ? { ...msg, status: "delivered" }
            : msg
        ),
      });
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", handleMessagesSeen);
    socket.on("messagesDelivered", handleMessagesDelivered);

    // Store references so unsubscribe can remove only these handlers
    set({
      _socketHandlers: {
        newMessage: handleNewMessage,
        messagesSeen: handleMessagesSeen,
        messagesDelivered: handleMessagesDelivered,
      },
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const handlers = get()._socketHandlers;

    if (handlers.newMessage) socket.off("newMessage", handlers.newMessage);
    if (handlers.messagesSeen) socket.off("messagesSeen", handlers.messagesSeen);
    if (handlers.messagesDelivered) socket.off("messagesDelivered", handlers.messagesDelivered);

    set({ _socketHandlers: {} });
  },
}));