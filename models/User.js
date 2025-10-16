import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    devices: [
      {
        playerId: String,
        os: String, // "android" or "ios"
        lastActive: { type: Date, default: Date.now },
      },
    ],
    profile: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.756143352.1747218968&semt=ais_hybrid&w=740",
    },
    pickupAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.appleId; // Password is required only if not using Google login
      },
    },
    appleId: {
      type: String,
      default: null,
    },

    verified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    phoneOtp: {
      type: Number,
      default: null,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    FirstLogin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const UserModel = model("User", UserSchema);
export default UserModel;
