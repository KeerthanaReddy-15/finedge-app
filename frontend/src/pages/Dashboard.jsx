import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, ArrowRightLeft, Bell, ArrowDownLeft, Zap, ExternalLink, ShieldCheck } from 'lucide-react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const incomeExpenseData = [
  { name: 'Jan', income: 8400, expense: 2400 },
  { name: 'Feb', income: 9200, expense: 3100 },
  { name: 'Mar', income: 8800, expense: 2800 },
  { name: 'Apr', income: 11500, expense: 4500 },
  { name: 'May', income: 14200, expense: 4800 },
  { name: 'Jun', income: 15500, expense: 5200 },
  { name: 'Jul', income: 13100, expense: 6100 },
  { name: 'Aug', income: 16200, expense: 5800 },
  { name: 'Sep', income: 18500, expense: 6500 }
];

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [recentTxns, setRecentTxns] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('finedgeToken');

  useEffect(() => {
    if (!token) return;
    const fetchBalance = async () => {
      try {
        const res = await fetch(`${API_URL}/api/wallet/balance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setBalance(data.balance);
      } catch (err) { console.error("Failed to fetch balance", err); }
    };

    const fetchTxns = async () => {
      try {
        const res = await fetch(`${API_URL}/api/wallet/transactions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          const formatted = data.slice(0, 4).map(tx => {
            const dateObj = new Date(tx.createdAt);
            let isCredit = ['deposit', 'transfer_in', 'trade_sell', 'trade_stock_sell', 'trade_crypto_sell', 'escrow_claim'].includes(tx.type);
            return {
              name: tx.description,
              date: dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
              amount: `${isCredit ? '+' : '-'}$${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
              status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
              positive: isCredit,
              pending: tx.status === 'pending'
            };
          });
          setRecentTxns(formatted);
        }
      } catch (e) {}
    };

    fetchBalance();
    fetchTxns();
  }, [token]);

  return (
    <div className="min-h-screen text-white/90 bg-[#070709]">

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="lg:hidden">
        <div className="max-w-[430px] mx-auto px-4 py-5 space-y-4">

          {/* Notification indicator handled by TopBar */}

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl p-6 shadow-[0_8px_32px_rgba(168,85,247,0.35)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-4 h-4 text-purple-200" />
                <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest">Total Balance</p>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-5">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/wallet')}
                  className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/30 transition-all active:scale-95"
                >
                  <ArrowUpRight className="w-4 h-4" /> Send
                </button>
                <button
                  onClick={() => navigate('/wallet')}
                  className="flex-1 bg-white text-purple-700 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-50 transition-all active:scale-95"
                >
                  <ArrowDownLeft className="w-4 h-4" /> Receive
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Send', icon: ArrowUpRight, color: 'text-purple-400', bg: 'bg-purple-500/10', path: '/wallet' },
                { label: 'Receive', icon: ArrowDownLeft, color: 'text-blue-400', bg: 'bg-blue-500/10', path: '/wallet' },
                { label: 'Trade', icon: Zap, color: 'text-green-400', bg: 'bg-green-500/10', path: '/trading' },
              ].map(({ label, icon: Icon, color, bg, path }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="bg-[#111116] border border-white/8 rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-all hover:border-white/20 shadow-sm"
                >
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <span className="text-xs font-bold text-gray-300">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-[#0f0f13] border border-white/8 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-black text-white">Income vs Expense</h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-xs text-gray-500 font-medium">Income</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-xs text-gray-500 font-medium">Expense</span></div>
                </div>
              </div>
            </div>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={incomeExpenseData} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="mExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} dy={8} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f0f13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ fontWeight: 700 }}
                    labelStyle={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#22C55E" strokeWidth={2} fillOpacity={1} fill="url(#mIncome)" dot={false} />
                  <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#mExpense)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black text-white">Recent Activity</h3>
              <button onClick={() => navigate('/transactions')} className="text-purple-400 text-xs font-bold flex items-center gap-1">
                See all <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="bg-[#0f0f13] border border-white/8 rounded-2xl overflow-hidden shadow-sm">
              {recentTxns.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">No transactions yet.</div>
              ) : (
                recentTxns.map((tx, idx) => (
                  <div key={idx} className={`flex items-center justify-between px-4 py-3.5 ${idx < recentTxns.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.positive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        {tx.positive
                          ? <ArrowDownLeft className="w-4 h-4 text-green-400" />
                          : <ArrowUpRight className="w-4 h-4 text-red-400" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-tight truncate max-w-[150px]">{tx.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${tx.positive ? 'text-green-400' : 'text-white'}`}>{tx.amount}</p>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${tx.pending ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ─── DESKTOP LAYOUT (unchanged) ─── */}
      <div className="hidden lg:block p-10 min-h-screen pb-24 space-y-10 relative overflow-hidden">

        <div className="relative mb-6">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="flex flex-col gap-4 relative z-10">
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent drop-shadow-2xl mb-2">
                Dashboard.
              </h1>
              <p className="text-xl text-gray-400 font-medium tracking-wide">Your centralized financial command center.</p>
            </div>
            <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 px-8 shadow-2xl flex items-center gap-8 w-fit">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 shrink-0">
                <Wallet className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-0.5">Live Balance</p>
                <h2 className="text-3xl font-black text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 relative z-10">
          {[
            { title: 'Send Funds', desc: 'Transfer money instantly.', icon: ArrowUpRight, color: 'text-purple-400', bg: 'bg-purple-500/10', path: '/wallet' },
            { title: 'Receive Funds', desc: 'Generate QR for payments.', icon: ArrowDownLeft, color: 'text-blue-400', bg: 'bg-blue-500/10', path: '/wallet' },
            { title: 'Trade Markets', desc: 'Execute crypto & stock orders.', icon: Zap, color: 'text-green-400', bg: 'bg-green-500/10', path: '/trading' },
          ].map(({ title, desc, icon: Icon, color, bg, path }) => (
            <div key={title} onClick={() => navigate(path)} className={`bg-[#0D0D0E] border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-white/10 cursor-pointer group flex flex-col justify-between`}>
              <div className={`w-14 h-14 rounded-[1.5rem] ${bg} border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner mb-6`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <div>
                <h3 className="text-white text-xl font-black mb-1">{title}</h3>
                <p className="text-gray-400 font-medium text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 min-h-[450px] relative z-10">
          <div className="xl:col-span-2 bg-[#0D0D0E] border border-white/5 rounded-[3rem] p-10 flex flex-col relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-white">Income vs Expense</h2>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-gray-400 font-bold text-sm">Income</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-gray-400 font-bold text-sm">Expense</span></div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={incomeExpenseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} /><stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#ffffff0a" vertical={false} />
                  <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 'bold' }} tickLine={false} axisLine={false} dy={12} />
                  <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 'bold' }} tickLine={false} axisLine={false} dx={-12} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px 16px' }}
                    itemStyle={{ fontWeight: 900, fontSize: '1.2rem' }}
                    labelStyle={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '6px' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#22C55E" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" activeDot={{ r: 6, fill: '#fff', stroke: '#22C55E', strokeWidth: 3 }} />
                  <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={4} fillOpacity={1} fill="url(#colorExpense)" activeDot={{ r: 6, fill: '#fff', stroke: '#EF4444', strokeWidth: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0D0D0E] border border-white/5 rounded-[3rem] p-8 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white">Notifications</h2>
              <div className="relative">
                <Bell className="w-7 h-7 text-gray-400" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0D0D0E]"></div>
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {[
                { title: 'Security Alert', message: 'New login detected from Mac OS.', time: 'Just now', icon: ShieldCheck, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                { title: 'Market Executed', message: 'Bought 1.405 BTC at $66,854.', time: '12 mins ago', icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10' },
                { title: 'Funds Received', message: 'You received $1,250 from @sarah.', time: '2 hours ago', icon: ArrowDownLeft, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { title: 'Auto-Invest', message: 'Monthly S&P 500 trigger successful.', time: '1 day ago', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              ].map((n, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className={`w-10 h-10 rounded-[0.75rem] ${n.bg} flex items-center justify-center shrink-0`}>
                    <n.icon className={`w-5 h-5 ${n.color}`} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{n.title}</h4>
                    <p className="text-gray-400 text-xs mt-0.5">{n.message}</p>
                    <span className="text-[10px] font-bold text-gray-600 mt-1 block uppercase tracking-widest">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-white/5 py-3 rounded-2xl font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-xs text-gray-300">Mark All as Read</button>
          </div>
        </div>

        <div className="bg-[#0D0D0E] border border-white/5 rounded-[3rem] p-8 relative overflow-hidden shadow-2xl z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white">Recent Transactions</h2>
            <button onClick={() => navigate('/transactions')} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold transition-colors group">
              Full History <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <th className="py-4 px-4 rounded-tl-2xl">Date</th>
                  <th className="py-4 px-4">Description</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4 text-right rounded-tr-2xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentTxns.length === 0 ? (
                  <tr><td colSpan="4" className="py-8 text-center text-gray-500 text-sm">No recent transactions.</td></tr>
                ) : recentTxns.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-4 px-4 text-gray-400 whitespace-nowrap text-sm">{tx.date}</td>
                    <td className="py-4 px-4 font-bold text-white group-hover:text-blue-400 transition-colors text-sm">{tx.name}</td>
                    <td className={`py-4 px-4 font-black text-sm ${tx.positive ? 'text-green-400' : 'text-white'}`}>{tx.amount}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${tx.pending ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
