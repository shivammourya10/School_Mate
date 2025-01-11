import mongoose from "mongoose";

const childrenSchema = new mongoose.Schema({
    image: { // Ensure this matches the property used in albumController.js
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

// Log image URLs upon creation for verification
childrenSchema.post('save', function(doc) {
    console.log('New image saved:', doc.image);
});

export default mongoose.model("Children", childrenSchema);