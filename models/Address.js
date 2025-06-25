// models/Address.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
  suite: { type: String, required: true, trim: true },
  isDefault: { type: Number, default: 0 }
});

// Export as a Mongoose model
export default mongoose.model('Address', addressSchema);
