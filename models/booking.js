import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dj: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: String,
    eventDate: { type: Date, required: true },
    time: String,
    startTime: {
      type: String
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  fromClient: { type: Boolean, default: false },
    price: Number,
    Guests: Number,
    extra: String,
    venue: String
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema);