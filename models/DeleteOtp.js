import mongoose from "mongoose";

const DeleteOtp = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, },
  expiresAt: { type: Date,  },
  verified: { type: Boolean, default: false },
});

const DeleteOtpModal = mongoose.model("DeleteOtp", DeleteOtp);
export default DeleteOtpModal;

