// models/Address.js
import {Schema,model} from 'mongoose';

const addressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
  suite: { type: String,  trim: true },
  isDefault: { type: Number, default: 0 }
});

// Export as a Mongoose model
export default model('Address', addressSchema);
