import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function Settings() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
    const minDate = addDays(new Date(), 5);

    const getDisabledSlots = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-disabled-slots`);
            console.log("Response:", response.data); // Log the response data;
        } catch (error) {
            console.error("Error fetching disabled slots:", error);
            return [];
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
        return day !== 0 && day !== 6; // disable weekends
    };

    const handleSubmit = async () => {
        if (!selectedDate) {
            toast.error("Please select a date.");
            return;
        }

        const payload = {
            date: format(selectedDate, "yyyy-MM-dd"),
            timeSlot: selectedTimeSlot || null, // if not selected, it's a full day disable
            disabled: true,
        };

        try {
            const response = await axios.post(`${BASE_URL}disable-slot`, payload);
            console.log("Response:", response.data);
            toast.success("Pickup slot disabled successfully!");
            setSelectedDate(null);
            setSelectedTimeSlot("");
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to disable slot. Please try again.");
        }
    };

    useEffect(() => {
        getDisabledSlots();
    }, []); 

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Disable Pickup Slots
            </h2>

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
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
                Disable Pickup Slot
            </button>
        </div>
    );
}
