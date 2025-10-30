import mongoose from "mongoose"

const promptSchema = new mongoose.Schema(
  {
    userID: mongoose.Schema.Types.ObjectId,
    prompt: String,
    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
    },
    createdAt: { type: Date, default: Date.now },
    videoURL: String,
  },
  { timestamps: true }
)

export const Prompt = mongoose.model("Prompt", promptSchema)
