import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  time: {
    type: Number, // Storing hours
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requests:[
     {
    type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
  }
  ],
  status:{
    type: String,
    enum: ["hiring", "hired"],
    default: "hiring",
  }
},
{
    timestamps: true
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);