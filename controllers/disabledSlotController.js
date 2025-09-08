import DisabledSlot from "../models/DisabledSlot.js";
import pickupModel from "../models/pickup.model.js";

const TIME_SLOTS = {
    "9:00 AM to 6:00 PM": 10,
    "9:00 AM to 1:00 PM": 8,
    "11:00 AM to 3:00 PM": 5,
    "2:00 PM to 6:00 PM": 4,
};

// Add this helper function to the backend
function getSlotStatus(slot) {
    if (slot.disabled) return "disabled";
    if (slot.capacity > 0 && slot.pickupsBooked >= slot.capacity) return "full";
    if (slot.capacity > 0 && slot.pickupsBooked >= Math.floor(0.8 * slot.capacity)) return "almost-full";
    return "available";
}

export const disableSlot = async (req, res) => {
    try {
        const { date, timeSlot, disabled } = req.body;

        // Validate input
        if (!date) {
            return res.status(200).json({ error: "Date is required.", status: 400 });
        }

        const existing = await DisabledSlot.findOne({ date, timeSlot: timeSlot || null });

        if (existing) {
            return res.status(200).json({ message: "Slot already disabled.", data: existing, status: 400 });
        }

        // Create new disabled slot entry
        const newDisabledSlot = new DisabledSlot({
            date: new Date(date).toISOString(),

            timeSlot: timeSlot || null, // Allow null for full day disable
            disabled: disabled !== false,
        });

        await newDisabledSlot.save();

        res.status(200).json({ message: "Pickup slot disabled successfully.", data: newDisabledSlot, status: 200 });
    } catch (error) {
        console.error("Error disabling slot:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}



export const getDisabledSlots = async (req, res) => {
    try {
        // Step 1: Generate next 5 working days (skip Sat=6, Sun=0)
        const dates = [];
        let current = new Date();

        while (dates.length < 5) {
            current.setDate(current.getDate() + 1);
            const day = current.getDay();
            if (day !== 0 && day !== 6) {
                dates.push(new Date(current)); // push a copy
            }
        }

        const dateStrings = dates.map((d) => d.toISOString().split("T")[0]);

        // Step 2: Fetch all slots in DB for these dates
        const slots = await DisabledSlot.find({
            date: { $in: dateStrings },
        });

        // Step 3: Build grouped response
        const groupedData = dates.map((d) => {
            const dateStr = d.toISOString().split("T")[0];

            const daySlots = Object.entries(TIME_SLOTS).map(([timeSlot, capacity]) => {
                const dbSlot = slots.find((s) => {
                    const slotDate = new Date(s.date);
                    return (
                        slotDate.toISOString().split("T")[0] === dateStr &&
                        s.timeSlot === timeSlot
                    );
                });

                if (dbSlot) {
                    return {
                        time: dbSlot.timeSlot,
                        capacity: dbSlot.capacity,
                        pickupsBooked: dbSlot.pickupsBooked || 0,
                        value: dbSlot.disabled,
                        status: getSlotStatus(dbSlot),
                    };
                } else {
                    return {
                        time: timeSlot,
                        capacity,
                        pickupsBooked: 0,
                        value: false,
                        status: "enabled",
                    };
                }
            });

            return {
                date: dateStr,
                timeSlots: daySlots,
            };
        });

        // Step 4: Return response
        return res.status(200).json({
            data: groupedData,
            success: true,
            status: 200,
            message: "Slots fetched successfully.",
        });
    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};


export const updateDisabledSlot = async (req, res) => {
    try {
        const { date, timeSlot, value } = req.body;

        if (!date || timeSlot === undefined) {
            return res.status(400).json({ error: "Date and timeSlot are required." });
        }

        const isoDate = new Date(date).toISOString();
        const slotQuery = { date: isoDate, timeSlot: timeSlot || null };

        if (value === true) {
            // Enable: remove from disabled collection if it exists
            await DisabledSlot.deleteOne(slotQuery);
            return res.status(200).json({ message: "Slot enabled successfully." });
        } else {
            // Disable: ensure it exists
            const existing = await DisabledSlot.findOne(slotQuery);

            if (!existing) {
                const newSlot = new DisabledSlot({
                    date: isoDate,
                    timeSlot: timeSlot || null,
                    disabled: true,
                });

                await newSlot.save();
                return res.status(201).json({ message: "Slot disabled successfully.", data: newSlot });
            }

            return res.status(200).json({ message: "Slot already disabled." });
        }
    } catch (error) {
        console.error("Error updating disabled slot:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const getSlotData = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: "Date is required." });
        }

        // Use the date as is (YYYY-MM-DD format)
        const formattedDate = new Date(date);
        formattedDate.setHours(0, 0, 0, 0);

        // Get disabled slots for this date
        const disabledSlots = await DisabledSlot.find({
            date: {
                $gte: formattedDate,
                $lt: new Date(formattedDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        // Get all pickups for this date
        const pickups = await pickupModel.find({
            pickupDate: {
                $gte: formattedDate,
                $lt: new Date(formattedDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        // Count pickups per time slot
        const pickupCounts = {};
        pickups.forEach(p => {
            if (p.pickupTime) {
                pickupCounts[p.pickupTime] = (pickupCounts[p.pickupTime] || 0) + 1;
            }
        });

        // Define default time slots
        const defaultTimeSlots = [
            "9:00 AM to 6:00 PM",
            "9:00 AM to 1:00 PM",
            "11:00 AM to 3:00 PM",
            "2:00 PM to 6:00 PM"
        ];

        // Check if day is disabled
        const dayDisabled = disabledSlots.some(s => s.timeSlot === null && s.disabled);

        // Calculate day capacity and booked count
        let dayCapacity = null;
        let dayBooked = 0;
        const dayCapacityRecord = disabledSlots.find(s => s.timeSlot === null);
        if (dayCapacityRecord) {
            dayCapacity = dayCapacityRecord.capacity;
        }

        // Prepare slots data
        const slots = defaultTimeSlots.map(timeSlot => {
            const slotRecord = disabledSlots.find(s => s.timeSlot === timeSlot);
            const pickupsBooked = pickupCounts[timeSlot] || 0;
            dayBooked += pickupsBooked;

            return {
                timeSlot,
                disabled: dayDisabled ? true : (slotRecord ? slotRecord.disabled : false),
                capacity: slotRecord ? slotRecord.capacity :
                    timeSlot === "9:00 AM to 6:00 PM" ? 10 :
                        timeSlot === "9:00 AM to 1:00 PM" ? 8 :
                            timeSlot === "11:00 AM to 3:00 PM" ? 5 :
                                timeSlot === "2:00 PM to 6:00 PM" ? 4 : 5,
                pickupsBooked
            };
        });

        return res.status(200).json({
            date,
            dayCapacity,
            dayBooked,
            dayDisabled,
            slots,
            success: true
        });
    } catch (error) {
        console.error("Error fetching slot data:", error);
        return res.status(500).json({ error: "Internal server error.", success: false });
    }
};

export const getPickupsForSlot = async (req, res) => {
    try {
        const { date, timeSlot } = req.query;
        if (!date || !timeSlot) {
            return res.status(400).json({ error: "Date and timeSlot are required." });
        }

        // Use the date as is (YYYY-MM-DD format)
        const formattedDate = new Date(date);
        formattedDate.setHours(0, 0, 0, 0);

        // Return more fields than just _id
        const pickups = await pickupModel.find({
            pickupDate: {
                $gte: formattedDate,
                $lt: new Date(formattedDate.getTime() + 24 * 60 * 60 * 1000)
            },
            pickupTime: timeSlot
        }, "_id PickupName status phone pickupDate pickupTime"); // Include additional fields

        return res.json({ pickups });
    } catch (err) {
        console.error("Error fetching pickups:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
// Update day-wide capacity
export const setDayCapacity = async (req, res) => {
    try {
        const { date, capacity } = req.body;
        if (!date || !capacity) {
            return res.status(400).json({ error: "Date and capacity are required." });
        }

        const isoDate = new Date(date).toISOString();
        const slot = await DisabledSlot.findOneAndUpdate(
            { date: isoDate, timeSlot: null },
            { capacity },
            { upsert: true, new: true }
        );

        return res.json({ message: "Day capacity updated", slot });
    } catch (err) {
        console.error("Error setting day capacity:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// View pickups for a slot
// export const getPickupsForSlot = async (req, res) => {
//     try {
//         const { date, timeSlot } = req.query;
//         if (!date || !timeSlot) {
//             return res.status(400).json({ error: "Date and timeSlot are required." });
//         }
//         const pickups = await pickupModel.find(
//             { date, timeSlot },
//             "_id" // only return IDs
//         );
//         return res.json({ pickups });
//     } catch (err) {
//         console.error("Error fetching pickups:", err);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };

// Update or add capacity for a slot
export const setSlotCapacity = async (req, res) => {
    try {
        const { date, timeSlot, capacity } = req.body;
        if (!date || !timeSlot || !capacity) {
            return res.status(400).json({ error: "Date, timeSlot and capacity are required." });
        }

        const isoDate = new Date(date).toISOString();
        const slot = await DisabledSlot.findOneAndUpdate(
            { date: isoDate, timeSlot },
            { capacity },
            { upsert: true, new: true }
        );

        return res.json({ message: "Capacity updated", slot });
    } catch (err) {
        console.error("Error setting slot capacity:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};