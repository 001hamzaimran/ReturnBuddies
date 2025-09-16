import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiSettings } from 'react-icons/fi';
import { HiBell } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../../hook/useAuth';

export default function AdminNav({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pickups, setPickups] = useState([]);
  const notificationRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"))
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user"))?.user?._id;


  const getAllPickups = async () => {
    try {
      const response = await fetch(`${BASE_URL}get-all-pickup`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userid: userId,
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setPickups(data.data); // store pickups here
    } catch (error) {
      console.error("Error fetching pickups:", error);
    }
  };

  const unreadPickups = pickups.filter(p => !p.isRead);


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = async (id) => {
    await fetch(`${BASE_URL}mark-pickup-read/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    getAllPickups();
  };

  useEffect(() => {
    getAllPickups()
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/admin/dashboard/login")

  }

  return (
    <header className="flex items-center justify-between px-6 py-3 bg shadow">
      <div className="flex-1 flex justify-left items-center space-x-2">
        {/* <CiSearch size={24} color='#000000'/> */}
        <div className="w-full max-w-md">
          <button onClick={setSidebarOpen} className="md:hidden lg:hidden xl:hidden text-2xl text-gray-700">
            <FiMenu />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationsOpen(prev => !prev)}
            className="relative"
          >
            <HiBell size={23} className="text-purple-800 hover:text-purple-900" />
            {unreadPickups.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {unreadPickups.length}
              </span>
            )}

          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="flex justify-between items-center px-4 py-2 border-b">
                <span className="font-semibold text-gray-800">Notifications</span>
                {/* <span className="text-xs text-gray-500">{unreadPickups.length} new</span> */}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {unreadPickups.length > 0 ? (
                  unreadPickups.map(pickup => (
                    <div
                      key={pickup?._id}
                      onClick={() => markAsRead(pickup?._id)}
                      className="px-4 py-3 cursor-pointer border-b hover:bg-gray-100 bg-purple-50"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{pickup?.PickupName}</span>
                        <span className="text-xs text-gray-500">{pickup?.userId?.name}</span>
                        <span className="text-xs text-gray-400">
                          {pickup?.pickupAddress?.city}, {pickup?.pickupAddress?.state}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-4 text-sm text-gray-500 text-center">No new notifications</div>
                )}

              </div>
              <Link to="/admin/dashboard/Pickup-Management">
                <div className="text-center px-4 py-2 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                  <span className="text-sm text-purple-600 font-medium">
                    View all pickups
                  </span>
                </div>
              </Link>

            </div>
          )}

        </div>


        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              className="h-8 w-8 rounded-full"
              src={user?.user?.profile}
              alt="User"
            />
            <span className="text-sm font-medium text-gray-700">{user?.user?.name}</span>
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
              {/* <Link to={"/admin/dashboard/profile"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your profile</Link> */}
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>Sign out</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
