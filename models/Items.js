import { Schema, model } from "mongoose";

const ItemsSchema = new Schema(
  {
    itemDetails: {
      type: String,
    },
    itemPhoto: {
      type: String,
    },

    ReturnDate: {
      type: String,
    },
    ReturnShippingLabel: {
      type: String,
    },
  },
  { timestamps: true }
);

const ItemModal = model("Items", ItemsSchema);

export default ItemModal;
