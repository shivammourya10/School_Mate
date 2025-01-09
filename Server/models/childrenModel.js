import mongoose from "mongoose";

const childrenSchema = new mongoose.Schema(
    {
    image: { 
        type: String, 
        required: true 
    }, 
},{
    timestamps: true,
});
export default mongoose.model("Children", childrenSchema);