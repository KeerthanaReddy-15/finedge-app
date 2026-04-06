import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, RefreshCw, Bitcoin, CreditCard, DollarSign, Wallet as WalletIcon, ArrowRight, Activity, Percent, X, CheckCircle, AlertOctagon } from 'lucide-react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [modalState, setModalState] = useState({ isOpen: false, type: null });
  const [txStatus, setTxStatus] = useState('idle');
  const [txMessage, setTxMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [targetEmail, setTargetEmail] = useState('');

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

      <SharedModal />

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="lg:hidden">
        <div className="max-w-[430px] mx-auto px-4 py-5 space-y-4">

          {/* Header actions (Deposit) moved to TopBar or refined here */}
          <div className="flex justify-end">
            <button onClick={() => setModalState({ isOpen: true, type: 'deposit' })}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-[0_4px_15px_rgba(168,85,247,0.4)]">
              <Plus className="w-4 h-4" /> Deposit
            </button>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl p-6 shadow-[0_8px_32px_rgba(168,85,247,0.35)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <WalletIcon className="w-4 h-4 text-purple-200" />
                <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest">Available Balance</p>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-5">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>
              <div className="flex gap-3">
                <button onClick={() => setModalState({ isOpen: true, type: 'send' })}
                  className="flex-1 bg-white/20 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <ArrowUpRight className="w-4 h-4" /> Send
                </button>
                <button onClick={() => setModalState({ isOpen: true, type: 'receive' })}
                  className="flex-1 bg-white text-purple-700 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <ArrowDownLeft className="w-4 h-4" /> Receive
                </button>
              </div>
            </div>
          </div>

          {/* Assets */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Your Assets</h3>
            <div className="bg-[#0f0f13] border border-white/8 rounded-2xl overflow-hidden">
              {assets.map((asset, idx) => (
                <div key={asset.id} className={`flex items-center justify-between px-4 py-4 ${idx < assets.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      <div className="scale-[0.58]">{asset.icon}</div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{asset.name}</p>
                      <p className="text-xs text-gray-500">{asset.balance} {asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{asset.value}</p>
                    <span className="text-xs font-bold text-green-400">{asset.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0f0f13] border border-white/8 rounded-2xl p-4 flex flex-col gap-3 cursor-pointer hover:border-purple-500/30 transition-all active:scale-95">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Percent className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">Stake & Earn</p>
                  <p className="text-xs text-gray-500">Up to 12% APY</p>
                </div>
              </div>
              <div className="bg-[#0f0f13] border border-white/8 rounded-2xl p-4 flex flex-col gap-3 cursor-pointer hover:border-blue-500/30 transition-all active:scale-95">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">Analytics</p>
                  <p className="text-xs text-gray-500">Full reports</p>
                </div>
              </div>
            </div>
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
            <div className="hidden xl:flex flex-col justify-end items-end relative">
              <div className="w-[80%] h-[300px] bg-gradient-to-tr from-[#1A1A1F] via-[#2A2A35] to-[#1A1A1F] border border-white/20 rounded-[3rem] p-10 flex flex-col justify-between hover:scale-105 transition-all duration-700 cursor-pointer overflow-hidden group">
                <div className="flex justify-between items-start z-10 w-full relative">
                  <CreditCard className="w-12 h-12 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                  <span className="text-2xl font-black italic tracking-widest text-white/50">VISA</span>
                </div>
                <div className="z-10 relative">
                  <p className="text-white/80 tracking-[0.2em] font-mono text-2xl mb-3">•••• •••• •••• 4289</p>
                  <div className="flex justify-between items-end">
                    <p className="text-white font-black text-xl uppercase tracking-widest">FinEdge Premium</p>
                    <p className="text-white/60 font-mono text-lg">12/28</p>
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
