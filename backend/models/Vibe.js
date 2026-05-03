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
    },      
    moodText: { 
      type: String, 
      required: true 
    },      
    caption: { 
      type: String, 
      default: "" 
    },        
    expiresAt: { 
      type: Date, 
      required: true 
    },      
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


vibeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Vibe = mongoose.model("Vibe", vibeSchema);


export default Vibe;