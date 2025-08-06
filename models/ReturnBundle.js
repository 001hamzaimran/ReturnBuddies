import mongoose from 'mongoose';


const returnBundleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    BundleName: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductItem',
        required: true
    }],
    history: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'History',
        }]
    },

    pickupAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },

    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    },

    pickupTime: {
        type: String
    },

    status: {
        type: String,
        enum: ['pending', 'processed', 'completed'],
        default: 'pending'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

function arrayNotEmpty(val) {
    return Array.isArray(val) && val.length > 0;
}

export default mongoose.model('ReturnBundle', returnBundleSchema);
