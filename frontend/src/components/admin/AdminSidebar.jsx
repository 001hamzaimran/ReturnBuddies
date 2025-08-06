import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTruck,
  FaUsers,
  FaMoneyBillWave,
  FaWarehouse,
  FaTimes,
  FaDollarSign,
  FaQuestionCircle,
  FaCogs,
  FaMountain
} from 'react-icons/fa';
import Logo from '../../assets/Images/logo.png';

export default function AdminSidebar({ onClose }) {
  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-md space-x-2 ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300'
    }`;


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
          <NavLink to="/admin/dashboard" end className={navLinkClass}>
            <FaMountain />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/dashboard/users" className={navLinkClass}>
            <FaUsers />
            <span>Users</span>
          </NavLink>

          <NavLink to="/admin/dashboard/Promo-code" className={navLinkClass}>
            <FaDollarSign />
            <span>Promo Code</span>
          </NavLink>

          <NavLink to="/admin/dashboard/Pickup-Management" className={navLinkClass}>
            <FaTruck />
            <span>Pickup Management</span>
          </NavLink>

          <NavLink to="/admin/dashboard/Warehouse-Management" className={navLinkClass}>
            <FaWarehouse />
            <span>Warehouse Management</span>
          </NavLink>

          <NavLink to="/admin/dashboard/Payment-Management" className={navLinkClass}>
            <FaMoneyBillWave />
            <span>Payment Management</span>
          </NavLink>

          <NavLink to="/admin/dashboard/FAQ" className={navLinkClass}>
            <FaQuestionCircle />
            <span>FAQ</span>
          </NavLink>

          <NavLink to="/admin/dashboard/Settings" className={navLinkClass}>
            <FaCogs />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* Bottom Settings Link */}
      <div className="p-4">
        <a href="#" className="flex items-center text-sm text-gray-400 hover:text-white">
          ⚙️ <span className="ml-2">Settings</span>
        </a>
      </div>
    </aside>
  );
}
