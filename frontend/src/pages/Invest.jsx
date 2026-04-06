import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, Briefcase, Play, DollarSign, Activity, Percent, CheckCircle, AlertOctagon, X } from 'lucide-react';
import { API_URL } from '../config';

const sparklineDataPos = [
  { value: 10 }, { value: 15 }, { value: 13 }, { value: 20 },
  { value: 18 }, { value: 25 }, { value: 24 }, { value: 30 }
];

const sparklineDataNeg = [
  { value: 30 }, { value: 25 }, { value: 28 }, { value: 20 },
  { value: 22 }, { value: 15 }, { value: 16 }, { value: 10 }
];

const mockStocks = [
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 178.42, change: '+4.2%', isPos: true, data: sparklineDataPos, logoColor: 'bg-red-500/20 text-red-500 outline-red-500/50' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 173.50, change: '+1.8%', isPos: true, data: sparklineDataPos, logoColor: 'bg-white/10 text-white outline-white/30' },
  { symbol: 'AMZN', name: 'Amazon.com', price: 180.25, change: '-0.5%', isPos: false, data: sparklineDataNeg, logoColor: 'bg-orange-500/20 text-orange-400 outline-orange-500/50' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 884.55, change: '+6.5%', isPos: true, data: sparklineDataPos, logoColor: 'bg-green-500/20 text-green-500 outline-green-500/50' }
];

const positions = [
  { symbol: 'AAPL', shares: 45, avgPrice: 150.25, currentPrice: 173.50, isPos: true },
  { symbol: 'TSLA', shares: 120, avgPrice: 205.10, currentPrice: 178.42, isPos: false },
  { symbol: 'MSFT', shares: 15, avgPrice: 390.00, currentPrice: 415.50, isPos: true }
];

const Invest = () => {
  const [selectedStock, setSelectedStock] = useState(mockStocks[0]);
  const [orderType, setOrderType] = useState('buy');
  const [balance, setBalance] = useState(0);
  const [tradeShares, setTradeShares] = useState('');
  const [txStatus, setTxStatus] = useState('idle');
  const [txMessage, setTxMessage] = useState('');
  const [portfolio, setPortfolio] = useState([]);

  const token = localStorage.getItem('finedgeToken');

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
      } catch (err) {}
    };
    fetchData();
  }, [token, txStatus]);

  const currentTotal = tradeShares ? (Number(tradeShares) * selectedStock.price).toFixed(2) : '0.00';

  const executeTrade = async (e) => {
     e.preventDefault();
     if (!tradeShares || Number(tradeShares) <= 0) return;
     setTxStatus('loading');
     setTimeout(async () => {
        try {
           const res = await fetch(`${API_URL}/api/wallet/trade`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ 
                 amount: currentTotal, 
                 type: orderType,
                 assetType: 'stock',
                 assetSymbol: selectedStock.symbol,
                 tradeAmount: tradeShares,
                 price: selectedStock.price,
                 description: `${orderType === 'buy' ? 'Bought' : 'Sold'} ${tradeShares} Shares of ${selectedStock.symbol}`
              })
           });
           const data = await res.json();
           if (res.ok) {
              setBalance(data.balance);
              setTxStatus('success');
              setTxMessage(`Successfully executed ${orderType.toUpperCase()} order for ${tradeShares} shares of ${selectedStock.symbol}.`);
              setTradeShares('');
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

  const stockPortfolio = portfolio.filter(p => p.assetType === 'stock');
  const enrichedPortfolio = stockPortfolio.map(p => {
    const mockData = mockStocks.find(s => s.symbol === p.assetSymbol);
    const currentPrice = mockData ? mockData.price : p.averageEntryPrice;
    return {
      symbol: p.assetSymbol,
      shares: p.amount,
      avgPrice: p.averageEntryPrice,
      currentPrice: currentPrice,
    };
  });

  const totalPortfolioValue = enrichedPortfolio.reduce((acc, pos) => acc + (pos.currentPrice * pos.shares), 0);
  const totalCostBasis = enrichedPortfolio.reduce((acc, pos) => acc + (pos.avgPrice * pos.shares), 0);
  const totalPnL = totalPortfolioValue - totalCostBasis;
  const pnlPercentage = totalCostBasis > 0 ? ((totalPnL / totalCostBasis) * 100).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen text-white/90 bg-[#070709]">

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="lg:hidden">
        <div className="max-w-[430px] mx-auto px-4 py-5 space-y-4">

          <div className="flex justify-end">
            <button onClick={() => window.location.href='/trading'}
              className="text-xs font-bold bg-white/5 border border-white/10 text-gray-300 px-3 py-2 rounded-xl active:scale-95 transition-all">
              Crypto →
            </button>
          </div>

          {/* PnL Card */}
          <div className="bg-[#0f0f13] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
               <Briefcase className="w-4 h-4 text-gray-400" />
               <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Total PnL</p>
            </div>
            <h2 className={`text-3xl font-black mb-1 ${totalPnL >= 0 ? 'text-green-400' : 'text-red-500'}`}>
              {totalPnL >= 0 ? '+' : '-'}${Math.abs(totalPnL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-gray-500 font-bold">{totalPnL >= 0 ? '+' : ''}{pnlPercentage}% Returns</p>
          </div>

          {/* Stock Selector */}
          <div className="bg-[#0f0f13] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <select value={selectedStock.symbol} onChange={(e) => setSelectedStock(mockStocks.find(s => s.symbol === e.target.value) || mockStocks[0])}
                className="bg-transparent text-white text-lg font-black outline-none appearance-none cursor-pointer">
                {mockStocks.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol} - {s.name}</option>)}
              </select>
              <span className={`px-2 py-1 ${selectedStock.isPos ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} font-black text-xs rounded-lg`}>
                {selectedStock.change}
              </span>
            </div>
            <p className="text-3xl font-black text-white">${selectedStock.price.toFixed(2)}</p>
          </div>

          {/* Chart */}
          <div className="bg-[#0f0f13] border border-white/8 rounded-2xl p-4">
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={selectedStock.data}>
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                    <Line type="monotone" dataKey="value" stroke={selectedStock.isPos ? '#22C55E' : '#EF4444'} strokeWidth={3} dot={false} isAnimationActive={false} />
                 </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-[#0f0f13] border border-white/8 rounded-2xl p-4">
            <div className="flex bg-black p-1 rounded-xl mb-4 border border-white/5">
              <button type="button" onClick={() => setOrderType('buy')}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${orderType === 'buy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-500'}`}>Buy</button>
              <button type="button" onClick={() => setOrderType('sell')}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${orderType === 'sell' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'text-gray-500'}`}>Sell</button>
            </div>
            <form onSubmit={executeTrade} className="space-y-3">
              <div className="relative">
                <input type="number" step="1" min="1" required value={tradeShares} onChange={(e) => setTradeShares(e.target.value)} placeholder="0"
                  className="w-full bg-black border border-white/10 focus:border-white/30 rounded-xl py-3 pl-4 pr-16 text-xl font-black text-white outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">Shares</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold">Total</span>
                <span className={`font-black ${orderType === 'buy' ? 'text-white' : 'text-green-400'}`}>${currentTotal}</span>
              </div>
              {orderType === 'buy' && Number(currentTotal) > balance && (
                <div className="text-red-400 text-xs font-bold bg-red-500/10 p-2 rounded-xl text-center border border-red-500/20">
                  Insufficient funds
                </div>
              )}
              <div className="flex justify-between text-xs bg-white/5 p-3 rounded-xl">
                <span className="text-gray-500 font-bold">Buying Power</span>
                <span className="text-white font-black">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <button type="submit" disabled={orderType === 'buy' && Number(currentTotal) > balance}
                className={`w-full py-4 rounded-2xl text-white text-base font-black transition-all active:scale-95 disabled:opacity-50 ${orderType === 'buy' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
                {orderType === 'buy' ? `Buy ${selectedStock.symbol}` : `Sell ${selectedStock.symbol}`}
              </button>
            </form>
          </div>

          {/* Portfolio */}
          <div>
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 mt-2">Your Portfolio</h3>
             <div className="bg-[#0f0f13] border border-white/8 rounded-2xl overflow-hidden">
               {enrichedPortfolio.length === 0 ? (
                 <div className="py-8 text-center text-gray-500 text-sm">No stock positions.</div>
               ) : (
                 enrichedPortfolio.map((pos, idx) => {
                    const rawPnL = (pos.currentPrice - pos.avgPrice) * pos.shares;
                    return (
                       <div key={idx} className={`flex items-center justify-between px-4 py-4 ${idx < enrichedPortfolio.length - 1 ? 'border-b border-white/5' : ''} cursor-pointer hover:bg-white/5`} onClick={() => setSelectedStock(mockStocks.find(s => s.symbol === pos.symbol) || mockStocks[0])}>
                          <div>
                             <p className="text-sm font-bold text-white">{pos.symbol}</p>
                             <p className="text-xs text-gray-500 mt-0.5">{pos.shares} Shares</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black text-white">${(pos.currentPrice * pos.shares).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                             <p className={`text-xs font-bold ${rawPnL >= 0 ? 'text-green-400' : 'text-red-400'} mt-0.5`}>
                               {rawPnL >= 0 ? '+' : '-'}${Math.abs(rawPnL).toLocaleString('en-US', {minimumFractionDigits: 2})}
                             </p>
                          </div>
                       </div>
                    )
                 })
               )}
             </div>
          </div>

        </div>
      </div>

      {/* ─── DESKTOP LAYOUT (unchanged) ─── */}
      <div className="hidden lg:block p-6 md:p-12 min-h-screen pb-24 space-y-8 md:space-y-12 relative overflow-hidden">
      
      {/* Massive Header Section */}
      <div className="relative mb-6 md:mb-12">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="flex flex-col gap-4 relative z-10">
           <div>
              <h1 className="text-3xl sm:text-5xl md:text-[5rem] font-black tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent drop-shadow-2xl mb-2">
                Invest.
              </h1>
              <p className="text-base sm:text-xl md:text-2xl text-gray-400 font-medium tracking-wide">
                Build and track your long-term equity portfolio.
              </p>
           </div>
           
           <div className="flex gap-4">
             <div className="bg-[#050505] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl flex items-center gap-4 sm:gap-6 group hover:border-purple-500/30 transition-colors w-full sm:w-fit">
               <div className={`w-10 h-10 sm:w-14 sm:h-14 ${totalPnL >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-xl sm:rounded-2xl flex items-center justify-center border ${totalPnL >= 0 ? 'border-green-500/30' : 'border-red-500/30'} shrink-0`}>
                 {totalPnL >= 0 ? <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8 text-green-400" /> : <TrendingDown className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />}
               </div>
               <div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs sm:text-sm mb-0.5">Total PnL</p>
                  <h2 className={`text-lg sm:text-3xl font-black ${totalPnL >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                    {totalPnL >= 0 ? '+' : '-'}${Math.abs(totalPnL).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm sm:text-xl text-gray-500">({totalPnL >= 0 ? '+' : ''}{pnlPercentage}%)</span>
                  </h2>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Main Layout: Stock List & Execution Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left Column: Equities List & Positions */}
        <div className="xl:col-span-8 flex flex-col gap-10">
           
           {/* Featured Equities Grid */}
           <div>
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black">Featured Equities</h2>
                <button onClick={() => window.location.href='/trading'} className="text-purple-400 hover:text-purple-300 font-bold tracking-widest uppercase text-sm flex items-center gap-2 cursor-pointer">View Crypto Markets <Play className="w-4 h-4" /></button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockStocks.map((stock) => (
                  <div 
                    key={stock.symbol} 
                    onClick={() => setSelectedStock(stock)}
                    className={`bg-[#0D0D0E] border relative rounded-[2.5rem] p-6 shadow-xl cursor-pointer transition-all duration-300 overflow-hidden ${selectedStock.symbol === stock.symbol ? 'border-purple-500/50 shadow-[0_15px_40px_rgba(168,85,247,0.15)] -translate-y-2' : 'border-white/5 hover:border-white/10 hover:-translate-y-1'}`}
                  >
                     {/* Glass Overlay for Recharts Line */}
                     <div className="absolute right-0 bottom-0 w-32 h-20 opacity-40">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stock.data}>
                               <YAxis domain={['dataMin', 'dataMax']} hide />
                               <Line type="monotone" dataKey="value" stroke={stock.isPos ? '#22C55E' : '#EF4444'} strokeWidth={3} dot={false} isAnimationActive={false} />
                            </LineChart>
                         </ResponsiveContainer>
                     </div>
                     
                     <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl outline outline-2 outline-offset-2 ${stock.logoColor}`}>
                              {stock.symbol[0]}
                           </div>
                           <div>
                              <h3 className="text-2xl font-black text-white">{stock.symbol}</h3>
                              <p className="text-sm font-bold text-gray-500">{stock.name}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <h4 className="text-2xl font-black text-white">${stock.price.toFixed(2)}</h4>
                           <span className={`text-sm font-bold px-2 py-1 rounded-md block mt-1 w-fit ml-auto ${stock.isPos ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {stock.change}
                           </span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           </div>

           {/* My Portfolio Positions Table */}
           <div className="bg-[#0D0D0E] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl flex-1">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black text-white">Your Portolio</h3>
                <span className="text-xl font-black text-white bg-white/10 px-4 py-2 rounded-xl">${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="overflow-x-auto w-full">
                 <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="border-b border-white/10 text-base font-bold text-gray-500 uppercase tracking-widest">
                         <th className="pb-6">Asset</th>
                         <th className="pb-6">Shares</th>
                         <th className="pb-6 text-right">Avg Cost</th>
                         <th className="pb-6 text-right">Current</th>
                         <th className="pb-6 text-right">Return</th>
                      </tr>
                    </thead>
                    <tbody className="text-xl font-medium">
                      {enrichedPortfolio.length > 0 ? (
                        enrichedPortfolio.map((pos, idx) => {
                           const rawPnL = (pos.currentPrice - pos.avgPrice) * pos.shares;
                           const pctPnL = pos.avgPrice > 0 ? (((pos.currentPrice - pos.avgPrice) / pos.avgPrice) * 100).toFixed(2) : '0.00';
                           const pnlClass = rawPnL >= 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10';
                           
                           return (
                             <tr key={idx} className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group" onClick={() => setSelectedStock(mockStocks.find(s => s.symbol === pos.symbol) || mockStocks[0])}>
                               <td className="py-6 font-bold text-white group-hover:text-purple-400 transition-colors">{pos.symbol}</td>
                               <td className="py-6 text-gray-400 leading-none">{pos.shares}<span className="text-sm block text-gray-600 mt-1">Shares</span></td>
                               <td className="py-6 text-gray-400 text-right leading-none">${pos.avgPrice.toFixed(2)}</td>
                               <td className="py-6 text-white font-bold text-right leading-none">${pos.currentPrice.toFixed(2)}</td>
                               <td className={`py-6 text-right font-black`}>
                                   <div className="flex flex-col items-end gap-1">
                                      <span className={`${rawPnL >= 0 ? 'text-green-400' : 'text-red-500'}`}>{rawPnL >= 0 ? '+' : '-'}${Math.abs(rawPnL).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                                      <span className={`text-sm px-2 py-0.5 rounded-lg ${pnlClass}`}>{rawPnL >= 0 ? '+' : ''}{pctPnL}%</span>
                                   </div>
                               </td>
                             </tr>
                           )
                        })
                      ) : (
                        <tr>
                           <td colSpan="5" className="py-6 text-gray-500 text-center text-sm font-bold">No active stock positions.</td>
                        </tr>
                      )}
                    </tbody>
                 </table>
              </div>
           </div>

        </div>

        {/* Right Column: Execution Engine */}
        <div className="xl:col-span-4">
           <div className="bg-[#0D0D0E] border border-white/5 rounded-[3rem] p-8 md:p-10 shadow-2xl relative sticky top-10">
              
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-lg outline outline-2 outline-offset-2 ${selectedStock.logoColor}`}>
                       {selectedStock.symbol[0]}
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white leading-none">{selectedStock.symbol}</h3>
                       <p className="text-gray-400 font-bold">{selectedStock.name}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <h4 className="text-3xl font-black text-white">${selectedStock.price.toFixed(2)}</h4>
                 </div>
              </div>

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
                    <button type="button" className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl border border-white/5 transition-colors">Shares</button>
                    <button type="button" className="flex-1 bg-purple-600/20 text-purple-400 border-purple-500/30 border font-bold py-3 rounded-xl transition-colors">Dollars</button>
                 </div>

                 <div className="space-y-2 group">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Amount</label>
                    <div className="relative">
                       <input type="number" step="1" min="1" value={tradeShares} onChange={(e) => setTradeShares(e.target.value)} placeholder="0" className="w-full bg-black border border-white/10 focus:border-white/30 rounded-2xl py-5 pl-6 pr-16 text-3xl font-black text-white outline-none transition-all" />
                       <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">Shares</span>
                    </div>
                 </div>

                 <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <p className="text-gray-400 font-bold text-lg cursor-pointer">Market Price</p>
                    <p className="text-white font-black text-xl">${selectedStock.price.toFixed(2)}</p>
                 </div>
                 <div className="flex justify-between items-center py-2 relative overflow-hidden">
                    <p className="text-gray-400 font-bold text-lg">Estimated Total</p>
                    <p className={`text-3xl font-black ${orderType === 'buy' ? 'text-white' : 'text-green-400'}`}>${currentTotal}</p>
                 </div>

                 {orderType === 'buy' && Number(currentTotal) > balance && (
                    <div className="text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-xl text-center border border-red-500/20">
                       Insufficient funds. You need ${(Number(currentTotal) - balance).toLocaleString('en-US', {minimumFractionDigits: 2})} more.
                    </div>
                 )}

                 <button 
                    type="submit" 
                    disabled={orderType === 'buy' && Number(currentTotal) > balance}
                    className={`w-full py-6 rounded-2xl text-white text-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 mt-6 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none ${orderType === 'buy' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:shadow-[0_15px_40px_rgba(34,197,94,0.4)]' : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 hover:shadow-[0_15px_40px_rgba(239,68,68,0.4)]'}`}
                 >
                    {orderType === 'buy' ? `Buy ${selectedStock.symbol}` : `Sell ${selectedStock.symbol}`}
                 </button>

                 <div className="text-center pt-4 flex justify-between items-center bg-white/5 p-4 rounded-xl">
                    <p className="text-sm font-bold text-gray-500">Buying Power</p>
                    <p className="text-white font-black text-xl">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                 </div>
              </form>
           </div>
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

export default Invest;
