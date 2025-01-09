import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema({
    title :{
        type: String,
        required: true
    },
    description :{
        type: String,
        required: true
    }
},{
    timestamps: true, 
})

export default mongoose.model("Syllabus", syllabusSchema);