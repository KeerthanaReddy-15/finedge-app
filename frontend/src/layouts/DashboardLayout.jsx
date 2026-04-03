import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#070709] font-sans">
      <Sidebar />
      <div className="flex-1 w-full relative overflow-y-auto max-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
