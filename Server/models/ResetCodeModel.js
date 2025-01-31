import mongoose from "mongoose";

const ResetCodeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  resetCode: {
    type: String,
    required: true,
    unique: true,
  },
  resetCodeExpiry: {
    type: Date,
    required: true,
  }
}, {
  timestamps: true
})

ResetCodeSchema.index({ resetCodeExpiry: 1 }, { expireAfterSeconds: 300 }); // TTL index


export default mongoose.model("ResetCode", ResetCodeSchema);
