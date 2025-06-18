import React from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaUsers, FaMoneyBillWave, FaWarehouse, FaTimes } from 'react-icons/fa';
import Logo from '../../assets/Images/logo.png';

export default function AdminSidebar({ onClose }) {
  return (
    <aside className="h-full bg-gray-900 text-white flex flex-col justify-between w-64">
      <div>
        {/* Header with Logo and Close Button (mobile) */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="h-10" />
            <span className="font-bold text-white">Admin</span>
          </div>
          {/* Close button only on mobile */}
          <button className="md:hidden text-white text-xl" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="mt-6 space-y-1 px-2">
          <Link to="/admin/dashboard" className="flex items-center px-4 py-2 bg-gray-800 rounded-md">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dashboard
          </Link>
          <Link to="/admin/dashboard/users" className="flex items-center px-4 py-2 hover:bg-gray-800 rounded-md space-x-2">
            <FaUsers />
            <span>Users</span>
          </Link>
          <Link to="/admin/dashboard/Pickup-Management" className="flex items-center px-4 py-2 hover:bg-gray-800 rounded-md space-x-2">
            <FaTruck />
            <span>Pickup Management</span>
          </Link>
          <Link to="/admin/dashboard/Warehouse-Management" className="flex items-center px-4 py-2 hover:bg-gray-800 rounded-md space-x-2">
            <FaWarehouse />
            <span>Warehouse Management</span>
          </Link>
          <Link to="/admin/dashboard/Payment-Management" className="flex items-center px-4 py-2 hover:bg-gray-800 rounded-md space-x-2">
            <FaMoneyBillWave />
            <span>Payment Management</span>
          </Link>
        </nav>
      </div>

      {/* Settings (bottom) */}
      <div className="p-4">
        <a href="#" className="flex items-center text-sm text-gray-400 hover:text-white">
          ⚙️ <span className="ml-2">Settings</span>
        </a>
      </div>
    </aside>
  );
}
