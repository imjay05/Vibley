import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import toast from "react-hot-toast";

export const useVibeStore = create((set, get) => ({
  friendVibes: [],
  myVibe: null,
  memeOptions: [],
  isGenerating: false,
  isPosting: false,
  isLoading: false,

  fetchVibes: async () => {
    set({ isLoading: true });
    try {
      const [friends, mine] = await Promise.all([
        axiosInstance.get("/vibes/friends"),
        axiosInstance.get("/vibes/mine"),
      ]);
      set({ friendVibes: friends.data, myVibe: mine.data });
    } catch {
      toast.error("Could not load vibes");
    } finally {
      set({ isLoading: false });
    }
  },


  generateMemes: async () => {
    set({ isGenerating: true, memeOptions: [] });
    try {
      const res = await axiosInstance.post("/vibes/generate", {});
      set({ memeOptions: res.data.options });
    } catch (err) {
      toast.error(err.response?.data?.error || "Generation failed");
    } finally {
      set({ isGenerating: false });
    }
  },


  postVibe: async ({ moodText, templateId, topText, bottomText, caption, imageUrl }) => {
    set({ isPosting: true });
    try {
      const res = await axiosInstance.post("/vibes", {
        moodText,
        templateId,
        topText,
        bottomText,
        caption,
        imageUrl,
      });
      set({ myVibe: res.data, memeOptions: [] });
      toast.success("Vibe posted! 🔥");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || "Post failed");
      return false;
    } finally {
      set({ isPosting: false });
    }
  },


  deleteMyVibe: async () => {
    const { myVibe } = get();
    if (!myVibe) return;
    try {
      await axiosInstance.delete(`/vibes/${myVibe._id}`);
      set({ myVibe: null });
      toast.success("Vibe removed");
    } catch {
      toast.error("Delete failed");
    }
  },

  
  replyToVibe: async (vibeId, text) => {
    try {
      const res = await axiosInstance.post(`/vibes/${vibeId}/reply`, { text });
      set({
        friendVibes: get().friendVibes.map((v) =>
          v._id === vibeId ? res.data : v
        ),
      });
    } catch {
      toast.error("Reply failed");
    }
  },
}));