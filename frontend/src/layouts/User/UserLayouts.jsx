import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import UserSidebar from '../../components/users/SideBar/UserSidebar'
import UserNav from '../../components/users/Navbar/UserNav'
import useAuth from '../../hook/useAuth'

export default function UserLayouts() {
  const navigate=useNavigate()
  const isUser = false;

   const {user,loading }=useAuth()
  
  useEffect(() => {
    if (!loading && !user || user && user.user.role !='admin') {
      navigate('/admin/dashboard/login');
    }else {
      navigate('/admin/dashboard')
    }
  }, [user, loading, navigate]);
if (loading) return <div className="p-10 text-center">Loading...</div>; 

  return (
   <>
   <div className="flex h-screen overflow-hidden">
         <UserSidebar/>
          <div className="flex flex-col flex-1 overflow-hidden">
              
                 <UserNav/>
                  <main className="flex-1 overflow-y-auto p-6">
       <Outlet/>
         
        </main>
                 </div>
    

   </div>
   
   </>
  )
}
