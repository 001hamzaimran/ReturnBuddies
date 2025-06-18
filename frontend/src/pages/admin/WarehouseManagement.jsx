import React from 'react';
import { FiFileText, FiPrinter, FiEye } from 'react-icons/fi';

export default function WarehouseManagement() {
  const labels = [
    { id: 1, customer: 'Sarah Jones', file: 'label_sarah.pdf', date: 'May 15, 2025' },
    { id: 2, customer: 'James Miller', file: 'label_james.pdf', date: 'May 15, 2025' },
    { id: 3, customer: 'Olivia Brown', file: 'label_olivia.pdf', date: 'May 14, 2025' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Warehouse Management</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Shipping Labels Uploaded by Customers</h2>

        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Label File</th>
              <th className="px-4 py-2">Date Uploaded</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label) => (
              <tr key={label.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-2 font-medium">{label.customer}</td>
                <td className="px-4 py-2 flex items-center space-x-2">
                  <FiFileText className="text-purple-500" />
                  <span>{label.file}</span>
                </td>
                <td className="px-4 py-2">{label.date}</td>
                <td className="px-4 py-2 space-x-3">
                  <button className="text-blue-600 hover:underline flex items-center space-x-1">
                    <FiEye />
                    <span>View</span>
                  </button>
                  <button className="text-purple-600 hover:underline flex items-center space-x-1">
                    <FiPrinter />
                    <span>Print</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {labels.length === 0 && (
          <div className="text-center py-10 text-gray-400">No labels uploaded yet.</div>
        )}
      </div>
    </div>
  );
}
