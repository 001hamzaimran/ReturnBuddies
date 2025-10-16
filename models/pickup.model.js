import { Schema, model } from "mongoose";

const pickupSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    PickupName: {
      type: String,
      required: true,
    },
    bundleId: [
      {
        type: Schema.Types.ObjectId,
        ref: "ReturnBundle",
        required: true,
      },
    ],
    Carrier: {
      type: String,
    },
    TrackingNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "Pickup Requested",
        "Picked Up",
        "Inspected",
        "Completed",
        "Pickup Cancelled",
        "In Transit",
        "Delivered",
      ],
      default: "Pickup Requested",
    },
    pickupAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    // 🟢 New field to track status changes
    statusHistory: [
      {
        type: {
          type: String,
          enum: ["status", "extraCharge", "Issue"], // differentiate
          default: "status",
        },
        status: {
          type: String,
          enum: [
            "Pickup Requested",
            "Picked Up",
            "Inspected",
            "Completed",
            "Pickup Cancelled",
            "In Transit",
            "Delivered",
          ],
        },
        extraCharge: Number,
        chargeDetail: String,
        labelIssue: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    note: {
      type: String,
      trim: true,
    },

    pickupDate: {
      type: Date,
      required: true,
    },

    pickupTime: {
      type: String,
      required: true,
    },

    pickupType: {
      type: String,
      required: true,
    },

    deliveryDate: {
      type: Date,
    },

    Payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },

    isOversize: {
      type: Boolean,
      default: false,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    extraCharge: {
      type: Number,
      default: 0,
    },
    chargeDetail: {
      type: String,
      default: "",
    },
    labelIssue: {
      type: String,
      default: "",
    },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model("Pickup", pickupSchema);
