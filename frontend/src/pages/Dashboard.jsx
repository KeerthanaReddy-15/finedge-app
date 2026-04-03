import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, ArrowRightLeft, Bell, ArrowDownLeft, Zap, ExternalLink, ShieldCheck } from 'lucide-react';
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

const ActionCard = ({ title, description, icon: Icon, colorClass, shadowClass, onClick }) => (
  <div onClick={onClick} className={`bg-[#0D0D0E] border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-white/10 ${shadowClass} cursor-pointer group flex flex-col justify-between`}>
    <div className={`w-16 h-16 rounded-[1.5rem] ${colorClass} bg-opacity-10 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner mb-6`}>
      <Icon className={`w-8 h-8 ${colorClass.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <h3 className="text-white text-2xl font-black mb-2">{title}</h3>
      <p className="text-gray-400 font-medium">{description}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [recentTxns, setRecentTxns] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('finedgeToken');

  useEffect(() => {
    if (!token) return;
    const fetchBalance = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wallet/balance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setBalance(data.balance);
      } catch (err) {
         console.error("Failed to fetch balance", err);
      }
    };

    const fetchTxns = async () => {
       try {
         const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wallet/transactions`, {
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
                  amount: `${isCredit ? '+' : '-'}$${tx.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
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
    <div className="p-6 md:p-12 min-h-screen text-white/90 pb-24 space-y-12 relative overflow-hidden">
      
      {/* Overview Header */}
      <div className="relative mb-8">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-6 relative z-10">
           <div>
             <h1 className="text-6xl md:text-[5rem] font-black tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent drop-shadow-2xl mb-4">
               Dashboard.
             </h1>
             <p className="text-xl md:text-2xl text-gray-400 font-medium tracking-wide">
                Your centralized financial command center.
             </p>
           </div>
           
           {/* Live Balance Mini-Dashboard */}
           <div className="bg-[#050505] border border-white/10 rounded-[2rem] p-6 px-10 shadow-2xl flex items-center gap-8">
             <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
               <Wallet className="w-8 h-8 text-blue-400" />
             </div>
             <div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-1">Live Balance</p>
                <h2 className="text-4xl font-black text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
             </div>
           </div>
        </div>
      </div>

      {/* Quick Actions Integration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <ActionCard 
           title="Send Funds" 
           description="Transfer money to network users instantly."
           icon={ArrowUpRight} 
           colorClass="bg-purple-500 text-purple-400" 
           shadowClass="hover:shadow-[0_15px_40px_rgba(168,85,247,0.15)]"
           onClick={() => navigate('/wallet')}
        />
        <ActionCard 
           title="Receive Funds" 
           description="Generate QR code for incoming payments."
           icon={ArrowDownLeft} 
           colorClass="bg-blue-500 text-blue-400" 
           shadowClass="hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)]"
           onClick={() => navigate('/wallet')}
        />
        <ActionCard 
           title="Trade Markets" 
           description="Execute crypto and stock orders via terminal."
           icon={Zap} 
           colorClass="bg-green-500 text-green-400" 
           shadowClass="hover:shadow-[0_15px_40px_rgba(34,197,94,0.15)]"
           onClick={() => navigate('/trade')}
        />
      </div>

      {/* EPIC Dual Income vs Expense Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 min-h-[550px] relative z-10">
        
        {/* Main Area Chart */}
        <div className="xl:col-span-2 bg-[#0D0D0E] border border-white/5 rounded-[3rem] p-10 flex flex-col relative overflow-hidden group hover:border-white/10 transition-colors shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] pointer-events-none rounded-full transition-colors duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/5 blur-[120px] pointer-events-none rounded-full transition-colors duration-1000"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 relative z-10 gap-6">
            <div>
              <h2 className="text-3xl font-black text-white">Income vs Expense</h2>
              <div className="flex items-center gap-6 mt-4">
                 <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-gray-400 font-bold">Income</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-gray-400 font-bold">Expense</span>
                 </div>
              </div>
            </div>
            <select className="bg-[#1A1A1C] border-2 border-white/5 text-white text-lg font-bold rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 shadow-inner cursor-pointer hover:bg-white/5 transition-colors appearance-none">
               <option>Year to Date</option>
               <option>Last 6 Months</option>
            </select>
          </div>
          
          <div className="flex-1 relative z-10 w-full mt-4 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeExpenseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#ffffff0a" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 14, fontWeight: 'bold'}} tickLine={false} axisLine={false} dy={15} />
                <YAxis stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 14, fontWeight: 'bold'}} tickLine={false} axisLine={false} dx={-15} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', padding: '16px 20px' }}
                  itemStyle={{ fontWeight: '900', fontSize: '1.4rem' }}
                  labelStyle={{ color: '#9CA3AF', fontSize: '1rem', marginBottom: '8px' }}
                />
                <Area type="monotone" dataKey="income" stroke="#22C55E" strokeWidth={5} fillOpacity={1} fill="url(#colorIncome)" activeDot={{ r: 8, fill: '#fff', stroke: '#22C55E', strokeWidth: 4, boxShadow: '0 0 20px #22C55E' }} />
                <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={5} fillOpacity={1} fill="url(#colorExpense)" activeDot={{ r: 8, fill: '#fff', stroke: '#EF4444', strokeWidth: 4, boxShadow: '0 0 20px #EF4444' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notifications feed */}
        <div className="bg-[#0D0D0E] border border-white/5 rounded-[3rem] p-10 flex flex-col shadow-2xl relative">
          <div className="flex justify-between items-center mb-10 relative z-10">
            <h2 className="text-3xl font-black text-white">Notifications</h2>
            <div className="relative">
              <Bell className="w-8 h-8 text-gray-400" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0D0D0E]"></div>
            </div>
          </div>
          
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 relative z-10">
             {[
               { title: 'Security Alert', message: 'New login detected from Mac OS.', time: 'Just now', icon: ShieldCheck, color: 'text-orange-400', bg: 'bg-orange-500/10' },
               { title: 'Market Executed', message: 'Bought 1.405 BTC at $66,854.20 via Limit', time: '12 mins ago', icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10' },
               { title: 'Funds Received', message: 'You received $1,250.00 from @sarah_design.', time: '2 hours ago', icon: ArrowDownLeft, color: 'text-blue-400', bg: 'bg-blue-500/10' },
               { title: 'Auto-Invest', message: 'Monthly S&P 500 trigger successful.', time: '1 day ago', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
             ].map((notif, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 cursor-pointer transition-colors group">
                   <div className={`w-12 h-12 rounded-[1rem] ${notif.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <notif.icon className={`w-6 h-6 ${notif.color}`} />
                   </div>
                   <div>
                      <h4 className="text-white font-bold text-lg">{notif.title}</h4>
                      <p className="text-gray-400 text-sm mt-1">{notif.message}</p>
                      <span className="text-xs font-bold text-gray-600 mt-2 block uppercase tracking-widest">{notif.time}</span>
                   </div>
                </div>
             ))}
          </div>
          <button className="w-full mt-6 bg-white/5 py-4 rounded-2xl font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-sm text-gray-300">Mark All as Read</button>
        </div>

      </div>

      {/* Massive Transactions Table */}
      <div className="bg-[#0D0D0E] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl z-10">
         <div className="flex justify-between items-center mb-10">
           <h2 className="text-3xl font-black text-white">Recent Transactions</h2>
           <button className="flex items-center gap-2 text-xl text-blue-400 hover:text-blue-300 font-bold transition-colors group">
             Full History <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
         </div>
         <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/10 text-base font-bold text-gray-500 uppercase tracking-widest bg-white/[0.01]">
                    <th className="py-6 px-6 rounded-tl-2xl">Date</th>
                    <th className="py-6 px-6">Description</th>
                    <th className="py-6 px-6">Amount</th>
                    <th className="py-6 px-6 text-right rounded-tr-2xl">Status</th>
                 </tr>
               </thead>
               <tbody className="text-xl font-medium divide-y divide-white/5">
                 {recentTxns.length === 0 ? (
                    <tr><td colSpan="4" className="py-8 text-center text-gray-500">No recent transactions.</td></tr>
                 ) : recentTxns.map((tx, idx) => (
                   <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                     <td className="py-8 px-6 text-gray-400 whitespace-nowrap">{tx.date}</td>
                     <td className="py-8 px-6 font-bold text-white group-hover:text-blue-400 transition-colors">{tx.name}</td>
                     <td className={`py-8 px-6 font-black ${tx.positive ? 'text-green-400' : 'text-white'}`}>{tx.amount}</td>
                     <td className="py-8 px-6 text-right">
                        <span className={`px-5 py-2.5 text-sm font-black uppercase tracking-widest rounded-xl border ${tx.pending ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_15px_rgba(251,146,60,0.15)]' : 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.15)]'}`}>
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
  );
};

export default Dashboard;
