import React from 'react';
import { useEffect } from 'react';
import { FaMoneyCheckAlt, FaEdit } from 'react-icons/fa';

export default function PaymentManagement() {
  const userId = JSON.parse(localStorage.getItem("user")).user._id;

  const transactions = [
    {
      id: 'TXN001',
      user: 'Alice Johnson',
      email: 'alice@example.com',
      amount: '$25.00',
      status: 'Paid',
    },
    {
      id: 'TXN002',
      user: 'Bob Smith',
      email: 'bob@example.com',
      amount: '$40.00',
      status: 'Pending',
    },
  ];

  useEffect(() => {
    console.log('User ID:', userId);

  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 flex items-center space-x-2">
        <FaMoneyCheckAlt className="text-green-600" />
        <span>Payment Management</span>
      </h1>

      {/* Transaction Overview */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Transaction Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left bg-gray-100">
              <tr>
                <th className="p-2">Transaction ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Email</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2">{txn.id}</td>
                  <td className="p-2">{txn.user}</td>
                  <td className="p-2">{txn.email}</td>
                  <td className="p-2">{txn.amount}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${txn.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <button className="flex items-center space-x-1 text-blue-600 hover:underline text-sm">
                      <FaEdit />
                      <span>Edit Price</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note for warehouse adjustments */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
        <strong>Note:</strong> If an item is overweight, you can edit the price and charge the customer once it reaches the warehouse.
      </div>
    </div>
  );
}
