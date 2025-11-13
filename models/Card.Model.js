import { Schema, model } from "mongoose";

const CardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stripePaymentMethodId: {
    type: String,
    required: true,
  },
  stripeCustomerId: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  last4: {
    type: String,
  },
  exp_month: {
    type: Number,
  },
  exp_year: {
    type: Number,
  },
  cardHolderName: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Number,
    default: 0,
  },
});

export default model("Card", CardSchema);
