import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
const mockUsers = [
  {
    id: 1,
    name: "Emily Johnson",
    email: "emily.j@example.com",
    address: "123 Main St, NY",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    history: [
      { date: "2024-05-12", status: "Completed", cost: "$15.00" },
      { date: "2024-04-30", status: "Canceled", cost: "$0.00" },
    ],
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.s@example.com",
    address: "456 Broadway, NY",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    history: [
      { date: "2024-05-15", status: "Completed", cost: "$10.00" },
    ],
  },
  {
    id: 3,
    name: "Samantha Lee",
    email: "samantha.lee@example.com",
    address: "789 Park Ave, NY",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    history: [
      { date: "2024-05-10", status: "Completed", cost: "$20.00" },
    ],
  },
  {
    id: 4,
    name: "Michael Brown",
    email: "michael.b@example.com",
    address: "321 Lexington St, NY",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    history: [
      { date: "2024-04-28", status: "Completed", cost: "$12.00" },
    ],
  },
];

export default function Users() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = mockUsers.filter((user) =>
    (user.name + user.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 ">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">User Management</h1>

      {/* Search Bar */}
  <div className="mb-6 relative w-full md:w-1/2">
  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
  <input
    type="text"
    placeholder="Search by name or email..."
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedUser(user)}
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No users found.</p>
        )}
      </div>

      {/* User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative animate-fade-in">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600 text-xl"
            >
              &times;
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedUser.image}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedUser.name}</h2>
                <p className="text-gray-600">{selectedUser.email}</p>
                <p className="text-sm text-gray-500">{selectedUser.address}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Pickup History</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="p-2">Date</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUser.history.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">{item.status}</td>
                      <td className="p-2">{item.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-red-600">
                Close Account
              </button>
              <button className="bg-gray-500 text-white px-4 cursor-pointer py-2 rounded-lg hover:bg-gray-600">
                Remove Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
