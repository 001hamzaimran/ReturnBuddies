import mongoose from "mongoose";


const pickupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bundleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReturnBundle',
        required: true
    },
    status: {
        type: String,
        enum: ['awaiting pickup', 'picked up', 'inspected', 'completed', 'canceled', 'in transit', 'delivered'],
        default: 'awaiting pickup',
    },
    pickupAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    notes: {
        type: String,
        trim: true
    },
    pickupDate: {
        type: Date,
        required: true
    },
    pickupTime: { 
        type: String,
        required: true
    },
    deliveryType: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    deliveryTime: {
        type: String,
        required: true
    },
    Payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    Oversized: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

export default mongoose.model('Pickup', pickupSchema);
