import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export const ChatSchema = new mongoose.Schema({

  dj: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ✅ Keep these for quick display without populate
  djname: String,
  clientname: String,
  djavatar: String,
  clientavatar: String,

  messages: [MessageSchema],

}, { timestamps: true });

// ✅ Prevent duplicate chats between same dj + client
ChatSchema.index({ dj: 1, client: 1 }, { unique: true });

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);