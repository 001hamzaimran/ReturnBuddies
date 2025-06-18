import mongoose from "mongoose";

const cancelreturnSchema = new mongoose.Schema({
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
    Note:{
        type: String,
        required: true,
        trim: true
    },
},{
    timestamps: true
})