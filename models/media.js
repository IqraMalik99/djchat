import mongoose from "mongoose";


const MediaSchema = new mongoose.Schema(
  {
    dj: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["mixtape", "video", "flyer"],
      required: true,
    },

    description: String,
    url: String,
    thumbnail: String,
     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [String],


    isApproved: { type: Boolean, default: true }, // Admin moderation
  },
  { timestamps: true }
);

MediaSchema.index({ type: 1 });
MediaSchema.index({ genre: 1 });

export default mongoose.models.Media ||
  mongoose.model("Media", MediaSchema);