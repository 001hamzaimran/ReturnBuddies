import { Schema, model } from "mongoose";

/**
 * Payment is a sub‐schema for ReturnBundle.payment.
 * It holds the details of the payment transaction.
 */

const paymentSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      // (Total fee paid, e.g. in PKR or your default currency unit)
    },

    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "stripe"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
      trim: true,
      // (Unique ID returned by your payment gateway)
    },

    paidAt: {
      type: Date,
      // (Only set this when paymentStatus === 'completed')
    },
  },
  {
    _id: false, // No separate _id for each embedded payment doc
  }
);

export default paymentSchema;

// If you ever want Payment to be its own collection, you could instead do:
// export default model('Payment', paymentSchema);
