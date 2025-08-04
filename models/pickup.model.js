import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    PickupName: {
        type: String,
        required: true
    },
    bundleId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReturnBundle',
        required: true
    }],
    status: {
        type: String,
        enum: ['Pickup Requested', 'picked up', 'inspected', 'completed', 'Pickup cancelled', 'in transit', 'delivered'],
        default: 'Pickup Requested',
    },
    pickupAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    
    note: {
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
    pickupType: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date
    },
    Payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    isOversize: {
        type: Boolean,
        default: false
    },
    totalPrice: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Pickup', pickupSchema);