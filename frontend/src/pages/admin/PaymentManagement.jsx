import React, { useState, useEffect } from "react";
import { FaMoneyCheckAlt, FaSearch } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function PaymentManagement() {
  const userId = JSON.parse(localStorage.getItem("user")).user._id;
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const GetPayment = async () => {
    try {
      const response = await fetch(`${baseUrl}get-All-Payment`);
      const data = await response.json();
      setTransactions(data.payments || []);
      setFilteredTransactions(data.payments || []);
      console.log("Payments:", data.payments);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };

  useEffect(() => {
    console.log("User ID:", userId);
    GetPayment();
  }, []);

  // Handle search filter
  useEffect(() => {
    const results = transactions.filter(
      (txn) =>
        txn.id?.toLowerCase().includes(search.toLowerCase()) ||
        txn.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        txn.user?.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTransactions(results);
    setCurrentPage(1); // reset to page 1 on new search
  }, [search, transactions]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Group payments by date and sum amounts
  const groupedByDate = transactions.reduce((acc, txn) => {
    const date = new Date(txn.created).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += txn.amount; // sum amounts for the same date
    return acc;
  }, {});

  // Convert grouped object to array for recharts
  const lineData = Object.keys(groupedByDate).map(date => ({
    date,
    amount: groupedByDate[date],
  }));


  const statusData = [
    {
      name: "Succeeded",
      value: transactions.filter((t) => t.status === "succeeded").length,
    },
    {
      name: "Pending",
      value: transactions.filter((t) => t.status === "pending").length,
    },
    {
      name: "Failed",
      value: transactions.filter((t) => t.status !== "succeeded" && t.status !== "pending").length,
    },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 flex items-center space-x-2">
        <FaMoneyCheckAlt className="text-green-600" />
        <span>Payment Management</span>
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex items-center bg-white p-3 rounded-lg shadow-md">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search by Transaction ID, User or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none bg-transparent"
        />
      </div>


      {/* Transaction Table */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Transaction Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left bg-gray-100">
              <tr>
                <th className="p-2">Transaction ID</th>
                <th className="p-2">Pickup ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Email</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map((txn, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{txn.id}</td>
                    <td className="p-2">{txn.metadata?.pickupId || "N/A"}</td>
                    <td className="p-2">{txn.user?.name}</td>
                    <td className="p-2">{txn.user?.email}</td>
                    <td className="p-2">${txn.amount}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${txn.status === "succeeded"
                          ? "bg-green-100 text-green-700"
                          : txn.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {txn.status === "succeeded" ? "Paid" : txn.status}
                      </span>
                    </td>
                    <td className="p-2">
                      {new Date(txn.created).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Daily Payments</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Payment Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
