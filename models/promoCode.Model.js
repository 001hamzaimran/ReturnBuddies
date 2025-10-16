import { Schema, model } from "mongoose";

const promoCodeSchema = new Schema(
  {
    userId: { type: String, default: "All" },
    Name: { type: String, required: true },
    PromoCode: { type: String, required: true },
    Discount: { type: Number, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const PromoCodeModal = model("PromoCode", promoCodeSchema);
export default PromoCodeModal;
