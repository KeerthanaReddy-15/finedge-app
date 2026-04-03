import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowDownLeft, ArrowUpRight, RefreshCw, Download, Activity, ArrowRight, Wallet, TrendingUp, DollarSign } from 'lucide-react';



const Transactions = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('Any Time');
  const [allTransactions, setAllTransactions] = useState([]);
  
  useEffect(() => {
    const fetchTransactions = async () => {
       const token = localStorage.getItem('finedgeToken');
       if (!token) return;
         try {
           const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wallet/transactions`, {
              headers: { 'Authorization': `Bearer ${token}` }
           });
           const data = await res.json();
         if (res.ok) {
            const formatted = data.map(tx => {
               const dateObj = new Date(tx.createdAt);
               let isCredit = ['deposit', 'transfer_in', 'trade_sell', 'trade_stock_sell', 'trade_crypto_sell', 'escrow_claim'].includes(tx.type);
               
               let tradeCategory = 'Payments';
               let iconBase;

               if (tx.type.includes('crypto')) {
                   tradeCategory = 'Crypto';
                   iconBase = { icon: <RefreshCw className="w-8 h-8 text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]" />, bg: 'bg-orange-500/10', glow: 'hover:border-orange-500/30' };
               } else if (tx.type.includes('stock')) {
                   tradeCategory = 'Stocks';
                   iconBase = { icon: <TrendingUp className="w-8 h-8 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />, bg: 'bg-blue-500/10', glow: 'hover:border-blue-500/30' };
               } else {
                   if (tx.type === 'deposit' || tx.type === 'transfer_in' || tx.type === 'escrow_claim') iconBase = { icon: <ArrowDownLeft className="w-8 h-8 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" />, bg: 'bg-green-500/10', glow: 'hover:border-green-500/30' };
                   else if (tx.type === 'transfer_out') iconBase = { icon: <ArrowUpRight className="w-8 h-8 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />, bg: 'bg-red-500/10', glow: 'hover:border-red-500/30' };
                   else iconBase = { icon: <Activity className="w-8 h-8 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />, bg: 'bg-blue-500/10', glow: 'hover:border-blue-500/30' };
               }

               if (tx.status === 'pending') {
                  iconBase = { icon: <Activity className="w-8 h-8 text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]" />, bg: 'bg-orange-500/10', glow: 'hover:border-orange-500/30' };
               }

               return {
                  id: tx._id.substring(tx._id.length - 6).toUpperCase(),
                  dateObj,
                  description: tx.description,
                  type: tradeCategory, 
                  subType: tx.type.replace(/_/g, ' ').toUpperCase(),
                  amount: `${isCredit ? '+' : '-'}$${tx.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
                  fiatAmount: `$${tx.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
                  status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
                  isCredit,
                  ...iconBase,
                  date: dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                  time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
               };
            });
            setAllTransactions(formatted);
         }
       } catch (err) { }
    };
    fetchTransactions();
  }, []);

  // Master Filter Engine
  const filteredTransactions = allTransactions.filter(txn => {
     // 1. Search Logic
     const matchesSearch = txn.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           txn.type.toLowerCase().includes(searchQuery.toLowerCase());
                           
     // 2. Tab Logic (Category)
     const matchesTab = activeTab === 'All' || txn.type === activeTab;

     // 3. Date Logic
     const now = new Date();
     const txnDate = txn.dateObj;
     const daysDiff = (now - txnDate) / (1000 * 60 * 60 * 24);
     
     let matchesDate = true;
     if (dateFilter === 'Last 7 Days') matchesDate = daysDiff <= 7;
     if (dateFilter === 'This Month') matchesDate = daysDiff <= 30;

     return matchesSearch && matchesTab && matchesDate;
  });

  return (
    <div className="p-6 md:p-12 min-h-screen text-white/90 pb-24">
      
      {/* Huge Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-16 relative">
        <div className="absolute -top-20 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent drop-shadow-2xl">
            Ledger.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium tracking-wide">
            Track your ecosystem pulse in real-time.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-5 relative z-10 w-full xl:w-auto">
          <div className="relative group flex-1 xl:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search markets, transfers, IDs..." 
              className="bg-[#0A0A0B] border-2 border-white/5 focus:border-purple-500/50 rounded-3xl py-5 pl-16 pr-8 text-lg text-white placeholder-gray-600 outline-none transition-all w-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus:shadow-[0_10px_40px_rgba(168,85,247,0.15)]"
            />
          </div>
          
          <div className="relative flex items-center bg-[#0A0A0B] border-2 border-white/5 hover:border-purple-500/30 rounded-3xl transition-all shadow-xl hover:-translate-y-1">
            <Filter className="absolute left-6 w-6 h-6 text-gray-400" />
            <select 
               value={dateFilter}
               onChange={(e) => setDateFilter(e.target.value)}
               className="bg-transparent pl-14 pr-8 py-5 text-lg font-bold text-white appearance-none outline-none cursor-pointer w-full"
            >
               <option className="bg-black">Any Time</option>
               <option className="bg-black">Last 7 Days</option>
               <option className="bg-black">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List Area */}
      <div className="relative">
        
        {/* Dynamic Glow Behind List */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-600/5 rounded-[100%] blur-[150px] pointer-events-none transition-all duration-1000"></div>

        {/* Tab Controls */}
        <div className="flex gap-4 md:gap-8 text-xl md:text-2xl font-bold overflow-x-auto scrollbar-hide mb-10 relative z-10 px-4">
          {['All', 'Payments', 'Stocks', 'Crypto'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 relative transition-all duration-300 whitespace-nowrap ${
                activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              {tab === 'All' ? 'All Ledger' : tab}
              {activeTab === tab && (
                <div className="absolute -bottom-1 left-0 w-full h-1.5 bg-purple-500 rounded-t-full shadow-[0_-5px_20px_rgba(168,85,247,1)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Conditional Rendering for Empty Lists */}
        {filteredTransactions.length === 0 ? (
           <div className="py-32 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]">
              <Search className="w-16 h-16 text-gray-600 mb-6" />
              <h3 className="text-3xl font-black text-gray-400">No Transactions Found</h3>
              <p className="text-xl text-gray-500 mt-2">Try adjusting your category or search filters.</p>
           </div>
        ) : (
           <div className="space-y-6 relative z-10">
             {filteredTransactions.map((txn) => (
               <div 
                 key={txn.id} 
                 className={`bg-[#0D0D0E] border border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all duration-300 cursor-pointer ${txn.glow} hover:-translate-y-2 group shadow-xl`}
               >
                 {/* Left Group */}
                 <div className="flex items-center gap-8">
                   <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] ${txn.bg} border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                     {txn.icon}
                   </div>
                   <div>
                     <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-white transition-colors tracking-tight">{txn.description}</h3>
                     <div className="flex items-center gap-4 text-gray-500 font-bold">
                       <span className={`text-sm px-3 py-1 rounded-lg border ${txn.type === 'Crypto' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : txn.type === 'Stocks' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-500/10 text-gray-300 border-gray-500/20'}`}>{txn.subType}</span>
                       <span className="text-sm hidden sm:inline-block">ID: {txn.id}</span>
                     </div>
                   </div>
                 </div>

                 {/* Middle Group (Date) */}
                 <div className="hidden xl:block text-left border-l border-white/5 pl-10 min-w-[200px]">
                    <p className="text-xl font-bold text-white mb-1">{txn.date}</p>
                    <p className="text-gray-500 font-bold tracking-widest">{txn.time}</p>
                 </div>

                 {/* Right Group */}
                 <div className="flex items-center justify-between lg:justify-end gap-10 lg:pl-10 lg:border-l lg:border-white/5 pt-4 lg:pt-0 border-t border-white/5 lg:border-t-0 mt-4 lg:mt-0 min-w-[300px]">
                   <div className="xl:hidden">
                      <p className="text-lg font-bold text-white mb-1">{txn.date}</p>
                      <p className="text-gray-500">{txn.time}</p>
                   </div>

                   <div className="text-right ml-auto">
                     <p className={`text-3xl md:text-4xl font-black mb-2 tracking-tighter ${txn.isCredit ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.2)]' : 'text-white'}`}>
                       {txn.amount}
                     </p>
                     <div className="flex items-center justify-end gap-4">
                       {txn.amount !== txn.fiatAmount && (
                         <span className="text-lg text-gray-400 font-bold">{txn.fiatAmount}</span>
                       )}
                       <span className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase border ${
                         txn.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                         txn.status === 'Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                         'bg-red-500/10 text-red-500 border-red-500/20'
                       }`}>
                         {txn.status}
                       </span>
                     </div>
                   </div>

                   <button className="hidden md:flex w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 items-center justify-center transition-colors group-hover:bg-purple-600/20 border border-white/5 group-hover:border-purple-500/30">
                     <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                   </button>
                 </div>

               </div>
             ))}
           </div>
        )}

      </div>
    </div>
  );
};

export default Transactions;
