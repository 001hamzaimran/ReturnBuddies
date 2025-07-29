import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

export default function Users() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]); // ✅ state to store users
  const [loading, setLoading] = useState(true);

  // 🔻 Fetch users on mount
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BASE_URL}admin/dashboard`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Fetched Users:", data);

      const formattedUsers = data.data.map((user, index) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.pickupAddress.suite || "N/A", // fallback
        state: user.pickupAddress.state || "N/A", // fallback
        postalCode: user.pickupAddress.postalCode || "N/A", // fallback
        image: user.profile,
        phone: user.phone,
        history: [], // optionally fill with history later
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.name + user.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : (
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
      )}

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

            {/* User Info */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedUser.image}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedUser.name}</h2>
                <p className="text-gray-600">{selectedUser.email}</p>
                <p className="text-sm text-gray-500">
                  {selectedUser.address}{selectedUser.state ? `, ${selectedUser.state}` : ""}
                </p>
                <p className="text-sm text-gray-500">{selectedUser.postalCode || ""}</p>
                <p className="text-sm text-gray-500">Phone: {selectedUser.phone || "N/A"}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-4">
              <button
                onClick={() => {
                  window.location.href = `/pickups/${selectedUser.id}`;
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                View Pickups
              </button>

              <button
                onClick={() => {
                  window.location.href = `/promocode/${selectedUser.id}`;
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Promo Code
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
