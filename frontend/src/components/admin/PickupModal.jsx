import React, { useState } from "react";
import {
    FaTruck,
    FaBoxOpen,
    FaWarehouse,
    FaShippingFast,
    FaCheckCircle,
    FaTimesCircle,
    FaSearch,
    FaClock,
    FaEdit,
} from "react-icons/fa";

export default function PickupModal({
    pickup,
    onClose,
    formatDate,
    formatDateTime,
    onUpdateStatus,
    onUpdateCarrier,
    onAddExtraCharges,
    onUpdateDate
}) {
    if (!pickup) return null;

    const [activeTab, setActiveTab] = useState("pickup");
    const [newStatus, setNewStatus] = useState(pickup.status || "");
    const [carrier, setCarrier] = useState(pickup?.Carrier || "");
    const [tracking, setTracking] = useState(pickup?.TrackingNumber || "");
    const [extraCharges, setExtraCharges] = useState(pickup?.extraCharge || "");
    const [labelIssue, setLabelIssue] = useState(pickup?.labelIssue || "");

    const [isEditingDate, setIsEditingDate] = useState(false);
    const [editDate, setEditDate] = useState(
        pickup.pickupDate ? pickup.pickupDate.split("T")[0] : ""
    );

    const addressObj = pickup.pickupAddress || {};
    const fullAddress = `${addressObj.street || ""}, ${addressObj.suite || ""}, ${addressObj.city || ""
        }, ${addressObj.state || ""}, ${addressObj.postalCode || ""}`;

    const statusOptions = [
        "Pickup Requested",
        "Picked Up",
        "Inspected",
        "Completed",
        "Pickup Cancelled",
        "In Transit",
        "Delivered",
    ];

    const statusIcons = {
        "pickup requested": <FaTruck className="text-purple-600" />,
        "picked up": <FaBoxOpen className="text-green-600" />,
        inspected: <FaSearch className="text-yellow-600" />,
        completed: <FaCheckCircle className="text-green-700" />,
        "pickup cancelled": <FaTimesCircle className="text-red-600" />,
        "in transit": <FaShippingFast className="text-blue-600" />,
        delivered: <FaWarehouse className="text-indigo-600" />,
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-purple-600 text-2xl"
                >
                    ✕
                </button>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-purple-700 flex items-center space-x-2">
                    {statusIcons[pickup.status?.toLowerCase()] || <FaTruck />}
                    <span>Pickup Details</span>
                </h3>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-4">
                    {["pickup", "customer", "Pickup Items", "history", "actions"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 font-medium rounded-t-lg ${activeTab === tab
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {tab === "pickup"
                                ? "Pickup Info"
                                : tab === "customer"
                                    ? "Customer Info"
                                    : tab === "Pickup Items"
                                        ? "Pickup Items"
                                        : tab === "history"
                                            ? "History"
                                            : "Actions"}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Pickup Info */}
                    {activeTab === "pickup" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-3 border rounded-xl shadow-sm bg-gray-50">
                                <p className="text-sm text-gray-500">ID</p>
                                <p className="font-semibold text-purple-700">{pickup.PickupName}</p>
                            </div>

                            {/* Pickup Date (Editable) */}
                            <div className="p-3 border rounded-xl shadow-sm bg-gray-50">
                                <p className="text-sm text-gray-500">Pickup Date</p>
                                {!isEditingDate ? (
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{formatDate(pickup.pickupDate)}</p>
                                        <FaEdit
                                            className="text-purple-700 cursor-pointer hover:text-gray-600"
                                            onClick={() => setIsEditingDate(true)}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="date"
                                            value={editDate}
                                            onChange={(e) => setEditDate(e.target.value)}
                                            className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <button
                                            onClick={() => {
                                                onUpdateDate(pickup._id, editDate)
                                                setIsEditingDate(false);
                                            }}
                                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => setIsEditingDate(false)}
                                            className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-3 border rounded-xl shadow-sm bg-gray-50">
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-semibold">{pickup.pickupTime}</p>
                            </div>

                            <div className="p-3 border rounded-xl shadow-sm bg-gray-50">
                                <p className="text-sm text-gray-500">Type</p>
                                <p className="font-semibold">{pickup.pickupType}</p>
                            </div>

                            <div className="p-3 border rounded-xl shadow-sm bg-gray-50 sm:col-span-2">
                                <p className="text-sm text-gray-500">Note</p>
                                <p className="font-semibold">{pickup.note || "N/A"}</p>
                            </div>

                            <div className="p-3 border rounded-xl shadow-sm bg-gray-50 sm:col-span-2">
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-semibold">{fullAddress}</p>
                            </div>

                            <div className="p-3 border rounded-xl shadow-sm bg-gray-50">
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-semibold">{pickup.phone}</p>
                            </div>

                            <div className="p-3 border rounded-xl shadow-sm bg-gray-50">
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-semibold">{pickup.status}</p>
                            </div>

                            <div className="p-3 border rounded-xl shadow-sm bg-gray-50">
                                <p className="text-sm text-gray-500">Total Price</p>
                                <p className="font-semibold text-green-600">${pickup.totalPrice}</p>
                            </div>

                            {pickup.extraCharge !== undefined && pickup.extraCharge !== null && (
                                <div className="p-3 border rounded-xl shadow-sm bg-gray-50">
                                    <p className="text-sm text-gray-500">Extra Charges</p>
                                    <p className="font-semibold text-red-600">${pickup.extraCharge}</p>
                                </div>
                            )}


                            {pickup.labelIssue && (
                                <div className="p-3 border rounded-xl shadow-sm bg-gray-50 sm:col-span-2">
                                    <p className="text-sm text-gray-500">Label Issue</p>
                                    <p className="font-semibold">{pickup.labelIssue || "N/A"}</p>
                                </div>
                            )}
                        </div>
                    )}


                    {/* Customer Info */}
                    {activeTab === "customer" && (
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={pickup.userId?.profile}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full border-2 border-purple-500"
                                />
                                <div>
                                    <p className="font-bold text-purple-700">
                                        {pickup.userId?.name}
                                    </p>
                                    <p className="text-gray-600">{pickup.userId?.email}</p>
                                </div>
                            </div>
                            <p>
                                <strong className="text-purple-700">Phone:</strong>{" "}
                                {pickup.userId?.phone}
                            </p>
                            <p>
                                <strong className="text-purple-700">Verified:</strong>{" "}
                                {pickup.userId?.verified ? "Yes ✅" : "No ❌"}
                            </p>
                            <p>
                                <strong className="text-purple-700">Joined:</strong>{" "}
                                {formatDate(pickup.userId?.createdAt)}
                            </p>
                        </div>
                    )}

                    {/* Pickup Info */}
                    {activeTab === "Pickup Items" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl shadow-sm bg-gray-50">
                                <p className="font-semibold text-gray-800">Total Items</p>
                                <span className="text-purple-700 font-bold">
                                    {pickup.bundleId?.length || 0}
                                </span>
                            </div>
                            {pickup.bundleId?.length > 0 ? (
                                pickup.bundleId.map((bundle) => (
                                    <div
                                        key={bundle._id}
                                        className="p-4 border border-gray-200 rounded-xl shadow-sm"
                                    >
                                        <p className="font-bold text-purple-700">
                                            {bundle.BundleName}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Status: {bundle.status}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Pickup Time: {formatDate(bundle.pickupTime)}
                                        </p>

                                        {/* Products */}
                                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {bundle.products.map((product) => (
                                                <div
                                                    key={product._id}
                                                    className="p-3 border rounded-lg flex items-center space-x-3"
                                                >
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.productName}
                                                        className="w-16 h-16 object-cover rounded-lg border"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{product.productName}</p>
                                                        <a
                                                            href={product.labelReceipt}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-sm text-purple-600 hover:underline"
                                                        >
                                                            Print Label
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No bundles found.</p>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === "history" && (
                        <div className="space-y-4">
                            {pickup.statusHistory?.length > 0 ? (
                                <div className="relative">
                                    <div className="absolute left-4 top-0 h-full w-1 bg-gray-200 rounded"></div>
                                    <ul className="space-y-4">
                                        {pickup.statusHistory
                                            .slice()
                                            .reverse()
                                            .map((entry) => (
                                                <li key={entry._id} className="relative pl-10 flex items-start">
                                                    <div className="absolute left-1 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                                                        {entry.type === "extraCharge" ? "💰" : statusIcons[entry.status?.toLowerCase()] || <FaClock />}
                                                    </div>
                                                    <div>
                                                        {entry.type === "extraCharge" ? (
                                                            <>
                                                                <p className="font-semibold text-red-700">
                                                                    Extra Charge: ${entry.extraCharge}
                                                                </p>
                                                                <p className="text-sm text-gray-500">{entry.labelIssue}</p>
                                                            </>
                                                        ) : (
                                                            <p className="font-semibold text-gray-800">{entry.status}</p>
                                                        )}
                                                        <p className="text-sm text-gray-500">{formatDateTime(entry.updatedAt)}</p>
                                                    </div>
                                                </li>
                                            ))}

                                    </ul>
                                </div>
                            ) : (
                                <p className="text-gray-500">No status history available.</p>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    {activeTab === "actions" && (
                        <div className="space-y-4">
                            {/* Update Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Update Status
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => onUpdateStatus(pickup._id, newStatus)}
                                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Save Status
                                </button>
                            </div>

                            {/* Carrier & Tracking */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Carrier
                                </label>
                                <input
                                    type="text"
                                    value={carrier}
                                    onChange={(e) => setCarrier(e.target.value)}
                                    placeholder="e.g., FedEx"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">
                                    Tracking Number
                                </label>
                                <input
                                    type="text"
                                    value={tracking}
                                    onChange={(e) => setTracking(e.target.value)}
                                    placeholder="e.g., 123456789"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                    onClick={() =>
                                        onUpdateCarrier(pickup._id, carrier, tracking)
                                    }
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Carrier Info
                                </button>
                            </div>
                            {pickup.status === "Inspected" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Extra Charges
                                    </label>
                                    <input
                                        type="text"
                                        value={extraCharges}
                                        onChange={(e) => setExtraCharges(e.target.value)}
                                        placeholder="e.g., 321"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">
                                        Label Issue
                                    </label>
                                    <textarea
                                        value={labelIssue}
                                        onChange={(e) => setLabelIssue(e.target.value)}
                                        placeholder="Describe label issue..."
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <button
                                        onClick={() =>
                                            onAddExtraCharges(pickup._id, extraCharges, labelIssue)
                                        }
                                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Charge
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
