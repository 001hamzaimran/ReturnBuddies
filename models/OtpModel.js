import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  phone: String,
  otp: String,
  expiresAt: Date,
});

export default mongoose.model('Otp', otpSchema);
