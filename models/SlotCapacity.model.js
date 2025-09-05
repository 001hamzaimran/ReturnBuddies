import mongoose from "mongoose";

const SlotCapacitySchema = new mongoose.Schema(
    {
        date: {
            type: Date, // format: 'yyyy-MM-dd'
        },
        timeSlot: {
            type: String, // e.g., '9:00 AM to 6:00 PM' or null
            default: null,
        },
        disabled: {
            type: Boolean,
            default: true,
        },
        capacity: {
            type: Number,
            default: function () {
                // Use "this.timeSlot" to determine default capacity
                switch (this.timeSlot) {
                    case "9:00 AM to 6:00 PM":
                        return 10;
                    case "9:00 AM to 1:00 PM":
                        return 8;
                    case "11:00 AM to 3:00 PM":
                        return 5;
                    case "2:00 PM to 6:00 PM":
                        return 4;
                    default:
                        return 5; // fallback default
                }
            },
        },
    },
    { timestamps: true }
);

const SlotCapacity = mongoose.model("Slot Capacity", SlotCapacitySchema);
export default SlotCapacity;
