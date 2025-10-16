import { Schema, model } from "mongoose";

const otpSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  phone: String,
  otp: String,
  expiresAt: Date,
});

export default model("Otp", otpSchema);
