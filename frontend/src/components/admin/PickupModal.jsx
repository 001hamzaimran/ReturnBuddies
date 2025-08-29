import React, { useState } from "react";
import { FaTruck, FaBoxOpen, FaWarehouse, FaShippingFast, FaCheckCircle, FaTimesCircle, FaSearch } from "react-icons/fa";

export default function PickupModal({ pickup, onClose, formatDate, onUpdateStatus, onUpdateCarrier }) {
    if (!pickup) return null;

    const [activeTab, setActiveTab] = useState("pickup");
    const [newStatus, setNewStatus] = useState(pickup.status || "");
    const [carrier, setCarrier] = useState("");
    const [tracking, setTracking] = useState("");

    const addressObj = pickup.pickupAddress || {};
    const fullAddress = `${addressObj.street || ""}, ${addressObj.suite || ""}, ${addressObj.city || ""}, ${addressObj.state || ""}, ${addressObj.postalCode || ""}`;

    const statusOptions = [
        "Pickup Requested",
        "Picked Up",
        "Inspected",
        "Completed",
        "Pickup Cancelled",
        "In Transit",
        "Delivered"
    ]


   const statusIcons = {
  "pickup requested": <FaTruck className="text-purple-600" />,
  "picked up": <FaBoxOpen className="text-green-600" />,
  "inspected": <FaSearch className="text-yellow-600" />,
  "completed": <FaCheckCircle className="text-green-700" />,
  "pickup cancelled": <FaTimesCircle className="text-red-600" />,
  "in transit": <FaShippingFast className="text-blue-600" />,
  "delivered": <FaWarehouse className="text-indigo-600" />,
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
                <div className="flex space-x-4 border-b border-gray-200 mb-4">
                    {["pickup", "customer", "bundles", "actions"].map((tab) => (
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
                                    : tab === "bundles"
                                        ? "Bundles"
                                        : "Actions"}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Pickup Info */}
                    {activeTab === "pickup" && (
                        <div className="space-y-2">
                            <p><strong className="text-purple-700">ID:</strong> {pickup.PickupName}</p>
                            <p><strong className="text-purple-700">Date:</strong> {formatDate(pickup.pickupDate)}</p>
                            <p><strong className="text-purple-700">Time:</strong> {pickup.pickupTime}</p>
                            <p><strong className="text-purple-700">Type:</strong> {pickup.pickupType}</p>
                            <p><strong className="text-purple-700">Address:</strong> {fullAddress}</p>
                            <p><strong className="text-purple-700">Phone:</strong> {pickup.phone}</p>
                            <p><strong className="text-purple-700">Status:</strong> {pickup.status}</p>
                            <p><strong className="text-purple-700">Total Price:</strong> ${pickup.totalPrice}</p>
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
                                    <p className="font-bold text-purple-700">{pickup.userId?.name}</p>
                                    <p className="text-gray-600">{pickup.userId?.email}</p>
                                </div>
                            </div>
                            <p><strong className="text-purple-700">Phone:</strong> {pickup.userId?.phone}</p>
                            <p><strong className="text-purple-700">Verified:</strong> {pickup.userId?.verified ? "Yes ✅" : "No ❌"}</p>
                            <p><strong className="text-purple-700">Joined:</strong> {formatDate(pickup.userId?.createdAt)}</p>
                        </div>
                    )}

                    {/* Bundles Info */}
                    {activeTab === "bundles" && (
                        <div className="space-y-4">
                            {pickup.bundleId?.length > 0 ? (
                                pickup.bundleId.map((bundle) => (
                                    <div key={bundle._id} className="p-4 border border-gray-200 rounded-xl shadow-sm">
                                        <p className="font-bold text-purple-700">{bundle.BundleName}</p>
                                        <p className="text-gray-600 text-sm">Status: {bundle.status}</p>
                                        <p className="text-gray-600 text-sm">Pickup Time: {formatDate(bundle.pickupTime)}</p>

                                        {/* Products */}
                                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {bundle.products.map((product) => (
                                                <div key={product._id} className="p-3 border rounded-lg flex items-center space-x-3">
                                                    <img src={product.thumbnail} alt={product.productName} className="w-16 h-16 object-cover rounded-lg border" />
                                                    <div>
                                                        <p className="font-medium">{product.productName}</p>
                                                        <a href={product.labelReceipt} target="_blank" rel="noreferrer" className="text-sm text-purple-600 hover:underline">
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

                    {/* Actions */}
                    {activeTab === "actions" && (
                        <div className="space-y-4">
                            {/* Update Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>{status}</option>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                                <input
                                    type="text"
                                    value={carrier}
                                    onChange={(e) => setCarrier(e.target.value)}
                                    placeholder="e.g., FedEx"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Tracking Number</label>
                                <input
                                    type="text"
                                    value={tracking}
                                    onChange={(e) => setTracking(e.target.value)}
                                    placeholder="e.g., 123456789"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                    onClick={() =>  onUpdateCarrier(pickup._id, carrier, tracking)}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Carrier Info
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
