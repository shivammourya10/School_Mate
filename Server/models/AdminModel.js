import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String
  },
}, {
  timestamps: true
})

export default mongoose.model("Admin", adminSchema);
