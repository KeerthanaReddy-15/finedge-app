import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, PieChart, Wallet, ArrowRightLeft, Settings } from 'lucide-react';

const navItems = [
  { name: 'Home',    path: '/dashboard',     icon: LayoutDashboard },
  { name: 'Trade',   path: '/trading',       icon: TrendingUp },
  { name: 'Wallet',  path: '/wallet',        icon: Wallet },
  { name: 'Invest',  path: '/invest',        icon: PieChart },
  { name: 'History', path: '/transactions',  icon: ArrowRightLeft },
];

const BottomNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f12]/95 backdrop-blur-xl border-t border-white/8 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center px-1 py-1.5 max-w-[430px] mx-auto">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-purple-400' : 'text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-purple-500/20' : ''}`}>
                  <Icon className={`w-5 h-5 transition-all ${isActive ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}`} />
                </div>
                <span className={`text-[9px] font-bold tracking-wide ${isActive ? 'text-purple-400' : 'text-gray-600'}`}>
                  {name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
