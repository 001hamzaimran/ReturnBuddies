import { Schema, model } from "mongoose";

const basePriceSchema = new Schema(
  {
    BASE_PRICE: {
      type: Number,
      default: 11.99,
    },
    FREE_ITEMS_THRESHOLD: {
      type: Number,
      default: 10,
    },
    ADDITIONAL_ITEM_PRICE: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const BasePrice = model("BasePrice", basePriceSchema);

export default BasePrice;
