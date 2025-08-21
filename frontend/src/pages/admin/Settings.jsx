import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";

export default function Settings() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [disabledSlots, setDisabledSlots] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const minDate = addDays(new Date(), 5);

    const getDisabledSlots = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-disabled-slots`);
            setDisabledSlots(response.data?.data || []);
        } catch (error) {
            console.error("Error fetching disabled slots:", error);
        }
    };

    const handleToggleChange = (date, index, currentValue) => {
        const updated = [...disabledSlots];
        updated.forEach((entry) => {
            if (entry.date === date) {
                entry.timeSlots[index].value = !currentValue;
            }
        });
        setDisabledSlots(updated);
    };

    const saveChanges = async () => {
        setIsSaving(true);
        try {
            for (const entry of disabledSlots) {
                const formattedDate = format(new Date(entry.date), "yyyy-MM-dd");

                for (const slot of entry.timeSlots) {
                    await axios.post(`${BASE_URL}update-disabled-slot`, {
                        date: formattedDate,
                        timeSlot: slot.time,
                        value: slot.value,
                    });
                }
            }

            toast.success("Changes saved successfully!");
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save:", error);
            toast.error("Error saving changes");
        } finally {
            setIsSaving(false);
            getDisabledSlots();
        }
    };

    const timeSlots = [
        "9:00 AM to 6:00 PM",
        "9:00 AM to 1:00 PM",
        "11:00 AM to 3:00 PM",
        "2:00 PM to 6:00 PM",
    ];

    const isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    const handleSubmit = async () => {
        if (!selectedDate) {
            toast.error("Please select a date.");
            return;
        }

        const payload = {
            date: format(selectedDate, "yyyy-MM-dd"),
            timeSlot: selectedTimeSlot || null,
            disabled: true,
        };

        try {
            await axios.post(`${BASE_URL}disable-slot`, payload);
            toast.success("Pickup slot disabled successfully!");
            setSelectedDate(null);
            setSelectedTimeSlot("");
            getDisabledSlots();
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to disable slot.");
        }
    };

    useEffect(() => {
        getDisabledSlots();
    }, []);

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Disable Pickup Slots</h2>

            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Select Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    filterDate={isWeekday}
                    minDate={minDate}
                    placeholderText="Select a date"
                    dateFormat="yyyy-MM-dd"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
            </div>

            <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Select Time Slot (optional)
                </label>
                <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                >
                    <option value="">-- Disable Entire Day --</option>
                    {timeSlots.map((slot, index) => (
                        <option key={index} value={slot}>
                            {slot}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                    Leave empty to disable all pickups on the selected date.
                </p>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 mb-3"
            >
                Disable Pickup Slot
            </button>

            <button
                onClick={() => setShowModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
                View All Disabled Slots
            </button>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Edit Pickup Slots</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-600 hover:text-red-600 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 border">Date</th>
                                        <th className="p-2 border">Slot</th>
                                        <th className="p-2 border">Disabled</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {disabledSlots.map((entry, i) =>
                                        entry.timeSlots.map((slot, j) => (
                                            <tr key={`${i}-${j}`}>
                                                {j === 0 && (
                                                    <td
                                                        className="border p-2 font-medium align-top"
                                                        rowSpan={entry.timeSlots.length}
                                                    >
                                                        {format(new Date(entry.date), "yyyy-MM-dd")}
                                                    </td>
                                                )}
                                                <td className="border p-2">{slot.time}</td>
                                                <td className="border p-2 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={!slot.value}
                                                        onChange={() =>
                                                            handleToggleChange(entry.date, j, slot.value)
                                                        }
                                                        className="w-5 h-5"
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <button
                            onClick={saveChanges}
                            disabled={isSaving}
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md w-full transition duration-200"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
