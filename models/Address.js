import mongoose from 'mongoose';

/**
 * Address is a sub‐schema for ReturnBundle.pickupAddress.
 * We generally don’t store addresses in a standalone collection here,
 * but if you ever need a separate Address model, you could export a model instead.
 */

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true
  },

  city: {
    type: String,
    required: true,
    trim: true
  },

  state: {
    type: String,
    required: true,
    trim: true
  },

  postalCode: {
    type: String,
    required: true,
    trim: true
  },

  country: {
    type: String,
    required: true,
    trim: true
  }
},
{
  _id: false  // We don’t need a separate _id for each embedded address
});

export default addressSchema;

// If you wanted Address as its own collection, you could instead do:
// export default mongoose.model('Address', addressSchema);
