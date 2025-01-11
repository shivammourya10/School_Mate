import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{ // Renamed from 'image' to 'images'
        type: mongoose.Schema.Types.ObjectId,
        ref: "Children",
    }],
}, {
    timestamps: true,
})

export default mongoose.model("Album", albumSchema);