import { useEffect, useRef, useState } from "react";
import { FaTruck, FaClipboardCheck, FaMoneyBillWave, FaTruckLoading } from "react-icons/fa";

export default function Dashboard() {
  const [recentUsers, setRecentUsers] = useState([]);
  const [completedPickupsCount, setCompletedPickupsCount] = useState(0);
  const [ActivePickupsCount, setActivePickupsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const intervalRef = useRef(null);


  const GetPayment = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}get-All-Payment`);
      const data = await response.json();
      setTransactions(data.payments || []);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };

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

      // ✅ Set data to state
      const formattedUsers = data.data.map((user, index) => ({
        id: index + 1,
        name: user.name,
        email: user.email,
        image: user.profile,
        phone: user.phone,
      }));


      setRecentUsers(formattedUsers); // ⬅️ This triggers re-render
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletedPickupsCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BASE_URL}get-pickup-completed`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const {data} = await response.json();
      setCompletedPickupsCount(data.completedPickups);
      setActivePickupsCount(data.notCompletedPickups);
    } catch (error) {
      console.error("Fetch error:", error);
      return 0;
    }
  };

  useEffect(() => {
    GetPayment();
    getUser();
    getCompletedPickupsCount(); // initial fetch

  }, []);

  useEffect(() => {
    setTotalRevenue(transactions.reduce((sum, t) => sum + t.amount, 0));
  }, [transactions]);


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <DashboardCard
          title="Total Pickups Completed"
          value={completedPickupsCount}
          icon={<FaClipboardCheck className="text-green-500 text-3xl" />}
          bg="bg-green-100"
        />
        <DashboardCard
          title="Active Pickups"
          value={ActivePickupsCount}
          icon={<FaTruck className="text-blue-500 text-3xl" />}
          bg="bg-blue-100"
        />
        <DashboardCard
          title="Revenue Generated"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={<FaMoneyBillWave className="text-yellow-500 text-3xl" />}
          bg="bg-yellow-100"
        />
      </div>

      {/* Recent Users Table */}
      {loading ? <div className="text-blue-500 text-3xl animate-spin" /> :
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-600 border-b">
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-100 cursor-pointer transition"
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
                    <td className="p-3 text-gray-700">{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }

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
