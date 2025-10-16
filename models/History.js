import { Schema, model } from "mongoose";

const historySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bundleId: {
      type: Schema.Types.ObjectId,
      ref: "ReturnBundle",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "awaiting pickup",
        "picked up",
        "inspected",
        "completed",
        "cancelled",
        "in transit",
        "delivered",
      ],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const HistoryModal = model("History", historySchema);
export default HistoryModal;
