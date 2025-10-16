import { Schema, model } from "mongoose";

const ForgotSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String },
  expiresAt: { type: Date },
  verified: { type: Boolean, default: false },
});

const ForgotModal = model("ForgotPassword", ForgotSchema);
export default ForgotModal;
