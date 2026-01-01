import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function PromoCode() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [promos, setPromos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const promosPerPage = 5;

  const Bearer = `Bearer ${localStorage.getItem("token")}`;

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
    setLoadingUsers(false);
  };

  const handleAddPromo = async () => {
    const userId = activeTab === "all" ? "all" : selectedUserId;
    if (discount <= 0 || discount > 100) {
      toast.error("Discount should be greater than 0 and less than 100");
      return;
    }
    if (
      !promoCode ||
      !discount ||
      (activeTab === "single" && !selectedUserId)
    ) {
      toast.error("Please fill in all fields");

      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}add-Promo`,
        {
          userId,
          Name: "Promo", // Or let user input this too
          PromoCode: promoCode,
          Discount: discount,
          status: true,
        },
        {
          headers: {
            Authorization: Bearer,
          },
        }
      );

      if (response.data.success) {
        toast.success("Promo code added successfully");
        getAllPromo();
        setIsModalOpen(false);
        setPromoCode("");
        setDiscount("");
        setSelectedUserId("");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add promo");
    }
  };

  const getAllPromo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}get-all-Promo`,
        {
          headers: {
            Authorization: Bearer,
          },
        }
      );
      setPromos(response.data.data);
    } catch (error) {
      console.error("Failed to load promos:", error);
    }
  };

  const deletePromo = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}delete-Promo/${id}`,
        {
          headers: {
            Authorization: Bearer,
          },
        }
      );

      if (response.data.success) {
        toast.success("Promo code deleted successfully");
        getAllPromo();
      } else {
        toast.error(response.data.message);
      }
      console.log(response.data.data);
    } catch (error) {
      console.error("Failed to load promos:", error);
    }
  };

  useEffect(() => {
    getAllPromo();
  }, []);

  // Fetch users on modal open or tab change to 'single'
  useEffect(() => {
    if (isModalOpen && activeTab === "single") {
      fetchUsers();
    }
  }, [isModalOpen, activeTab]);

  const filteredPromos = promos.filter((promo) =>
    promo.PromoCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPromo = currentPage * promosPerPage;
  const indexOfFirstPromo = indexOfLastPromo - promosPerPage;
  const currentPromos = filteredPromos.slice(
    indexOfFirstPromo,
    indexOfLastPromo
  );
  const totalPages = Math.ceil(filteredPromos.length / promosPerPage);
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        Promo Codes
      </h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-purple-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-purple-700 text-sm sm:text-base"
      >
        + Add Promo Code
      </button>

      {/* table */}
      <div className="overflow-x-auto mt-4 bg-white rounded-lg shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-3 sm:p-4">Promo Code</th>
              <th className="p-3 sm:p-4">Discount (%)</th>
              <th className="p-3 sm:p-4">User</th>
              <th className="p-3 sm:p-4">Created At</th>
              <th className="p-3 sm:p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPromos.map((promo) => (
              <tr key={promo._id} className="border-t hover:bg-gray-100">
                <td className="p-3 sm:p-5 font-medium text-gray-800">
                  {promo.PromoCode}
                </td>
                <td className="p-3 sm:p-5">{promo.Discount}%</td>
                <td className="p-3 sm:p-5">{promo.userId}</td>
                <td className="p-3 sm:p-5">
                  {new Date(promo.createdAt).toLocaleString()}
                </td>
                <td className="p-3 sm:p-5 flex flex-wrap gap-2">
                  <button className="bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => deletePromo(promo._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center sm:justify-end mt-4 flex-wrap gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === index + 1
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-screen-sm sm:max-w-lg p-4 sm:p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              Add Promo Code
            </h2>

            {/* Tabs */}
            <div className="flex border-b mb-4 text-sm">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-2 sm:px-4 font-medium ${
                  activeTab === "all"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-purple-600"
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setActiveTab("single")}
                className={`ml-2 sm:ml-4 px-3 py-2 sm:px-4 font-medium ${
                  activeTab === "single"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-purple-600"
                }`}
              >
                Single User
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-4 text-sm">
              {activeTab === "single" && (
                <div>
                  <label className="block font-medium text-gray-700">
                    Select User
                  </label>
                  {loadingUsers ? (
                    <p className="text-sm text-gray-500">Loading users...</p>
                  ) : (
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full border px-4 py-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">-- Select a User --</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label className="block font-medium text-gray-700">
                  Promo Code
                </label>
                <input
                  type="text"
                  placeholder="SUMMER2025"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full border px-4 py-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Discount %
                </label>
                <input
                  type="number"
                  placeholder="10"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full border px-4 py-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              onClick={handleAddPromo}
              className="bg-purple-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-purple-700 w-full sm:w-auto"
            >
              {activeTab === "all"
                ? "Add Promo for All Users"
                : "Add Promo for Single User"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
