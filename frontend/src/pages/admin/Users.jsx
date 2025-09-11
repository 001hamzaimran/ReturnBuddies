import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

export default function Users() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
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
      const formattedUsers = data.data.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        pickupCount: user.pickupCount || 0,
        address: user.pickupAddress?.city || "N/A",
        state: user.pickupAddress?.state || " ",
        postalCode: user.pickupAddress?.postalCode || " ",
        image: user.profile,
        phone: user.phone || "N/A",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
        User Management
      </h1>

      {/* Search Bar */}
      <div className="mb-8 relative w-full md:w-1/2">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 
                     shadow-sm transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* User List */}
      {loading ? (
        <p className="text-gray-600 animate-pulse">Loading users...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center 
                           gap-3 cursor-pointer hover:shadow-lg hover:-translate-y-1 
                           transition-all duration-300"
                onClick={() => setSelectedUser(user)}
              >
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-purple-500"
                />
                <h2 className="font-semibold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                  Pickups: {user.pickupCount}
                </span>
                <p className="text-xs text-gray-400">
                  {user.address}, {user.state}, {user.postalCode}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No users found.
            </p>
          )}
        </div>
      )}

      {/* User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative 
                       transform transition-all duration-300 scale-95 opacity-0 animate-fadeInUp"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600 text-2xl"
            >
              &times;
            </button>

            {/* User Info */}
            <div className="flex items-center gap-6 mb-8">
              <img
                src={selectedUser.image}
                alt={selectedUser.name}
                className="w-20 h-20 rounded-full border-2 border-purple-500"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedUser.name}
                </h2>
                <p className="text-gray-600">{selectedUser.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  📍 {selectedUser.address}, {selectedUser.state}
                </p>
                <p className="text-sm text-gray-500">
                  📮 {selectedUser.postalCode}
                </p>
                <p className="text-sm text-gray-500">
                  📦 Pickups: {selectedUser.pickupCount}
                </p>
                <p className="text-sm text-gray-500">
                  📞 {selectedUser.phone}
                </p>
              </div>
            </div>


          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
