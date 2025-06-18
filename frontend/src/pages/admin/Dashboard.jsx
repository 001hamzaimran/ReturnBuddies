import { useEffect, useState } from "react";
import { FaTruck, FaClipboardCheck, FaMoneyBillWave } from "react-icons/fa";

export default function Dashboard() {
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    getUser();
    const url = `${import.meta.env.VITE_BASE_URL}admin/dashboard`;
    console.log("Requesting URL:", url);
  }, []);

  const getUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const url = `${import.meta.env.VITE_BASE_URL}admin/dashboard`;
      console.log("Fetching:", url);
      console.log("Token being sent:", token);
      console.log(`Authorization: Bearer ${token}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);

      // ✅ Set data to state
      const formattedUsers = data.data.map((user, index) => ({
        id: index + 1,
        name: user.name,
        email: user.email,
        image: user.profile,
      }));

      setRecentUsers(formattedUsers); // ⬅️ This triggers re-render
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <DashboardCard
          title="Total Pickups Completed"
          value="1,284"
          icon={<FaClipboardCheck className="text-green-500 text-3xl" />}
          bg="bg-green-100"
        />
        <DashboardCard
          title="Active Pickups"
          value="74"
          icon={<FaTruck className="text-blue-500 text-3xl" />}
          bg="bg-blue-100"
        />
        <DashboardCard
          title="Pending Payments"
          value="$2,190"
          icon={<FaMoneyBillWave className="text-yellow-500 text-3xl" />}
          bg="bg-yellow-100"
        />
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-600 border-b">
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-100 cursor-pointer transition"
                  onClick={() => alert(`Clicked on ${user.name}`)}
                >
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium text-gray-800">{user.name}</span>
                  </td>
                  <td className="p-3 text-gray-700">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, bg }) {
  return (
    <div className={`rounded-xl shadow-md p-5 flex items-center ${bg}`}>
      <div className="mr-4">{icon}</div>
      <div>
        <h3 className="text-sm text-gray-700 font-semibold">{title}</h3>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
