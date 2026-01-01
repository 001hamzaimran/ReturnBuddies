import { FiSearch } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import PickupModal from "../../components/admin/PickupModal";
import PickupStatus from "../../components/admin/PickupStatus";
import PickupPagination from "../../components/admin/PickupPagination";

export default function PickupManagement() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user")).user._id;
  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [pickups, setPickups] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [TotalPickups, setTotalPickups] = useState(0);


  const [pickedUpCount, setPickedUpCount] = useState(0);
  const [warehouseCount, setWarehouseCount] = useState(0);
  const [carrierCount, setCarrierCount] = useState(0);

  const [searchProductByID, setSearchProductByID] = useState("");
  const [selectedPickupFilter, setSelectedPickupFilter] = useState("");

  // Combined Filter (Product ID + Dropdown Status)
  const filteredPickups = pickups.filter((pickup) => {
    const search = searchProductByID.trim().toLowerCase();

    const matchesProductId = pickup?.PickupName
      ?.toLowerCase()
      .includes(search);

    const matchesStatus =
      !selectedPickupFilter ||
      pickup.status?.toLowerCase() === selectedPickupFilter.toLowerCase();

    return matchesProductId && matchesStatus;
  });


  // Pagination after filtering
  const totalPages = Math.ceil(filteredPickups.length / itemsPerPage) || 1;
  const paginatedPickups = filteredPickups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateStatus = async (pickupId, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}update-pickup/${pickupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userid: userId,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      getAllPickups(); // Refresh the list after updating
      setSelectedPickup(null)
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getAllPickups = async () => {
    try {
      const response = await fetch(`${BASE_URL}get-all-pickup`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userid: userId,
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setPickups(data.data);
      setTotalPickups(data.data.length);
      setCurrentPage(1);
      calculateCounts(data.data);
    } catch (error) {
      console.error("Error fetching pickups:", error);
    }
  };

  const calculateCounts = (pickupList) => {
    let picked = 0;
    let warehouse = 0;
    let carrier = 0;

    pickupList.forEach((pickup) => {
      const status = pickup.status?.toLowerCase();
      if (status === "picked up") picked++;
      else if (["delivered", "inspected"].includes(status)) warehouse++;
      else if (["in transit", "completed"].includes(status)) carrier++;
    });

    setPickedUpCount(picked);
    setWarehouseCount(warehouse);
    setCarrierCount(carrier);
  };

  const statusColor = {
    "pickup requested": "bg-purple-100 text-purple-700",
    "picked up": "bg-green-100 text-green-700",
    inspected: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-200 text-green-800",
    "pickup cancelled": "bg-red-100 text-red-700",
    "in transit": "bg-blue-100 text-blue-700",
    delivered: "bg-teal-100 text-teal-700",
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toISOString().split("T")[0];
  };


  const formatDateTime = (iso) => {
    const d = new Date(iso);
    const date = d.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = d.toISOString().split("T")[1].split(".")[0]; // HH:MM:SS
    return `${date} ${time}`;
  };

  const addTrackingCarrier = async (pickupId, carrier, trackingNumber) => {
    try {
      const response = await fetch(`${BASE_URL}add-tracking-carrier/${pickupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userid: userId,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Carrier: carrier, TrackingNumber: trackingNumber }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      getAllPickups(); // Refresh the list after updating
      setSelectedPickup(null)
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const AddExtraCharges = async (pickupId, extraCharges, chargeDetail) => {
    try {
      const response = await fetch(`${BASE_URL}add-extra-charges/${pickupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userid: userId,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ extraCharges, chargeDetail }),
      });
      
      const { success } = await response.json();
      if (success) {
        getAllPickups(); // Refresh the list after updating
        setSelectedPickup(null)
      } 
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const AddLabelIssue = async (pickupId, labelIssue) => {
    try {
      const response = await fetch(`${BASE_URL}add-label-issue/${pickupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userid: userId,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ labelIssue: labelIssue }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      getAllPickups(); // Refresh the list after updating
      setSelectedPickup(null)
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const onUpdateDate = async (pickupId, newDate) => {
    try {
      const response = await fetch(`${BASE_URL}update-pickup-date/${pickupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          userid: userId,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pickupDate: newDate }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      getAllPickups(); // Refresh the list after updating
      setSelectedPickup(null)
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  useEffect(() => {
    setCurrentPage(1); // reset pagination on filter/search change
  }, [searchProductByID, selectedPickupFilter]);

  useEffect(() => {
    getAllPickups();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pickup Management</h2> 
      </div>

      <PickupStatus pickedUpCount={pickedUpCount} warehouseCount={warehouseCount} carrierCount={carrierCount} TotalPickups={TotalPickups} />

      <div className="flex flex-row">
        <div className="mb-6 relative md:w-1/2 mr-2">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search by Product ID"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchProductByID}
            onChange={(e) => setSearchProductByID(e.target.value)}
          />
        </div>

        <div className="mb-6 relative md:w-1/2">
          <select
            value={selectedPickupFilter}
            onChange={(e) => setSelectedPickupFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-500"
          >
            <option value="">ALL</option>
            {[
              { value: "Pickup Requested", key: "Pickup Requested" },
              { value: "Picked Up", key: "Picked Up" },
              { value: "Inspected", key: "Inspected" },
              { value: "In Transit", key: "In Transit" },
              { value: "Completed", key: "Completed" },
              { value: "Pickup Cancelled", key: "Pickup Cancelled" },
              { value: "Delivered", key: "Delivered" },
            ].map((slot) => (
              <option key={slot.key} value={slot.value}>
                {slot.value}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Pickup ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Pickup Requested</th>
              <th className="px-4 py-3">Pickup Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPickups.map((pickup) => {
              const addressObj = pickup.pickupAddress || {};
              const fullAddress = ` ${addressObj.city || ""}, ${addressObj.state || ""}, ${addressObj.postalCode || ""
                }`;

              return (
                <tr key={pickup._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-5 font-medium" onClick={() => setSelectedPickup(pickup)}>
                    {pickup.PickupName}
                  </td>
                  <td className="px-4 py-5">{pickup.userId?.name || "N/A"}</td>
                  <td className="px-4 py-5">{pickup.bundleId.length}</td>
                  <td className="px-4 py-5">{formatDate(pickup.createdAt) || "N/A"}</td>
                  <td className="px-4 py-5">{formatDate(pickup.pickupDate)}</td>
                  <td className="px-4 py-5">{pickup.pickupTime}</td>
                  <td className="px-4 py-5">{fullAddress}</td>
                  <td className="px-4 py-5">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${statusColor[pickup.status?.toLowerCase()] ||
                        "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {pickup.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {pickups.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 py-6">
                  No pickup requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {selectedPickup && (
          <PickupModal
            pickup={selectedPickup}
            onClose={() => setSelectedPickup(null)}
            formatDate={formatDate}
            formatDateTime={formatDateTime}
            onUpdateStatus={updateStatus}
            onUpdateCarrier={addTrackingCarrier}
            onAddExtraCharges={AddExtraCharges}
            onUpdateDate={onUpdateDate}
            onAddLabelIssue={AddLabelIssue}
          />
        )}

        {/* Pagination */}
        <PickupPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
}