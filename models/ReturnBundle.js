import { Schema, model } from "mongoose";

const returnBundleSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  BundleName: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "ProductItem",
      required: true,
    },
  ],
  history: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "History",
      },
    ],
  },

  pickupAddress: {
    type: Schema.Types.ObjectId,
    ref: "Address",
  },

  payment: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
  },

  pickupTime: {
    type: Date,
  },

  status: {
    type: String,
    enum: ["pending", "processed", "completed"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

function arrayNotEmpty(val) {
  return Array.isArray(val) && val.length > 0;
}

export default model("ReturnBundle", returnBundleSchema);
