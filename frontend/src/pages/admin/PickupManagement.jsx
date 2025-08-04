import React, { useEffect, useState } from 'react';
import { FaTruck, FaWarehouse, FaShippingFast } from 'react-icons/fa';

export default function PickupManagement() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user")).user._id;
  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [pickups, setPickups] = useState([]);

  const [pickedUpCount, setPickedUpCount] = useState(0);
  const [warehouseCount, setWarehouseCount] = useState(0);
  const [carrierCount, setCarrierCount] = useState(0);

  const totalPages = Math.ceil(pickups.length / itemsPerPage);
  const paginatedPickups = pickups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getAllPickups = async () => {
    try {
      const response = await fetch(`${BASE_URL}get-all-pickup`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'userid': userId,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setPickups(data.data);
      setCurrentPage(1);
      calculateCounts(data.data);
    } catch (error) {
      console.error('Error fetching pickups:', error);
    }
  };

  const calculateCounts = (pickupList) => {
    let picked = 0;
    let warehouse = 0;
    let carrier = 0;

    pickupList.forEach(pickup => {
      const status = pickup.status?.toLowerCase();
      if (status === 'picked up') picked++;
      else if (['delivered', 'inspected'].includes(status)) warehouse++;
      else if (['in transit', 'completed'].includes(status)) carrier++;
    });

    setPickedUpCount(picked);
    setWarehouseCount(warehouse);
    setCarrierCount(carrier);
  };

  const statusColor = {
    'pickup requested': 'bg-purple-100 text-purple-700',
    'picked up': 'bg-green-100 text-green-700',
    'inspected': 'bg-yellow-100 text-yellow-700',
    'completed': 'bg-green-200 text-green-800',
    'pickup cancelled': 'bg-red-100 text-red-700',
    'in transit': 'bg-blue-100 text-blue-700',
    'delivered': 'bg-teal-100 text-teal-700',
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    getAllPickups();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pickup Management</h2>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-4">
          <FaTruck className="text-green-600 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Picked Up</p>
            <p className="text-xl font-semibold">{pickedUpCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-4">
          <FaWarehouse className="text-yellow-600 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">At Warehouse</p>
            <p className="text-xl font-semibold">{warehouseCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-4">
          <FaShippingFast className="text-blue-600 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">At Carrier</p>
            <p className="text-xl font-semibold">{carrierCount}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Pickup ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPickups.map((pickup) => {
              const addressObj = pickup.pickupAddress || {};
              const fullAddress = `${addressObj.street || ''}, ${addressObj.suite || ''}, ${addressObj.city || ''}, ${addressObj.state || ''}, ${addressObj.postalCode || ''}`;

              return (
                <tr key={pickup._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-5 font-medium">{pickup._id.slice(0, 8)}</td>
                  <td className="px-4 py-5">{pickup.userId?.name || "N/A"}</td>
                  <td className="px-4 py-5">{formatDate(pickup.pickupDate)}</td>
                  <td className="px-4 py-5">{fullAddress}</td>
                  <td className="px-4 py-5">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[pickup.status?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
                      {pickup.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {pickups.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 py-6">No pickup requests found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 bg-white border-t">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
