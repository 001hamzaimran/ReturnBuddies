import mongoose from "mongoose";

const productItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },

    thumbnail: {
        type: String,
        required: true,
        trim: true
    },

    labelReceipt: {
        type: String,
        required: true,
        trim: true
    },
    oversized: {
        type: Boolean,
        default: false
    },
    labelName: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
},
    {
        _id: true,
        timestamps: true
    });

export default mongoose.model('ProductItem', productItemSchema);
