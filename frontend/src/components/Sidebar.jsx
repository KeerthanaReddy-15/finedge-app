import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, PieChart, Wallet, ArrowRightLeft, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Trade', path: '/trading', icon: TrendingUp },
    { name: 'Invest', path: '/invest', icon: PieChart },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('finedgeToken');
    navigate('/');
  };

  return (
    <div className="w-[300px] bg-[#111116] border-r border-[#1a1b22] h-screen sticky top-0 flex flex-col py-10 z-50 shadow-2xl shrink-0">
      <NavLink to="/" className="flex items-center gap-3 mb-12 px-10 hover:opacity-80 transition-opacity cursor-pointer text-decoration-none">
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span className="font-extrabold text-2xl tracking-tight text-white">FinEdge</span>
      </NavLink>

      <nav className="flex flex-col gap-3 px-6 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-[#a855f7] text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 mt-auto mb-4">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-4 px-6 py-5 w-full rounded-2xl text-lg font-black tracking-wider uppercase text-gray-400 border border-white/5 bg-[#1A1A24] hover:text-white hover:bg-red-600 hover:border-red-500 hover:shadow-[0_10px_30px_rgba(220,38,38,0.4)] transition-all duration-500 group"
        >
          <LogOut className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
