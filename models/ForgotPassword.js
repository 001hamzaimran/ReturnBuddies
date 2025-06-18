import mongoose from "mongoose";

const ForgotSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, },
  expiresAt: { type: Date,  },
  verified: { type: Boolean, default: false },
});

const ForgotModal = mongoose.model("ForgotPassword", ForgotSchema);
export default ForgotModal;
