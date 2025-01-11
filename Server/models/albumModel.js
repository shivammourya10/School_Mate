import mongoose from "mongoose";

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