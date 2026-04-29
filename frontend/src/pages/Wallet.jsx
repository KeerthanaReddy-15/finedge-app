import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, RefreshCw, Bitcoin, CreditCard, DollarSign, Wallet as WalletIcon, ArrowRight, Activity, Percent, X, CheckCircle, AlertOctagon, Wifi } from 'lucide-react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [modalState, setModalState] = useState({ isOpen: false, type: null });
  const [txStatus, setTxStatus] = useState('idle');
  const [txMessage, setTxMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [activeCard, setActiveCard] = useState(1);

  const navigate = useNavigate();
  const token = localStorage.getItem('finedgeToken');

  useEffect(() => {
    if (!token) return;
    fetchBalance();
  }, [token]);

  const fetchBalance = async () => {
    try {
      const res = await fetch(`${API_URL}/api/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setBalance(data.balance);
    } catch (err) { console.error(err); }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setTxStatus('loading');
    setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/wallet/deposit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ amount })
        });
        const data = await res.json();
        if (res.ok) { setBalance(data.balance); setTxStatus('success'); setTxMessage(`Successfully deposited $${parseInt(amount).toLocaleString()} into your wallet.`); }
        else { setTxStatus('error'); setTxMessage(data.error || 'Deposit failed'); }
      } catch (err) { setTxStatus('error'); setTxMessage('Network Error'); }
    }, 1000);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTxStatus('loading');
    setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/wallet/transfer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ targetEmail, amount })
        });
        const data = await res.json();
        if (res.ok) { setBalance(data.balance); setTxStatus('success'); setTxMessage(`Successfully transferred $${parseInt(amount).toLocaleString()} to ${data.receiverEmail}.`); }
        else { setTxStatus('error'); setTxMessage(data.error || 'Transfer failed'); }
      } catch (err) { setTxStatus('error'); setTxMessage('Network Error'); }
    }, 1000);
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
    setTxStatus('idle');
    setTxMessage('');
    setAmount('');
    setTargetEmail('');
    fetchBalance();
  };

  const handleCardClick = (e, cardId) => {
    e.stopPropagation();
    if (!isCardExpanded) {
      setIsCardExpanded(true);
    } else {
      if (activeCard === cardId) {
        setIsCardExpanded(false);
      } else {
        setActiveCard(cardId);
      }
    }
  };

  const getCardPositionClasses = (cardId) => {
    let relativePos = (cardId - activeCard + 3) % 3; 
    if (!isCardExpanded) {
      if (relativePos === 0) return 'translate-x-0 translate-y-0 rotate-0 scale-100 z-30';
      if (relativePos === 1) return 'translate-x-0 translate-y-0 rotate-0 scale-100 z-20 opacity-0';
      if (relativePos === 2) return 'translate-x-0 translate-y-0 rotate-0 scale-100 z-10 opacity-0';
    } else {
      if (relativePos === 0) return 'translate-y-48 -translate-x-6 -rotate-3 scale-100 z-30 hover:scale-[1.02] opacity-100';
      if (relativePos === 1) return 'translate-y-0 translate-x-12 rotate-6 scale-95 z-20 hover:scale-100 opacity-100';
      if (relativePos === 2) return '-translate-y-44 -translate-x-10 -rotate-6 scale-90 z-10 hover:scale-95 opacity-100';
    }
  };

  const assets = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', balance: '1.2450', value: '$84,250.00', change: '+5.2%', icon: <Bitcoin className="w-12 h-12 text-[#F7931A]" />, glow: 'group-hover:shadow-[0_0_50px_rgba(247,147,26,0.3)]', borderHover: 'group-hover:border-[#F7931A]/50' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', balance: '14.5000', value: '$45,120.50', change: '+2.1%', icon: <div className="text-white font-black text-xl tracking-widest bg-[#627EEA] w-12 h-12 rounded-full flex items-center justify-center">E</div>, glow: 'group-hover:shadow-[0_0_50px_rgba(98,126,234,0.3)]', borderHover: 'group-hover:border-[#627EEA]/50' },
  ];

  /* ── Shared Modal (used by both layouts) ── */
  const SharedModal = () => !modalState.isOpen ? null : (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal}></div>
      <div className={`relative bg-[#0A0912] border border-white/10 w-full max-w-lg mx-4 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden transition-all duration-500 ${txStatus === 'success' ? 'border-green-500/50' : txStatus === 'error' ? 'border-red-500/50' : ''}`}>
        <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20">
          <X className="w-6 h-6 text-white" />
        </button>
        {txStatus === 'idle' && (
          <div className="p-6 sm:p-10">
            <h2 className="text-2xl sm:text-4xl font-black mb-2">
              {modalState.type === 'deposit' ? 'Add Funds' : modalState.type === 'send' ? 'Send Money' : 'Receive'}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-6">
              {modalState.type === 'deposit' ? 'Instantly pull from your linked FinEdge VISA.' : modalState.type === 'send' ? 'Transfer to any FinEdge user instantly.' : 'Share this code to request funds.'}
            </p>
            {modalState.type === 'receive' ? (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-48 h-48 bg-white rounded-3xl p-3 flex items-center justify-center shadow-xl mb-6">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=finedge://pay/${token?.substring(0,10)}`} alt="QR" className="w-full h-full rounded-2xl" />
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Your Payment Address</p>
                <p className="text-base font-mono text-purple-400 bg-purple-500/10 px-4 py-2 rounded-2xl border border-purple-500/20">0xFE...{token?.substring(0,8) || 'MockAddr'}</p>
              </div>
            ) : (
              <form onSubmit={modalState.type === 'deposit' ? handleDeposit : handleTransfer} className="space-y-4">
                {modalState.type === 'send' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Recipient Email</label>
                    <input type="email" required placeholder="target@finedge.app" value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-purple-500/50 rounded-2xl py-4 px-5 text-base text-white outline-none" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Amount (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="number" required placeholder="0.00" min="1" value={amount} onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-purple-500/50 rounded-2xl py-4 pl-12 pr-6 text-2xl sm:text-3xl font-black text-white outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 mt-2 rounded-2xl bg-white hover:bg-gray-200 text-black text-lg sm:text-xl font-black transition-all flex items-center justify-center gap-3 active:scale-95">
                  {modalState.type === 'deposit' ? 'Confirm Deposit' : 'Initiate Transfer'} <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        )}
        {txStatus === 'loading' && (
          <div className="p-14 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-purple-500/10 animate-pulse pointer-events-none"></div>
            <div className="w-16 h-16 border-8 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-black text-white">Processing</h3>
            <p className="text-sm text-gray-400 mt-2">Securing transaction on FinEdge Ledger...</p>
          </div>
        )}
        {txStatus === 'success' && (
          <div className="p-10 flex flex-col items-center justify-center text-center relative">
            <div className="absolute inset-0 bg-green-500/10 pointer-events-none"></div>
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border-4 border-green-500/30">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Transaction Confirmed</h3>
            <p className="text-sm text-green-400 font-bold max-w-xs">{txMessage}</p>
            <button onClick={closeModal} className="mt-6 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white font-bold transition-all">Close</button>
          </div>
        )}
        {txStatus === 'error' && (
          <div className="p-10 flex flex-col items-center justify-center text-center relative">
            <div className="absolute inset-0 bg-red-500/10 pointer-events-none"></div>
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border-4 border-red-500/30">
              <AlertOctagon className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Transaction Failed</h3>
            <p className="text-sm text-red-400 font-bold max-w-xs">{txMessage}</p>
            <button onClick={() => setTxStatus('idle')} className="mt-6 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white font-bold transition-all">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white/90 bg-[#070709]">

      {SharedModal()}

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="lg:hidden min-h-screen bg-[#121318] pt-14 pb-32 px-4 flex flex-col gap-6 relative overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-[-5%] right-[-10%] w-full h-[400px] bg-purple-600/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[-20%] w-[120%] h-[300px] bg-blue-600/10 blur-[100px] rounded-full -z-10"></div>

        {/* Top Header & Deposit Action */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1a1b22] border border-white/5 rounded-2xl flex items-center justify-center">
              <WalletIcon className="w-6 h-6 text-[#cca3ff]" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Financial</p>
              <h2 className="text-xl font-black text-white leading-tight">Assets</h2>
            </div>
          </div>
          <button 
            onClick={() => setModalState({ isOpen: true, type: 'deposit' })}
            className="w-11 h-11 bg-[#cca3ff] border border-[#cca3ff]/20 rounded-2xl flex items-center justify-center text-[#121318] shadow-[0_5px_15px_rgba(204,163,255,0.4)] transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5 font-black" />
          </button>
        </div>

        {/* Wealth Score Insight (Information Density) */}
        <div className="bg-gradient-to-br from-[#1a1b22] to-[#0d0d12] border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden shadow-xl">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Wealth Health</h3>
              <div className="px-2 py-1 bg-green-500/10 rounded-lg text-green-400 text-[10px] font-black uppercase">Excellent</div>
           </div>
           <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - 0.84)} className="text-[#cca3ff] transition-all duration-1000" strokeLinecap="round" />
                 </svg>
                 <span className="absolute text-xl font-black text-white">840</span>
              </div>
              <div className="flex flex-col gap-1.5">
                 <p className="text-[11px] text-gray-400 font-medium leading-tight">Your financial stability is in the <span className="text-white font-bold">top 5%</span> of users this month.</p>
                 <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    Verified by FinEdge
                 </div>
              </div>
           </div>
        </div>

        {/* Premium 3D Mobile VISA Card */}
        <div className="relative w-full h-64 my-4" style={{ perspective: '1000px' }} onClick={() => setIsCardExpanded(!isCardExpanded)}>
           <div className={`w-full h-full bg-gradient-to-tr from-[#14151B] via-[#292A38] to-[#121217] border border-white/20 rounded-[2rem] p-6 flex flex-col justify-between transition-transform duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden ${isCardExpanded ? 'scale-105' : ''}`} 
                style={{ transform: isCardExpanded ? 'rotateY(10deg) rotateX(5deg)' : 'rotateY(0deg)', transformStyle: 'preserve-3d' }}>
              
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),_transparent_50%)] pointer-events-none"></div>
              <div className="absolute right-[-10%] bottom-[-20%] w-64 h-64 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] mix-blend-overlay"></div>
              
              <div className="flex justify-between items-start z-10 w-full relative" style={{ transform: 'translateZ(30px)' }}>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-10 rounded-md border border-[#8B6508] bg-gradient-to-br from-[#E6C27A] via-[#D4AF37] to-[#AA7C11] flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                       <div className="w-full h-px bg-[#8B6508]/50 absolute top-1/3"></div>
                       <div className="w-full h-px bg-[#8B6508]/50 absolute top-2/3"></div>
                       <div className="w-px h-full bg-[#8B6508]/50 absolute left-1/2"></div>
                   </div>
                   <Wifi className="w-6 h-6 text-gray-400 rotate-90 opacity-80" strokeWidth={2.5} />
                </div>
                <span className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-purple-600 drop-shadow-lg">VISA</span>
              </div>
              
              <div className="z-10 relative mt-auto" style={{ transform: 'translateZ(40px)' }}>
                <p className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-[0.2em] font-mono text-3xl mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">•••• •••• •••• 4289</p>
                <div className="flex justify-between items-end">
                  <div>
                     <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-1 drop-shadow-md">Cardholder</p>
                     <p className="text-white font-black text-sm uppercase tracking-[0.2em] drop-shadow-md">ALEXANDER WANG</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                     <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-1 drop-shadow-md">Valid Thru</p>
                     <p className="text-white font-black text-sm tracking-[0.1em] drop-shadow-md">12/28</p>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-2">
           <button onClick={() => setModalState({ isOpen: true, type: 'send' })}
             className="flex-1 bg-white border border-white/10 text-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:bg-gray-200">
             <ArrowUpRight className="w-5 h-5 text-black" /> Send
           </button>
           <button onClick={() => setModalState({ isOpen: true, type: 'receive' })}
             className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 border border-purple-500/50 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:brightness-110">
             <ArrowDownLeft className="w-5 h-5 text-white" /> Receive
           </button>
        </div>

        {/* Savings Goal Card (Density enhancement) */}
        <div className="bg-[#1a1b22] border border-white/5 rounded-[2.5rem] p-6">
           <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-blue-400" />
                 </div>
                 <h3 className="text-sm font-black text-white">Savings Goal</h3>
              </div>
              <span className="text-xs font-black text-[#cca3ff]">$10.0M</span>
           </div>
           <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full w-[12%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Progress</span>
              <span className="text-[10px] text-white font-black">12.45% Complete</span>
           </div>
        </div>

        {/* Assets Section */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Portfolio</h3>
            <button className="text-[10px] text-[#cca3ff] font-black uppercase tracking-widest">Manage</button>
          </div>
          <div className="bg-[#1a1b22] border border-white/5 rounded-[2.5rem] overflow-hidden p-2">
            {assets.map((asset, idx) => (
              <div key={asset.id} className={`flex items-center justify-between px-4 py-4 ${idx < assets.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#121318] border border-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <div className="scale-[0.7]">{asset.icon}</div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-white leading-tight">{asset.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-1">{asset.balance} {asset.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white leading-tight">{asset.value}</p>
                  <span className="text-[10px] font-black text-green-400 uppercase mt-1 inline-block">{asset.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        </div>

      {/* ─── DESKTOP LAYOUT (unchanged) ─── */}
      <div className="hidden lg:block p-10 min-h-screen pb-24 space-y-10 relative">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="relative z-10 space-y-2">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent drop-shadow-2xl">
              My Wallet.
            </h1>
            <p className="text-xl text-gray-400 font-medium tracking-wide">Your entire financial ecosystem in one view.</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <button onClick={() => setModalState({ isOpen: true, type: 'deposit' })} className="px-8 py-4 bg-[#0A0A0B] border-2 border-white/5 hover:border-purple-500/30 text-white rounded-3xl transition-all duration-300 font-bold text-lg flex items-center gap-2 hover:-translate-y-1 shadow-2xl hover:shadow-[0_15px_40px_rgba(168,85,247,0.2)]">
              <Plus className="w-5 h-5" /> Deposit
            </button>
          </div>
        </div>

        {/* Balance Dashboard */}
        <div className="bg-gradient-to-br from-[#120524] via-[#0A0514] to-[#0A0A0E] border border-purple-500/20 rounded-[3rem] p-14 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-700 shadow-2xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[200px] -mr-40 -mt-40 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[150px] -ml-20 -mb-20 pointer-events-none"></div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <WalletIcon className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-purple-200 text-base font-bold tracking-widest uppercase">Live Available Balance</p>
              </div>
              <h2 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl leading-none">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <div className="flex flex-row gap-6">
                <button onClick={() => setModalState({ isOpen: true, type: 'send' })} className="flex-1 bg-white hover:bg-gray-200 text-black py-6 rounded-[2rem] font-black text-2xl transition-all duration-300 flex items-center justify-center gap-4 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(255,255,255,0.3)]">
                  <ArrowUpRight className="w-8 h-8" /> Send
                </button>
                <button onClick={() => setModalState({ isOpen: true, type: 'receive' })} className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white py-6 rounded-[2rem] font-black text-2xl transition-all duration-300 flex items-center justify-center gap-4 shadow-[0_15px_40px_rgba(168,85,247,0.4)] hover:-translate-y-1">
                  <ArrowDownLeft className="w-8 h-8" /> Receive
                </button>
              </div>
            </div>
            <div 
              className="hidden xl:flex flex-col justify-center items-center relative perspective-1000 w-full h-[400px] animate-[float_6s_ease-in-out_infinite]"
              onClick={() => { if(!isCardExpanded) setIsCardExpanded(true); else setIsCardExpanded(false); }}
            >
              
              {/* Card 3: Back Angle */}
              <div 
                 onClick={(e) => handleCardClick(e, 3)}
                 className={`absolute w-[360px] h-[225px] bg-gradient-to-br from-[#121217] via-[#1c1d24] to-[#0A0A0E] border border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.9)] transition-all duration-700 transform flex flex-col justify-between overflow-hidden cursor-pointer ${getCardPositionClasses(3)}`}
              >
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>
                 <div className="w-full h-12 bg-gradient-to-b from-black via-[#0a0a0a] to-black mt-6 shadow-[0_2px_10px_rgba(0,0,0,0.5)] border-y border-white/5 relative z-10"></div>
                 <div className="mt-6 flex justify-between items-start w-full px-6 relative z-10">
                    <div className="text-[7px] text-gray-400 uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">
                      This card is the property of FinEdge Bank NA. <br/>
                      If found, return to: 1 FinEdge Plaza, NY 10001 <br/>
                      <span className="text-white font-bold mt-1 block">Support: +1 (800) 555-0199</span>
                    </div>
                 </div>
                 <div className="w-full bg-gradient-to-r from-gray-300 to-gray-100 h-10 rounded-sm mt-auto mb-6 mx-4 flex items-center justify-end px-4 relative max-w-[80%] self-center shadow-inner">
                    <div className="absolute left-0 top-0 bottom-0 w-[85%] bg-gradient-to-r from-gray-400/20 to-transparent" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)' }}></div>
                    <span className="font-mono text-sm font-black text-black italic relative z-10 tracking-widest drop-shadow-sm">821</span>
                 </div>
              </div>

              {/* Card 2: Side Angle */}
              <div 
                 onClick={(e) => handleCardClick(e, 2)}
                 className={`absolute w-[360px] h-[225px] bg-gradient-to-tl from-[#1A1A24] via-[#2D2E3A] to-[#121217] border border-purple-500/30 rounded-[2rem] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.95)] transition-all duration-700 transform flex flex-col justify-between overflow-hidden cursor-pointer ${getCardPositionClasses(2)}`}
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-500/10 pointer-events-none"></div>
                 <div className="absolute right-0 bottom-0 w-48 h-48 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                 
                 <div className="flex justify-between items-center w-full relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-10 rounded-md border border-[#8B6508] bg-gradient-to-br from-[#E6C27A] via-[#D4AF37] to-[#AA7C11] flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                           <div className="w-full h-px bg-[#8B6508]/50 absolute top-1/3"></div>
                           <div className="w-full h-px bg-[#8B6508]/50 absolute top-2/3"></div>
                           <div className="w-px h-full bg-[#8B6508]/50 absolute left-1/2"></div>
                       </div>
                       <Wifi className="w-6 h-6 text-gray-400 rotate-90 opacity-80" strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-purple-600 drop-shadow-lg">VISA</span>
                 </div>
                 
                 <div className="z-10 mt-auto relative">
                    <p className="text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-500 tracking-[0.25em] font-mono text-xl mb-2 text-right drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">4111 2222 3333 4289</p>
                    <div className="flex justify-between items-end">
                       <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">Valid Thru 12/28</p>
                       <p className="text-gray-300 font-black text-sm uppercase tracking-[0.2em] text-right drop-shadow-md">ALEXANDER WANG</p>
                    </div>
                 </div>
              </div>

              {/* Card 1: Front Angle */}
              <div 
                 onClick={(e) => handleCardClick(e, 1)}
                 className={`absolute w-[380px] h-[240px] bg-gradient-to-tr from-[#14151B] via-[#292A38] to-[#121217] border border-white/20 rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-700 transform shadow-[0_50px_100px_rgba(0,0,0,1)] overflow-hidden cursor-pointer ${getCardPositionClasses(1)}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),_transparent_50%)] pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay"></div>
                
                <div className="flex justify-between items-start z-10 w-full relative">
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                        <WalletIcon className="w-5 h-5 text-white" />
                     </div>
                     <span className="text-white font-black text-xl tracking-tighter drop-shadow-lg">FinEdge</span>
                  </div>
                  <span className="text-2xl font-black italic tracking-widest text-gray-500/50 mix-blend-overlay">VISA</span>
                </div>
                
                <div className="z-10 relative mt-auto">
                  <p className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-[0.2em] font-mono text-2xl mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">•••• •••• •••• 4289</p>
                  <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-2">
                    <p className="text-white font-black text-lg uppercase tracking-[0.2em] drop-shadow-md">Premium Metal</p>
                    <div className="flex items-center gap-1">
                       <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                       <span className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Assets + Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-black mb-5">Your Assets</h3>
            <div className="space-y-4">
              {assets.map((asset) => (
                <div key={asset.id} className={`bg-[#0D0D0E] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between hover:-translate-y-1 hover:bg-[#121214] transition-all duration-500 cursor-pointer ${asset.borderHover} ${asset.glow} group`}>
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-[2rem] bg-black border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner shrink-0">
                      {asset.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-2xl text-white group-hover:text-purple-400 transition-colors mb-1">{asset.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-base text-gray-500 font-bold bg-white/5 px-2 py-0.5 rounded-lg">{asset.symbol}</span>
                        <span className={`text-base font-black px-2 py-0.5 rounded-lg flex border ${asset.change.startsWith('+') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>{asset.change}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <h4 className="font-black text-2xl text-white tracking-tighter mb-1">{asset.value}</h4>
                    <p className="text-base text-gray-400 font-bold">{asset.balance} {asset.symbol}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black mb-5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0D0D0E] border border-white/5 rounded-[2.5rem] p-8 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-[0_15px_40px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[200px]">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Percent className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white mb-1">Stake & Earn</h4>
                  <p className="text-sm text-gray-400 font-medium">Up to 12% APY</p>
                </div>
              </div>
              <div className="bg-[#0D0D0E] border border-white/5 rounded-[2.5rem] p-8 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[200px]">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white mb-1">View Analytics</h4>
                  <p className="text-sm text-gray-400 font-medium">Full reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Wallet;
