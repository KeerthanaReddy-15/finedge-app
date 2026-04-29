import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, RefreshCw, BarChart2, DollarSign, CheckCircle, AlertOctagon, X } from 'lucide-react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const initialCryptoData = {
  BTC: {
    price: 66850.00,
    change: '+5.21%',
    isPos: true,
    data: [
      { time: '09:00', price: 62450 }, { time: '10:00', price: 62800 },
      { time: '11:00', price: 63120 }, { time: '12:00', price: 62900 },
      { time: '13:00', price: 63500 }, { time: '14:00', price: 64100 },
      { time: '15:00', price: 63850 }, { time: '16:00', price: 64250 },
      { time: '17:00', price: 65100 }, { time: '18:00', price: 66200 },
      { time: '19:00', price: 65900 }, { time: '20:00', price: 66850 }
    ]
  },
  ETH: {
    price: 3520.00,
    change: '+2.85%',
    isPos: true,
    data: [
      { time: '09:00', price: 3100 }, { time: '10:00', price: 3150 },
      { time: '11:00', price: 3120 }, { time: '12:00', price: 3080 },
      { time: '13:00', price: 3200 }, { time: '14:00', price: 3250 },
      { time: '15:00', price: 3220 }, { time: '16:00', price: 3350 },
      { time: '17:00', price: 3410 }, { time: '18:00', price: 3480 },
      { time: '19:00', price: 3450 }, { time: '20:00', price: 3520 }
    ]
  }
};

const OrderBook = ({ pair, price }) => {
   const multiplier = pair === 'BTC' ? 1 : 0.05;
   const basePrice = price;

   const asks = Array.from({ length: 5 }).map((_, i) => ({
      price: (basePrice + (i * 1.5 * multiplier)).toFixed(2),
      amount: (Math.random() * 2).toFixed(3),
      total: ((basePrice + (i * 1.5 * multiplier)) * (Math.random() * 2)).toFixed(2)
   })).reverse();
   
   const bids = Array.from({ length: 5 }).map((_, i) => ({
      price: (basePrice - ((i + 1) * 1.5 * multiplier)).toFixed(2),
      amount: (Math.random() * 5).toFixed(3),
      total: ((basePrice - ((i + 1) * 1.5 * multiplier)) * (Math.random() * 5)).toFixed(2)
   }));

   return (
      <div className="bg-[#0D0D0E] border border-white/5 rounded-[2.5rem] p-8 mt-8 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-white">Order Book</h3>
            <span className="text-gray-500 font-bold text-sm bg-white/5 px-3 py-1 rounded-lg">{pair}/USD</span>
         </div>
         <div className="grid grid-cols-3 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            <span>Price</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Total ($)</span>
         </div>
         
         <div className="space-y-2 mb-4">
            {asks.map((ask, i) => (
               <div key={`ask-${i}`} className="grid grid-cols-3 text-sm font-bold relative group/row cursor-pointer hover:bg-white/5 rounded px-2 py-1 transition-colors">
                  <span className="text-red-400 z-10">{ask.price}</span>
                  <span className="text-right text-gray-300 z-10">{ask.amount}</span>
                  <span className="text-right text-gray-400 z-10">{ask.total}</span>
               </div>
            ))}
         </div>
         
         <div className="my-6 py-4 border-y border-white/5 flex items-center justify-center gap-4 bg-green-500/5">
            <span className="text-3xl font-black text-green-400">{basePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <TrendingUp className="w-6 h-6 text-green-400" />
         </div>

         <div className="space-y-2">
            {bids.map((bid, i) => (
               <div key={`bid-${i}`} className="grid grid-cols-3 text-sm font-bold relative group/row cursor-pointer hover:bg-white/5 rounded px-2 py-1 transition-colors">
                  <span className="text-green-400 z-10">{bid.price}</span>
                  <span className="text-right text-gray-300 z-10">{bid.amount}</span>
                  <span className="text-right text-gray-400 z-10">{bid.total}</span>
               </div>
            ))}
         </div>
      </div>
   );
};

const Trading = () => {
  const [activePair, setActivePair] = useState('BTC'); // 'BTC' or 'ETH'
  const [cryptoData, setCryptoData] = useState(initialCryptoData);
  const [orderType, setOrderType] = useState('buy'); // 'buy' or 'sell'
  const [balance, setBalance] = useState(0);
  const [tradeAmount, setTradeAmount] = useState('');
  
  // Transaction State for Overlays
  const [txStatus, setTxStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [txMessage, setTxMessage] = useState('');
  const [portfolio, setPortfolio] = useState([]);

  const token = localStorage.getItem('finedgeToken');
  const navigate = useNavigate();

  const currentPrice = cryptoData[activePair].price;
  const currentTotal = tradeAmount ? (Number(tradeAmount) * currentPrice).toFixed(2) : '0.00';
  const assetBalance = portfolio.find(p => p.assetSymbol === activePair)?.amount || 0;

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const balanceRes = await fetch(`${API_URL}/api/wallet/balance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const balanceData = await balanceRes.json();
        if (balanceRes.ok) setBalance(balanceData.balance);
        
        const portRes = await fetch(`${API_URL}/api/wallet/portfolio`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const portData = await portRes.json();
        if (portRes.ok) setPortfolio(portData);
      } catch (err) {
         console.error("Failed to fetch live balance for trading.");
      }
    };
    fetchData();
  }, [token, txStatus]);

  // Real-time crypto market feed effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData(prevData => {
        const newData = { ...prevData };
        Object.keys(newData).forEach(coin => {
          const coinData = newData[coin];
          const fluctuation = coinData.price * (Math.random() * 0.006 - 0.003); // Crypto fluctuates more
          const newPrice = Math.max(0.01, coinData.price + fluctuation);
          
          const newChartData = [...coinData.data.slice(1), { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), price: newPrice }];
          const newChangePct = (((newPrice - coinData.data[0].price) / coinData.data[0].price) * 100).toFixed(2);
          
          newData[coin] = {
            ...coinData,
            price: newPrice,
            change: `${newChangePct >= 0 ? '+' : ''}${newChangePct}%`,
            isPos: newChangePct >= 0,
            data: newChartData
          };
        });
        return newData;
      });
    }, 1200); // crypto ticks slightly faster
    return () => clearInterval(interval);
  }, []);

  const executeTrade = async (e) => {
     e.preventDefault();
     if (!tradeAmount || Number(tradeAmount) <= 0) return;
     
     setTxStatus('loading');
     
     // Simulate slight network delay for high-frequency feel
     setTimeout(async () => {
        try {
           const res = await fetch(`${API_URL}/api/wallet/trade`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ 
                  amount: currentTotal, 
                  type: orderType,
                  assetType: 'crypto',
                  assetSymbol: activePair,
                  tradeAmount: tradeAmount,
                  price: currentPrice,
                  description: `${orderType === 'buy' ? 'Bought' : 'Sold'} ${tradeAmount} ${activePair}`
               })
           });
           const data = await res.json();
           
           if (res.ok) {
              setBalance(data.balance);
              setTxStatus('success');
              setTxMessage(`Successfully executed ${orderType.toUpperCase()} order for ${tradeAmount} ${activePair}.`);
              setTradeAmount('');
           } else {
              setTxStatus('error');
              setTxMessage(data.error || 'Order execution failed.');
           }
        } catch(err) {
           setTxStatus('error');
           setTxMessage('Network execution error. Order aborted.');
        }
     }, 1200);
  };

  const chartData = cryptoData[activePair].data;
  const colorMap = activePair === 'BTC' ? { hex: '#F7931A', glow: 'from-orange-600/10' } : { hex: '#627EEA', glow: 'from-blue-600/10' };

  return (
    <div className="min-h-screen text-white/90 bg-[#070709]">

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="lg:hidden min-h-screen bg-[#121318] pt-14 pb-32 px-4 flex flex-col gap-6 relative overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-[-5%] left-[-10%] w-full h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-20%] w-[120%] h-[300px] bg-purple-600/10 blur-[100px] rounded-full -z-10"></div>

        {/* Top Header & Navigation */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1a1b22] border border-white/5 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#cca3ff]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global</p>
              <h2 className="text-xl font-black text-white leading-tight">Trading</h2>
            </div>
          </div>
          <button onClick={() => navigate('/invest')} className="px-4 py-2 bg-[#1a1b22] border border-white/5 rounded-xl font-black text-[10px] uppercase text-gray-400 tracking-widest active:scale-95 transition-all">
            Equities →
          </button>
        </div>

        {/* Dynamic Pair Info (Density) */}
        <div className="bg-gradient-to-br from-[#1a1b22] to-[#0d0d12] border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden shadow-xl">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-xl ${activePair === 'BTC' ? 'bg-orange-500/10' : 'bg-blue-500/10'} flex items-center justify-center`}>
                    <p className={`text-xs font-black ${activePair === 'BTC' ? 'text-orange-400' : 'text-blue-400'}`}>{activePair === 'BTC' ? '₿' : 'Ξ'}</p>
                 </div>
                 <select 
                    value={activePair} 
                    onChange={(e) => setActivePair(e.target.value)}
                    className="bg-transparent text-white text-base font-black outline-none appearance-none cursor-pointer"
                 >
                    <option value="BTC">BTC / USD</option>
                    <option value="ETH">ETH / USD</option>
                 </select>
              </div>
              <div className={`px-2 py-1 ${cryptoData[activePair].isPos ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'} rounded-lg text-[10px] font-black uppercase`}>
                 {cryptoData[activePair].change}
              </div>
           </div>
           
           <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-black text-white">${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase">24h Vol: $42.1B</span>
           </div>

           {/* Chart Container */}
           <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
                    <defs>
                       <linearGradient id="mTradeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={colorMap.hex} stopOpacity={0.4} />
                          <stop offset="100%" stopColor={colorMap.hex} stopOpacity={0} />
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 9 }} tickLine={false} axisLine={false} dy={6} />
                    <YAxis hide />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0f0f13', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} 
                       labelStyle={{ color: '#9CA3AF' }} 
                       itemStyle={{ fontWeight: 700 }} 
                    />
                    <Area type="monotone" dataKey="price" stroke={colorMap.hex} strokeWidth={3} fill="url(#mTradeGrad)" dot={false} activeDot={{ r: 5, fill: '#fff', stroke: colorMap.hex, strokeWidth: 2 }} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Order Execution Card */}
        <div className="bg-[#1a1b22] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl">
           <div className="flex bg-[#121318] p-1 rounded-2xl mb-5 border border-white/5">
              <button onClick={() => setOrderType('buy')}
                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${orderType === 'buy' ? 'bg-[#cca3ff] text-[#121318] shadow-[0_5px_15px_rgba(204,163,255,0.3)]' : 'text-gray-500'}`}>Buy</button>
              <button onClick={() => setOrderType('sell')}
                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${orderType === 'sell' ? 'bg-[#cca3ff] text-[#121318] shadow-[0_5px_15px_rgba(204,163,255,0.3)]' : 'text-gray-500'}`}>Sell</button>
           </div>

           <form onSubmit={executeTrade} className="space-y-4">
              <div className="relative">
                 <p className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-black text-sm">$</p>
                 <input type="number" step="0.01" min="0.01" required value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="0.00"
                   className="w-full bg-[#121318] border border-white/5 focus:border-[#cca3ff]/50 rounded-2xl py-4 pl-10 pr-16 text-xl font-black text-white outline-none transition-all" />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cca3ff] font-black text-xs uppercase">{activePair}</span>
              </div>

              <div className="flex justify-between items-center px-1">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Order Total</span>
                    <span className="text-sm font-black text-white">${(Number(currentTotal)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                 </div>
                 <div className="flex flex-col text-right">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Available</span>
                    <span className="text-[10px] text-green-400 font-black uppercase">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                 </div>
              </div>

              {/* Dynamic Error Messaging (Density) */}
              {(orderType === 'buy' && Number(currentTotal) > balance) || (orderType === 'sell' && (Number(tradeAmount) > assetBalance)) ? (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl flex items-center gap-2">
                   <AlertOctagon className="w-4 h-4 text-red-500" />
                   <p className="text-[10px] text-red-400 font-black uppercase">Insufficient {orderType === 'buy' ? 'USD Liquidity' : `${activePair} Balance`}</p>
                </div>
              ) : null}

              <button 
                type="submit" 
                disabled={txStatus === 'loading'}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl ${txStatus === 'loading' ? 'bg-gray-800 text-gray-600' : 'bg-white text-black hover:bg-gray-100'}`}
              >
                {txStatus === 'loading' ? 'Executing Order...' : `Confirm ${orderType} Order`}
              </button>
           </form>
        </div>

        {/* Market Insights (Information Density) */}
        <div className="flex flex-col gap-3">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Market Sentiment</h3>
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1a1b22] border border-white/5 rounded-[2.5rem] p-5">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Buyers</span>
                 </div>
                 <p className="text-base font-black text-white">62.5%</p>
              </div>
              <div className="bg-[#1a1b22] border border-white/5 rounded-[2.5rem] p-5">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Sellers</span>
                 </div>
                 <p className="text-base font-black text-white">37.5%</p>
              </div>
           </div>
        </div>

      </div>

      {/* ─── DESKTOP LAYOUT (unchanged) ─── */}
      <div className="hidden lg:block p-6 md:p-12 min-h-screen pb-24 space-y-8 md:space-y-12 relative overflow-hidden">
      
      {/* Massive Header Section */}
      <div className="relative mb-6 md:mb-12">
        <div className={`absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br ${colorMap.glow} to-transparent rounded-full blur-[150px] pointer-events-none transition-colors duration-1000`}></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4">
           <div>
              <h1 className="text-3xl sm:text-5xl md:text-[5rem] font-black tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent drop-shadow-2xl mb-2 md:mb-4">
                Crypto Exchange.
              </h1>
              <p className="text-base sm:text-xl md:text-2xl text-gray-400 font-medium tracking-wide">
                Live market execution powered by your digital wallet.
              </p>
           </div>
           
           <div className="flex gap-3">
              <button onClick={() => navigate('/invest')} className="px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-colors text-sm sm:text-base whitespace-nowrap">
                Switch to Equities
              </button>
           </div>
        </div>
      </div>

      {/* Main Terminal Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* Left Column: Massive Charts */}
         <div className="xl:col-span-8 space-y-10">
            
            {/* Chart Module */}
            <div className="bg-[#0D0D0E] border border-white/5 rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-8 md:p-12 relative overflow-hidden group transition-colors shadow-2xl h-[380px] sm:h-[500px] md:h-[650px] flex flex-col">
               <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-r ${colorMap.glow} to-transparent blur-[120px] pointer-events-none rounded-full transition-colors duration-1000`}></div>
               
               {/* Chart Header & Picker */}
               <div className="flex flex-wrap justify-between items-start mb-4 sm:mb-8 relative z-10 w-full gap-3">
                  <div>
                    <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                       <select 
                          value={activePair} 
                          onChange={(e) => setActivePair(e.target.value)}
                          className="bg-black border border-white/20 text-white text-base sm:text-2xl font-black rounded-xl px-3 py-2 sm:px-6 sm:py-3 outline-none cursor-pointer appearance-none shadow-xl"
                       >
                          <option value="BTC">BTC / USD</option>
                          <option value="ETH">ETH / USD</option>
                       </select>
                       <span className={`px-2 py-1 sm:px-4 sm:py-2 ${cryptoData[activePair].isPos ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'} font-black text-sm sm:text-xl rounded-xl border`}>
                          {cryptoData[activePair].change}
                       </span>
                    </div>
                    <p className="text-2xl sm:text-4xl text-white font-bold">${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>

                  <div className="flex gap-1 sm:gap-4">
                     {['1H', '1D', '1W', '1M'].map(time => (
                        <button key={time} className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-xs sm:text-lg border border-white/5 flex items-center justify-center transition-all">
                           {time}
                        </button>
                     ))}
                  </div>
               </div>
               
               {/* The Massive Recharts Chart */}
               <div className="flex-1 relative z-10 w-full mt-4 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                         <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor={colorMap.hex} stopOpacity={0.4} />
                           <stop offset="100%" stopColor={colorMap.hex} stopOpacity={0} />
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="#ffffff0a" vertical={false} />
                      <XAxis dataKey="time" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 14, fontWeight: 'bold'}} tickLine={false} axisLine={false} dy={20} />
                      <YAxis stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 14, fontWeight: 'bold'}} tickLine={false} axisLine={false} dx={-15} domain={['dataMin - 50', 'dataMax + 50']} tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`} />
                      <Tooltip 
                        cursor={{ stroke: `rgba(255,255,255,0.1)`, strokeWidth: 2, strokeDasharray: '4 4' }}
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', padding: '16px 20px' }}
                        itemStyle={{ color: colorMap.hex, fontWeight: '900', fontSize: '1.4rem' }}
                        labelStyle={{ color: '#9CA3AF', marginBottom: '8px' }}
                      />
                      <Area type="monotone" dataKey="price" stroke={colorMap.hex} strokeWidth={5} fill="url(#gradientArea)" activeDot={{ r: 8, fill: '#fff', stroke: colorMap.hex, strokeWidth: 4, boxShadow: `0 0 20px ${colorMap.hex}` }} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Active Sub-Positions */}
            <div className="bg-[#0D0D0E] border border-white/5 rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-10 relative overflow-hidden shadow-2xl">
               <h3 className="text-xl sm:text-3xl font-black text-white mb-5 sm:mb-8">Active {activePair} Positions</h3>
               <div className="overflow-x-auto w-full">
                  <table className="w-full text-left min-w-[420px]">
                     <thead>
                       <tr className="border-b border-white/10 text-base font-bold text-gray-500 uppercase tracking-widest">
                          <th className="pb-6">Market</th>
                          <th className="pb-6">Size</th>
                          <th className="pb-6">Entry Price</th>
                          <th className="pb-6 text-right">PnL</th>
                       </tr>
                     </thead>
                     <tbody className="text-xl font-medium">
                        {portfolio.filter(p => p.assetSymbol === activePair).length > 0 ? (
                           portfolio.filter(p => p.assetSymbol === activePair).map((pos, i) => {
                              const pnl = (currentPrice - pos.averageEntryPrice) * pos.amount;
                              return (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                  <td className="py-6 font-bold text-white tracking-widest">{pos.assetSymbol}/USD</td>
                                  <td className="py-6 text-gray-400">{pos.amount.toFixed(4)} {pos.assetSymbol}</td>
                                  <td className="py-6 text-gray-400">${pos.averageEntryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                  <td className={`py-6 text-right font-black ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {pnl >= 0 ? '+' : '-'}${Math.abs(pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              )
                           })
                        ) : (
                           <tr>
                              <td colSpan="4" className="py-6 text-gray-500 text-center text-sm font-bold">No active positions for {activePair}</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

         </div>

         {/* Right Column: Execution Engine and Order Book */}
         <div className="xl:col-span-4 flex flex-col">
            
            <div className="bg-[#0D0D0E] border border-white/5 rounded-[3rem] p-8 md:p-10 shadow-2xl relative sticky top-10 z-10">
               
               <div className="flex bg-black p-2 rounded-2xl mb-8 border border-white/5">
                  <button 
                     onClick={() => setOrderType('buy')}
                     className={`flex-1 py-4 text-xl font-black rounded-xl transition-all ${orderType === 'buy' ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'text-gray-500 hover:text-white'}`}
                  >
                     Buy
                  </button>
                  <button 
                     onClick={() => setOrderType('sell')}
                     className={`flex-1 py-4 text-xl font-black rounded-xl transition-all ${orderType === 'sell' ? 'bg-red-500/20 text-red-500 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'text-gray-500 hover:text-white'}`}
                  >
                     Sell
                  </button>
               </div>

               <form onSubmit={executeTrade} className="space-y-6">
                  
                  <div className="flex gap-4 mb-6">
                     <button type="button" className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl border border-white/5 transition-colors">Limit</button>
                     <button type="button" className="flex-1 bg-purple-600/20 text-purple-400 border-purple-500/30 border font-bold py-3 rounded-xl transition-colors">Market</button>
                  </div>

                  <div className="space-y-2 group">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Amount</label>
                     <div className="relative">
                        <input type="number" step="0.01" min="0.01" required value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="0.00" className="w-full bg-black border border-white/10 focus:border-white/30 rounded-2xl py-5 pl-6 pr-16 text-3xl font-black text-white outline-none transition-all" />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">{activePair}</span>
                     </div>
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                     <p className="text-gray-400 font-bold text-lg">Market Price</p>
                     <p className="text-white font-black text-xl">${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex justify-between items-center py-2 relative overflow-hidden">
                     <p className="text-gray-400 font-bold text-lg">Estimated Total</p>
                     <p className={`text-3xl font-black ${orderType === 'buy' ? 'text-white' : 'text-green-400'}`}>${currentTotal}</p>
                  </div>

                  {/* Warning if insufficient funds during buy */}
                  {orderType === 'buy' && Number(currentTotal) > balance && (
                     <div className="text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-xl text-center border border-red-500/20">
                        Insufficient funds. You need ${(Number(currentTotal) - balance).toLocaleString('en-US', {minimumFractionDigits: 2})} more.
                     </div>
                  )}

                  <button 
                     type="submit" 
                     disabled={orderType === 'buy' && Number(currentTotal) > balance}
                     className={`w-full py-6 rounded-2xl text-white text-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 mt-6 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none
                        ${orderType === 'buy' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:shadow-[0_15px_40px_rgba(34,197,94,0.4)]' : 
                                                'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 hover:shadow-[0_15px_40px_rgba(239,68,68,0.4)]'}`}
                  >
                     {orderType === 'buy' ? `Buy ${activePair}` : `Sell ${activePair}`}
                  </button>

                  <div className="text-center pt-4 flex justify-between items-center bg-white/5 p-4 rounded-xl">
                     <p className="text-sm font-bold text-gray-500">Live Trade Balance</p>
                     <p className="text-white font-black text-xl">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
               </form>
               
            </div>

            {/* Embedded Order Book Component */}
            <OrderBook pair={activePair} price={currentPrice} />
         </div>

      </div>
      </div>

      {/* Massive Transaction Overlays */}
      {txStatus !== 'idle' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
          
          <div className={`relative bg-[#0A0912] border border-white/10 w-full max-w-2xl mx-4 rounded-[2rem] sm:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden transition-all duration-500 transform ${txStatus === 'success' ? 'scale-105 border-green-500/50 shadow-[0_0_100px_rgba(34,197,94,0.3)]' : txStatus === 'error' ? 'scale-[0.98] border-red-500/50 shadow-[0_0_100px_rgba(239,68,68,0.3)]' : 'scale-100'}`}>
            
            {txStatus !== 'loading' && (
               <button type="button" onClick={() => setTxStatus('idle')} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-30 cursor-pointer">
                  <X className="w-8 h-8 text-white" />
               </button>
            )}

            {txStatus === 'loading' && (
              <div className="p-12 sm:p-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/10 animate-pulse pointer-events-none"></div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-8 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6 relative z-10"></div>
                <h3 className="text-2xl sm:text-4xl font-black text-white">Filling Market Order</h3>
                <p className="text-base text-gray-400 mt-3 font-medium">Validating block and modifying ledger...</p>
              </div>
            )}

            {txStatus === 'success' && (
              <div className="p-10 sm:p-16 flex flex-col items-center justify-center text-center relative">
                <div className="absolute inset-0 bg-green-500/10 pointer-events-none"></div>
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border-4 border-green-500/30 relative z-10">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400" />
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-white mb-3 relative z-10">Trade Executed</h3>
                <p className="text-base sm:text-xl text-green-400 font-bold max-w-sm mb-5 relative z-10">{txMessage}</p>
                <p className="text-sm text-gray-400 font-medium relative z-10">New balance: <span className="text-white font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></p>
                <button type="button" onClick={() => setTxStatus('idle')} className="mt-8 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white font-bold text-lg transition-all relative z-10 cursor-pointer">Close Terminal</button>
              </div>
            )}

            {txStatus === 'error' && (
              <div className="p-10 sm:p-16 flex flex-col items-center justify-center text-center relative">
                <div className="absolute inset-0 bg-red-500/10 pointer-events-none"></div>
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border-4 border-red-500/30 relative z-10">
                  <AlertOctagon className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" />
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-white mb-3 relative z-10">Execution Failed</h3>
                <p className="text-base sm:text-xl text-red-400 font-bold max-w-sm relative z-10">{txMessage}</p>
                <button type="button" onClick={() => setTxStatus('idle')} className="mt-8 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white font-bold text-lg transition-all relative z-10 cursor-pointer">Dismiss</button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Trading;
