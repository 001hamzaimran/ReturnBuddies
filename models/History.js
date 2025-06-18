import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
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
        required: true
    },
    location:{
        type: String,
        required: true,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },

},{
    timestamps: true
});

const HistoryModal = mongoose.model("History", historySchema);
export default HistoryModal