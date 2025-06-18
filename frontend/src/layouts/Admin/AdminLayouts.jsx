import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import UserNav from '../../components/users/Navbar/UserNav';
import { FiMenu } from 'react-icons/fi';
import useAuth from '../../hook/useAuth';
import AdminNav from '../../components/admin/AdminNav';

export default function AdminLayouts() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = true; // Set to false to test redirect
  const {user }=useAuth()
  
  useEffect(() => {
    if ( !user || user && user.user.role !='admin') {
      navigate('/admin/dashboard/login');
    }
  }, [user, navigate]);
// if (loading) return <div className="p-10 text-center">Loading...</div>; 
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (mobile & desktop) */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
          <AdminNav setSidebarOpen={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
