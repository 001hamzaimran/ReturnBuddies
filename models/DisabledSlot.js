import mongoose from "mongoose";

const DisabledSlotSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            // ✅ Mongoose getter receives the value directly
            get: (val) => (val ? val.toISOString().split("T")[0] : val),
            set: (value) => {
                const date = new Date(value);
                date.setUTCHours(0, 0, 0, 0); // store only date part
                return date;
            },
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
                        return 5;
                }
            },
        },
    },
    {
        timestamps: true,
        toJSON: { getters: true }, // ensure getters run on JSON.stringify / API response
        toObject: { getters: true },
    }
);

const DisabledSlot = mongoose.model("DisabledSlot", DisabledSlotSchema);
export default DisabledSlot;
