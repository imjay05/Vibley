import mongoose from "mongoose";

const vibeSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    memeUrl: { 
      type: String, 
      required: true 
    },// Cloudinary URL of the final meme image
    moodText: { 
      type: String, 
      required: true 
    },// raw mood the user typed
    caption: { 
      type: String, 
      default: "" 
    }, // optional caption shown on card
    expiresAt: { 
      type: Date, 
      required: true 
    },// set to createdAt + 24 hrs
    replies: [
      {
        fromId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "User" 
        },
        text: { 
          type: String 
        },
        createdAt: { 
          type: Date, 
          default: Date.now 
        },
      },
    ],
  },
  { timestamps: true }
);

// TTL index — MongoDB will auto-delete docs once expiresAt is past
vibeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Vibe = mongoose.model("Vibe", vibeSchema);
export default Vibe;