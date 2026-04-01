import mongoose from "mongoose";
const { Schema } = mongoose;


const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "dj", "admin"], default: "user" },
    rating: [

        { type: mongoose.Schema.Types.ObjectId, ref: "Rating" }

    ],
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] },
        city: { type: String, default: "" },
        country: { type: String, default: "" },
        display_name: { type: String, default: "" }
    },
    bio: { type: String, default: "" },
    follower: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    profilePicture: { type: String, default: "" },
    minPrice: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    genre: [String],
    bookedDates: [Date],
    isApproved: { type: Boolean, default: false },
    djTypes: {
        type: [String],
        default:[]
    },
    video: [

        { type: mongoose.Schema.Types.ObjectId, ref: "Media" }

    ],
    audio: [

        { type: mongoose.Schema.Types.ObjectId, ref: "Media" }

    ],
    flyer: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Media"
    }],
    jobPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    chatRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }]
}, { timestamps: true });


export default mongoose.models.User || mongoose.model("User", UserSchema);