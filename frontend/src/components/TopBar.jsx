import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Settings, User } from 'lucide-react';

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('finedgeToken');
    navigate('/login');
  };

  const getTitle = (path) => {
    switch (path) {
      case '/dashboard':
        return 'Overview';
      case '/wallet':
        return 'My Wallet';
      case '/trading':
        return 'Crypto Exchange';
      case '/invest':
        return 'Stock Markets';
      case '/transactions':
        return 'Activity Ledger';
      case '/settings':
        return 'Preferences';
      default:
        return 'FinEdge';
    }
  };

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#070709]/80 backdrop-blur-xl border-b border-white/5 h-[64px] flex items-center shadow-lg">
      <div className="w-full max-w-[430px] mx-auto px-5 flex items-center justify-between">
        
        {/* Brand/Title */}
        <div className="flex flex-col">
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] leading-none mb-1">
            FinEdge
          </p>
          <h1 className="text-lg font-black text-white tracking-tight leading-none">
            {getTitle(location.pathname)}
          </h1>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all"
          >
            <User className="w-5 h-5 text-gray-400" />
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all hover:bg-red-500/10 hover:border-red-500/20"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-400" />
          </button>

          <div className="relative group">
            <button className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#070709] animate-pulse"></div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default TopBar;
