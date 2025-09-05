import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

const API = {

    getDay: (base, date) => `${base}get-slots-data?date=${date}`,

    toggleSlot: (base) => `${base}update-disabled-slot`,

    disableDay: (base) => `${base}disable-slot`,

    enableDay: (base) => `${base}update-disabled-slot`,

    setSlotCapacity: (base) => `${base}set-slot-capacity`,

    setDayCapacity: (base) => `${base}set-day-capacity`,

    getPickups: (base, date, timeSlot) => `${base}pickups?date=${date}&timeSlot=${encodeURIComponent(timeSlot)}`,
};

const DEFAULT_SLOTS = [
    "9:00 AM to 6:00 PM",
    "9:00 AM to 1:00 PM",
    "11:00 AM to 3:00 PM",
    "2:00 PM to 6:00 PM",
];

function statusFor({ disabled, pickupsBooked = 0, capacity = 0 }) {
    if (disabled) return { label: "⚪ Disabled", color: "text-gray-600" };
    if (capacity > 0 && pickupsBooked >= capacity) return { label: "🔴 At Capacity", color: "text-red-600" };
    if (capacity > 0 && pickupsBooked >= Math.floor(0.8 * capacity)) return { label: "🟡 Almost Full", color: "text-yellow-600" };
    return { label: "🟢 Enabled", color: "text-green-600" };
}

function Legend() {
    return (
        <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1"><span>🟢</span> Enabled</span>
            <span className="inline-flex items-center gap-1"><span>🟡</span> Almost Full (80%+)</span>
            <span className="inline-flex items-center gap-1"><span>🔴</span> At Capacity</span>
            <span className="inline-flex items-center gap-1"><span>⚪</span> Disabled</span>
        </div>
    );
}

function CapacityModal({ open, onClose, onSave, initialCapacity }) {
    const [val, setVal] = useState(initialCapacity ?? 0);
    useEffect(() => {
        if (open) setVal(initialCapacity ?? 0);
    }, [open, initialCapacity]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Set Capacity</h3>
                <input
                    type="number"
                    min={0}
                    value={val}
                    onChange={(e) => setVal(parseInt(e.target.value || "0", 10))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
                    <button
                        onClick={() => onSave(Math.max(0, Number(val) || 0))}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

function PickupsModal({ open, onClose, pickups }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Pickup Details</h3>
                {Array.isArray(pickups) && pickups.length > 0 ? (
                    <ul className="space-y-3 max-h-72 overflow-auto">
                        {pickups.map((p) => (
                            <li key={p._id} className="border-b pb-2 last:border-b-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold">{p.PickupName || "Unnamed Pickup"}</div>
                                        <div className="text-sm text-gray-600">ID: {p._id}</div>
                                        <div className="text-sm text-gray-600">Status: {p.status}</div>
                                        {p.phone && <div className="text-sm text-gray-600">Phone: {p.phone}</div>}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">
                                            {new Date(p.pickupDate).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-gray-600">{p.pickupTime}</div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-600">No pickups scheduled for this slot.</p>
                )}
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-md border">Close</button>
                </div>
            </div>
        </div>
    );
}

export default function PickupSlotsDashboard() {
    const BASE_URL = import.meta.env.VITE_BASE_URL || "/api/";
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dayData, setDayData] = useState(null);

    // UI state
    const [capacityModal, setCapacityModal] = useState({ open: false, slot: null });
    const [pickupsModal, setPickupsModal] = useState({ open: false, pickups: [] });

    const minDate = addDays(new Date(), 0); // allow selecting any date from today; adjust if you want 5 days: addDays(new Date(), 5)

    const normalizedDate = useMemo(
        () => (selectedDate ? selectedDate.toISOString().split('T')[0] : null),
        [selectedDate]
    );

    // Update the fetchDay function to handle the API response correctly
    async function fetchDay(dateISO) {
        if (!dateISO) return;
        setLoading(true);
        try {
            const { data } = await axios.get(API.getDay(BASE_URL, dateISO));

            if (!data || !data.success) {
                throw new Error(data.error || "Failed to load data");
            }

            // If the backend returns the data in the expected format, use it directly
            if (data.slots && Array.isArray(data.slots)) {
                setDayData({
                    date: data.date || dateISO,
                    dayCapacity: data.dayCapacity ?? null,
                    dayBooked: data.dayBooked ?? data.slots.reduce((a, s) => a + (s.pickupsBooked || 0), 0),
                    dayDisabled: Boolean(data.dayDisabled),
                    slots: data.slots,
                });
            } else {
                // Fallback to the previous logic if the response format is different
                const map = new Map((data?.slots || []).map((s) => [s.timeSlot, s]));
                const mergedSlots = DEFAULT_SLOTS.map((t) =>
                    map.get(t) || { timeSlot: t, disabled: false, capacity: 5, pickupsBooked: 0 }
                );

                setDayData({
                    date: data?.date || dateISO,
                    dayCapacity: data?.dayCapacity ?? null,
                    dayBooked: data?.dayBooked ?? mergedSlots.reduce((a, s) => a + (s.pickupsBooked || 0), 0),
                    dayDisabled: Boolean(data?.dayDisabled),
                    slots: mergedSlots,
                });
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to load slots for the selected date.");
        } finally {
            setLoading(false);
        }
    }

    // Update the openViewPickups function to handle the API response correctly
    async function openViewPickups(slot) {
        if (!dayData) return;
        try {
            const { data } = await axios.get(API.getPickups(BASE_URL, dayData.date, slot.timeSlot));

            // Handle both response formats: {pickups: [...]} and {pickup: {...}}
            let pickupsData = [];
            if (data.pickups) {
                pickupsData = data.pickups;
            } else if (data.pickup) {
                pickupsData = [data.pickup];
            }

            setPickupsModal({ open: true, pickups: pickupsData });
        } catch (e) {
            console.error(e);
            toast.error("Failed to load pickups");
        }
    }

    useEffect(() => {
        if (normalizedDate) fetchDay(normalizedDate);
    }, [normalizedDate]);

    const totalBooked = useMemo(() => {
        return (dayData?.slots || []).reduce((acc, s) => acc + (s.pickupsBooked || 0), 0);
    }, [dayData]);

    const totalCapacity = useMemo(() => {
        return (dayData?.slots || []).reduce((acc, s) => acc + (s.capacity || 0), 0);
    }, [dayData]);

    async function handleToggleSlot(slot) {
        if (!dayData) return;

        // If disabling a slot with existing pickups → confirmation
        if (!slot.disabled && (slot.pickupsBooked || 0) > 0) {
            const ok = window.confirm(
                `This slot already has ${slot.pickupsBooked} bookings. Existing pickups stay, no new bookings allowed. Continue?`
            );
            if (!ok) return;
        }

        try {
            const body = {
                date: dayData.date,
                timeSlot: slot.timeSlot,
                // Backend contract: value:true to ENABLE (remove disabled flag), false to DISABLE.
                value: slot.disabled ? true : false,
            };
            await axios.post(API.toggleSlot(BASE_URL), body);
            toast.success(slot.disabled ? "Slot enabled" : "Slot disabled");
            fetchDay(dayData.date);
        } catch (e) {
            console.error(e);
            toast.error("Failed to update slot");
        }
    }

    async function handleDisableDay() {
        if (!dayData) return;

        // If any pickups exist for the day, show confirmation.
        if ((dayData.dayBooked || totalBooked) > 0) {
            const ok = window.confirm(
                `This day already has ${(dayData.dayBooked || totalBooked)} bookings. Existing pickups stay, no new bookings allowed. Continue?`
            );
            if (!ok) return;
        }

        try {
            await axios.post(API.disableDay(BASE_URL), { date: dayData.date, timeSlot: null, disabled: true });
            toast.success("Entire day disabled");
            fetchDay(dayData.date);
        } catch (e) {
            console.error(e);
            toast.error("Failed to disable day");
        }
    }

    async function handleEnableDay() {
        if (!dayData) return;
        try {
            await axios.post(API.enableDay(BASE_URL), { date: dayData.date, timeSlot: null, value: true });
            toast.success("Entire day enabled");
            fetchDay(dayData.date);
        } catch (e) {
            console.error(e);
            toast.error("Failed to enable day");
        }
    }

    function openSetCapacity(slot) {
        setCapacityModal({ open: true, slot });
    }

    async function saveSlotCapacity(newCap) {
        const slot = capacityModal.slot;
        if (!slot || !dayData) return;
        try {
            await axios.post(API.setSlotCapacity(BASE_URL), {
                date: dayData.date,
                timeSlot: slot.timeSlot,
                capacity: newCap,
            });
            toast.success("Capacity updated");
            setCapacityModal({ open: false, slot: null });
            fetchDay(dayData.date);
        } catch (e) {
            console.error(e);
            toast.error("Failed to update capacity");
        }
    }

    // async function openViewPickups(slot) {
    //     if (!dayData) return;
    //     try {
    //         const { data } = await axios.get(API.getPickups(BASE_URL, dayData.date, slot.timeSlot));
    //         setPickupsModal({ open: true, pickups: data?.pickups || [] });
    //     } catch (e) {
    //         console.error(e);
    //         toast.error("Failed to load pickups");
    //     }
    // }

    async function saveDayCapacity(newCap) {
        if (!dayData) return;
        try {
            await axios.post(API.setDayCapacity(BASE_URL), { date: dayData.date, capacity: newCap });
            toast.success("Day capacity updated");
            fetchDay(dayData.date);
        } catch (e) {
            console.error(e);
            toast.error("Failed to update day capacity");
        }
    }

    return (
        <div className="mx-auto max-w-5xl p-6">
            <Toaster />
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Pickup Slots Dashboard</h1>
            <p className="mb-6 text-sm text-gray-600">Manage capacities, enable/disable slots, and view bookings by date.</p>

            {/* Controls Row */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Select Date</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={setSelectedDate}
                        minDate={minDate}
                        placeholderText="Select a date"
                        dateFormat="yyyy-MM-dd"
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                {/* Legend */}
                <div className="flex items-end">
                    <div className="w-full rounded-xl border p-3">
                        <Legend />
                    </div>
                </div>
            </div>

            {/* Day Summary Card */}
            {dayData && (
                <div className="mb-6 rounded-2xl border bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="text-sm text-gray-500">Date</div>
                            <div className="text-lg font-semibold">{dayData.date}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            <div className="rounded-xl bg-gray-50 p-3 text-center">
                                <div className="text-xs text-gray-500">Total Booked</div>
                                <div className="text-base font-semibold">{totalBooked}</div>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-3 text-center">
                                <div className="text-xs text-gray-500">Total Capacity</div>
                                <div className="text-base font-semibold">{totalCapacity}</div>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-3 text-center">
                                <div className="text-xs text-gray-500">Day Capacity</div>
                                <div className="text-base font-semibold">{dayData.dayCapacity ?? "—"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Day Actions */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            onClick={handleDisableDay}
                            className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                            Disable Entire Day
                        </button>
                        <button
                            onClick={handleEnableDay}
                            className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            Enable Entire Day
                        </button>
                        <button
                            onClick={() => setCapacityModal({ open: true, slot: { timeSlot: null, capacity: dayData.dayCapacity || 0 } })}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Set Day Capacity
                        </button>
                    </div>
                </div>
            )}

            {/* Slots Table */}
            <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                <table className="w-full table-auto text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3">Time Slot</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Booked / Capacity</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={4} className="p-6 text-center text-gray-500">Loading…</td>
                            </tr>
                        )}
                        {!loading && dayData && dayData.slots.map((slot) => {
                            const st = statusFor(slot);
                            return (
                                <tr key={slot.timeSlot} className="border-t">
                                    <td className="p-3 font-medium">{slot.timeSlot}</td>
                                    <td className={`p-3 font-semibold ${st.color}`}>{st.label}</td>
                                    <td className="p-3 text-center">
                                        {(slot.pickupsBooked ?? 0)} / {(slot.capacity ?? 0)}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleToggleSlot(slot)}
                                                className={`rounded-lg px-3 py-1.5 text-white ${slot.disabled ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                                            >
                                                {slot.disabled ? "Enable" : "Disable"}
                                            </button>
                                            <button
                                                onClick={() => openSetCapacity(slot)}
                                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
                                            >
                                                Set Capacity
                                            </button>
                                            <button
                                                onClick={() => openViewPickups(slot)}
                                                className="rounded-lg bg-gray-700 px-3 py-1.5 text-white hover:bg-black"
                                            >
                                                View Pickups
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {!loading && (!dayData || dayData.slots.length === 0) && (
                            <tr>
                                <td colSpan={4} className="p-6 text-center text-gray-500">Select a date to view slots.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <CapacityModal
                open={capacityModal.open}
                initialCapacity={capacityModal.slot?.capacity}
                onClose={() => setCapacityModal({ open: false, slot: null })}
                onSave={(val) => {
                    if (capacityModal.slot?.timeSlot) {
                        // per-slot capacity
                        saveSlotCapacity(val);
                    } else {
                        // day capacity
                        saveDayCapacity(val);
                        setCapacityModal({ open: false, slot: null });
                    }
                }}
            />

            <PickupsModal
                open={pickupsModal.open}
                pickups={pickupsModal.pickups}
                onClose={() => setPickupsModal({ open: false, pickups: [] })}
            />
        </div>
    );
}