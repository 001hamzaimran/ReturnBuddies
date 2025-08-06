import mongoose from "mongoose";
const DisabledSlotSchema = new mongoose.Schema(
    {
        date: {
            type: Date, // format: 'yyyy-MM-dd'
            required: true,
        },
        timeSlot: {
            type: String, // e.g., '9:00 AM to 6:00 PM' or null
            default: null,
        },
        disabled: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const DisabledSlot = mongoose.model("DisabledSlot", DisabledSlotSchema);
export default DisabledSlot