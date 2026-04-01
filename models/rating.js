import mongoose from "mongoose";
const { Schema } = mongoose;

const RatingSchema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, // who gave the rating
     dj: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    }
}, { timestamps: true });



export default mongoose.models.Rating || mongoose.model("Rating", RatingSchema);