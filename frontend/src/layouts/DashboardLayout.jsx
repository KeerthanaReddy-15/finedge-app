import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import TopBar from '../components/TopBar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#070709] font-sans">
      <TopBar />
      <Sidebar />
      {/* pt-[64px] on mobile for top bar, pb-[72px] for bottom nav, no padding on lg+ */}
      <div className="flex-1 w-full relative overflow-y-auto max-h-screen pt-[64px] pb-[72px] lg:pt-0 lg:pb-0">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
