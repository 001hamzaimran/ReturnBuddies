import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiSettings } from 'react-icons/fi';
import { HiBell } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../../hook/useAuth';

export default function AdminNav({sidebarOpen,setSidebarOpen}) {
    const navigate=useNavigate()
    const {logout}=useAuth()
    
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

  const handleLogout=()=>{
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
        <button className="relative text-gray-500 hover:text-gray-700">
          <HiBell size={23} color='#000000'/>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(prev => !prev)} 
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img 
              className="h-8 w-8 rounded-full" 
              src="https://i.pravatar.cc/100?img=5" 
              alt="User" 
            />
            <span className="text-sm font-medium text-gray-700">Tom Cook</span>
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
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>Sign out</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
