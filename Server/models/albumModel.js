import mongoose from "mongoose";

<<<<<<< HEAD
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
=======
const albumnSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    description :{
        type: String,
        required: true
    },
    image :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Children",
    }],
},{
    timestamps: true,
})

export default mongoose.model("Album", albumnSchema);
>>>>>>> ee7d8af06587b8be6856151f3924bace468bec85
