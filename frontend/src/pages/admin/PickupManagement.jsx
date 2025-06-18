import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineEdit } from 'react-icons/ai';
import { FaTruck, FaWarehouse, FaShippingFast } from 'react-icons/fa';

export default function PickupManagement() {
  const [pickups] = useState([
    {
      id: 'RB-1234',
      name: 'Alex Smith',
      status: 'Picked Up',
      date: '2025-05-16',
      address: '118 Malibu Dr, NY',
    },
    {
      id: 'RB-1235',
      name: 'Jane Doe',
      status: 'At Warehouse',
      date: '2025-05-15',
      address: '44 Lincoln Ave, CA',
    },
    {
      id: 'RB-1236',
      name: 'John Parker',
      status: 'At Carrier',
      date: '2025-05-14',
      address: '22 Sunset Blvd, TX',
    },
  ]);

  const statusColor = {
    'Picked Up': 'bg-green-100 text-green-700',
    'At Warehouse': 'bg-yellow-100 text-yellow-700',
    'At Carrier': 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pickup Management</h2>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
          <AiOutlinePlus />
          Create Pickup
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-4">
          <FaTruck className="text-green-600 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">Picked Up</p>
            <p className="text-xl font-semibold">25</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-4">
          <FaWarehouse className="text-yellow-600 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">At Warehouse</p>
            <p className="text-xl font-semibold">13</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow flex items-center space-x-4">
          <FaShippingFast className="text-blue-600 text-2xl" />
          <div>
            <p className="text-sm text-gray-500">At Carrier</p>
            <p className="text-xl font-semibold">8</p>
          </div>
        </div>
      </div>

      {/* Pickup Requests Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">Pickup ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map((pickup) => (
              <tr key={pickup.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{pickup.id}</td>
                <td className="px-4 py-3">{pickup.name}</td>
                <td className="px-4 py-3">{pickup.date}</td>
                <td className="px-4 py-3">{pickup.address}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[pickup.status]}`}>{pickup.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-purple-600 hover:text-purple-800 flex items-center gap-1 text-sm">
                    <AiOutlineEdit /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
