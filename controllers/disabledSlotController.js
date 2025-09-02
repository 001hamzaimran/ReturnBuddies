import DisabledSlot from "../models/DisabledSlot.js";

export const disableSlot = async (req, res) => {
    try {
        const { date, timeSlot, disabled } = req.body;

        // Validate input
        if (!date) {
            return res.status(400).json({ error: "Date is required." });
        }

        const existing = await DisabledSlot.findOne({ date, timeSlot: timeSlot || null });

        if (existing) {
            return res.status(409).json({ message: "Slot already disabled." });
        }

        // Create new disabled slot entry
        const newDisabledSlot = new DisabledSlot({
            date: new Date(date).toISOString(),

            timeSlot: timeSlot || null, // Allow null for full day disable
            disabled: disabled !== false,
        });

        await newDisabledSlot.save();

        res.status(201).json({ message: "Pickup slot disabled successfully.", data: newDisabledSlot });
    } catch (error) {
        console.error("Error disabling slot:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const getDisabledSlots = async (req, res) => {
    try {
        const disabledSlots = await DisabledSlot.find().limit(5);

        const groupedSlots = {};

        disabledSlots.forEach(slot => {
            const date = slot.date;
            if (!groupedSlots[date]) {
                groupedSlots[date] = {
                    date: date,
                    timeSlots: [
                        { time: "9:00 AM to 6:00 PM", value: false },
                        { time: "9:00 AM to 1:00 PM", value: false },
                        { time: "11:00 AM to 3:00 PM", value: false },
                        { time: "2:00 PM to 6:00 PM", value: false }
                    ],
                    disabled: false
                };
            }

            if (!slot.timeSlot) {
                // full-day disabled
                groupedSlots[date].disabled = true;
            } else {
                // mark the specific timeSlot as true
                const slotEntry = groupedSlots[date].timeSlots.find(t => t.time === slot.timeSlot);
                if (slotEntry) {
                    slotEntry.value = true;
                }
            }
        });

        return res.status(200).json({ data: Object.values(groupedSlots), status: 200, success: true });
    } catch (error) {
        console.error("Error fetching disabled slots:", error);
        return res.status(500).json({ error: "Internal server error.", success: false, status: 500 });
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
        const isoDate = new Date(date).toISOString();

        const slots = await DisabledSlot.find({ date: isoDate });

        return res.status(200).json({ data: slots, status: 200, success: true });
    } catch (error) {
        console.error("Error fetching slot data:", error);
        return res.status(500).json({ error: "Internal server error.", success: false, status: 500 });
    }
};