import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
    {
    title: { 
        type: String, required: true 
    }, 
    image: { 
        type: String, 
        required: true 
    }, 
},{
    timestamps: true,
});
export default mongoose.model("Certificate", CertificateSchema);