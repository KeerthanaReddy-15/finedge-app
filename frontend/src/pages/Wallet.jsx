import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, RefreshCw, Bitcoin, CreditCard, DollarSign, Wallet as WalletIcon, ArrowRight, Activity, Percent, X, CheckCircle, AlertOctagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [modalState, setModalState] = useState({ isOpen: false, type: null }); // 'deposit', 'send', 'receive'
  const [txStatus, setTxStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [txMessage, setTxMessage] = useState('');
  
  // Form Inputs
  const [amount, setAmount] = useState('');
  const [targetEmail, setTargetEmail] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('finedgeToken');

  useEffect(() => {
    if (!token) return; // Allow mock viewing, but it will fail network
    fetchBalance();
  }, [token]);

  const fetchBalance = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setBalance(data.balance);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setTxStatus('loading');
    setTimeout(async () => {
       try {
         const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wallet/deposit`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
           body: JSON.stringify({ amount })
         });
         const data = await res.json();
         if (res.ok) {
           setBalance(data.balance);
           setTxStatus('success');
           setTxMessage(`Successfully deposited $${parseInt(amount).toLocaleString()} into your wallet.`);
         } else {
           setTxStatus('error');
           setTxMessage(data.error || 'Deposit failed');
         }
       } catch (err) {
         setTxStatus('error');
         setTxMessage('Network Error');
       }
    }, 1000);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTxStatus('loading');
    setTimeout(async () => {
       try {
         const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wallet/transfer`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
           body: JSON.stringify({ targetEmail, amount })
         });
         const data = await res.json();
         if (res.ok) {
           setBalance(data.balance);
           setTxStatus('success');
           setTxMessage(`Successfully transferred $${parseInt(amount).toLocaleString()} to ${data.receiverEmail}.`);
         } else {
           setTxStatus('error');
           setTxMessage(data.error || 'Transfer failed');
         }
       } catch (err) {
         setTxStatus('error');
         setTxMessage('Network Error');
       }
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

  return (
    <div className="p-6 md:p-12 min-h-screen text-white/90 pb-24 space-y-12 relative">
      
      {/* Huge Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent drop-shadow-2xl">
            My Wallet.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium tracking-wide">
            Your entire financial ecosystem in one view.
          </p>
        </div>
        <div className="flex gap-6 relative z-10">
          <button onClick={() => setModalState({ isOpen: true, type: 'deposit' })} className="px-8 py-4 bg-[#0A0A0B] border-2 border-white/5 hover:border-purple-500/30 text-white rounded-3xl transition-all duration-300 font-bold text-lg flex items-center gap-3 hover:-translate-y-1 shadow-2xl hover:shadow-[0_15px_40px_rgba(168,85,247,0.2)]">
            <Plus className="w-6 h-6" /> Deposit Asset
          </button>
        </div>
      </div>

      {/* Epic Full-Width Balance Dashboard */}
      <div className="bg-gradient-to-br from-[#120524] via-[#0A0514] to-[#0A0A0E] border border-purple-500/20 rounded-[3rem] p-10 md:p-16 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-700 shadow-2xl">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[200px] -mr-40 -mt-40 pointer-events-none group-hover:bg-purple-500/40 transition-all duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[150px] -ml-20 -mb-20 pointer-events-none group-hover:bg-blue-500/30 transition-all duration-1000"></div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 relative z-10">
           
           <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                   <WalletIcon className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-purple-200 text-2xl font-bold tracking-widest uppercase">Live Available Balance</p>
              </div>
              
              <h2 className="text-7xl md:text-[7rem] font-black text-white mb-8 tracking-tighter drop-shadow-2xl leading-none">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <button onClick={() => setModalState({ isOpen: true, type: 'send' })} className="flex-1 bg-white hover:bg-gray-200 text-black py-6 rounded-[2rem] font-black text-2xl transition-all duration-300 flex items-center justify-center gap-4 hover:-translate-y-2 hover:shadow-[0_15px_50px_rgba(255,255,255,0.3)]">
                  <ArrowUpRight className="w-8 h-8" /> Send
                </button>
                <button onClick={() => setModalState({ isOpen: true, type: 'receive' })} className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white py-6 rounded-[2rem] font-black text-2xl transition-all duration-300 flex items-center justify-center gap-4 shadow-[0_15px_40px_rgba(168,85,247,0.4)] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(168,85,247,0.6)]">
                  <ArrowDownLeft className="w-8 h-8" /> Receive
                </button>
              </div>
           </div>

           {/* Linked Card Integration inside Desktop Dashboard */}
           <div className="hidden xl:flex flex-col justify-end items-end relative perspective-1000">
              <div className="w-[80%] h-[320px] bg-gradient-to-tr from-[#1A1A1F] via-[#2A2A35] to-[#1A1A1F] border border-white/20 rounded-[3rem] p-10 flex flex-col justify-between transition-all duration-700 hover:rotate-y-[10deg] hover:rotate-x-[5deg] hover:scale-105 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] cursor-pointer overflow-hidden transform-gpu group">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
                 
                 <div className="flex justify-between items-start z-10 w-full relative">
                    <CreditCard className="w-14 h-14 text-purple-400 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] transition-transform" />
                    <span className="text-3xl font-black italic tracking-widest text-white/50">VISA</span>
                 </div>
                 
                 <div className="z-10 relative">
                   <p className="text-white/80 tracking-[0.25em] font-mono text-3xl mb-4 text-shadow-sm group-hover:text-white transition-colors">•••• •••• •••• 4289</p>
                   <div className="flex justify-between items-end">
                      <p className="text-white font-black text-2xl uppercase tracking-widest drop-shadow-md">FinEdge Premium</p>
                      <p className="text-white/60 font-mono text-xl">12/28</p>
                   </div>
                 </div>
              </div>
           </div>

        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
         {/* Massive Asset Grid */}
         <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black">Your Assets</h3>
            </div>
            
            <div className="space-y-6">
              {assets.map((asset) => (
                <div key={asset.id} className={`bg-[#0D0D0E] border border-white/5 rounded-[2.5rem] p-8 md:p-10 flex items-center justify-between hover:-translate-y-2 hover:bg-[#121214] transition-all duration-500 cursor-pointer ${asset.borderHover} ${asset.glow} group`}>
                   <div className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-[2rem] bg-black border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                         {asset.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-3xl text-white group-hover:text-purple-400 transition-colors mb-2">{asset.name}</h4>
                        <div className="flex items-center gap-3">
                           <span className="text-xl text-gray-500 font-bold bg-white/5 px-3 py-1 rounded-xl">{asset.symbol}</span>
                           <span className={`text-lg font-black px-3 py-1 rounded-xl flex border ${asset.change.startsWith('+') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                             {asset.change}
                           </span>
                        </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <h4 className="font-black text-4xl text-white tracking-tighter mb-2">{asset.value}</h4>
                      <p className="text-xl text-gray-400 font-bold">{asset.balance} {asset.symbol}</p>
                   </div>
                </div>
              ))}
            </div>
         </div>

         {/* Quick Activity Massive Action Card */}
         <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0D0D0E] border border-white/5 rounded-[2.5rem] p-8 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-[0_15px_40px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[200px]">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Percent className="w-8 h-8 text-purple-400" />
                 </div>
                 <div>
                    <h4 className="text-2xl font-black text-white mb-2">Stake & Earn</h4>
                    <p className="text-gray-400 font-medium">Up to 12% APY</p>
                 </div>
              </div>
              <div className="bg-[#0D0D0E] border border-white/5 rounded-[2.5rem] p-8 hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[200px]">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="w-8 h-8 text-blue-400" />
                 </div>
                 <div>
                    <h4 className="text-2xl font-black text-white mb-2">View Analytics</h4>
                    <p className="text-gray-400 font-medium">Full reports</p>
                 </div>
              </div>
            </div>
         </div>
      </div>

      {/* Massive Transaction Overlays */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal}></div>
          
          <div className={`relative bg-[#0A0912] border border-white/10 w-full max-w-2xl rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden transition-all duration-500 transform ${txStatus === 'success' ? 'scale-105 border-green-500/50 shadow-[0_0_100px_rgba(34,197,94,0.3)]' : txStatus === 'error' ? 'scale-[0.98] border-red-500/50 shadow-[0_0_100px_rgba(239,68,68,0.3)]' : 'scale-100'}`}>
            
            <button onClick={closeModal} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20">
               <X className="w-8 h-8 text-white" />
            </button>

            {txStatus === 'idle' && (
              <div className="p-12">
                 <h2 className="text-5xl font-black mb-2">{modalState.type === 'deposit' ? 'Add Funds' : modalState.type === 'send' ? 'Send Money' : 'Receive'}</h2>
                 <p className="text-xl text-gray-400 mb-10">
                   {modalState.type === 'deposit' ? 'Instantly pull directly from your linked FinEdge Premium VISA.' : 
                    modalState.type === 'send' ? 'Transfer directly to any user on the FinEdge network instantly.' : 
                    'Share this secure code to request funds.'}
                 </p>

                 {modalState.type === 'receive' ? (
                   <div className="flex flex-col items-center justify-center text-center py-8">
                      <div className="w-64 h-64 bg-white rounded-3xl p-4 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)] mb-8">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=finedge://pay/${token?.substring(0,10)}`} alt="QR" className="w-full h-full rounded-2xl" />
                      </div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Your Unique Payment Address</p>
                      <p className="text-2xl font-mono text-purple-400 bg-purple-500/10 px-6 py-3 rounded-2xl border border-purple-500/20">0xFE...{token?.substring(0,8) || 'MockAddr'}</p>
                   </div>
                 ) : (
                   <form onSubmit={modalState.type === 'deposit' ? handleDeposit : handleTransfer} className="space-y-6">
                     
                     {modalState.type === 'send' && (
                       <div className="space-y-2">
                         <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Recipient Email</label>
                         <input 
                           type="email" required placeholder="target@finedge.app"
                           value={targetEmail} onChange={(e)=>setTargetEmail(e.target.value)}
                           className="w-full bg-black border border-white/10 focus:border-purple-500/50 rounded-[1.5rem] py-5 px-6 text-2xl text-white outline-none"
                         />
                       </div>
                     )}

                     <div className="space-y-2 relative">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-2">Amount (USD)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-500" />
                          <input 
                            type="number" required placeholder="0.00" min="1"
                            value={amount} onChange={(e)=>setAmount(e.target.value)}
                            className="w-full bg-black border border-white/10 focus:border-purple-500/50 rounded-[1.5rem] py-6 pl-16 pr-8 text-4xl font-black text-white outline-none"
                          />
                        </div>
                     </div>

                     <button type="submit" className="w-full py-6 mt-8 rounded-[1.5rem] bg-white hover:bg-gray-200 text-black text-3xl font-black transition-all flex items-center justify-center gap-4 hover:-translate-y-1 shadow-xl">
                        {modalState.type === 'deposit' ? 'Confirm Deposit' : 'Initiate Transfer'} <ArrowRight className="w-8 h-8" />
                     </button>
                   </form>
                 )}
              </div>
            )}

            {txStatus === 'loading' && (
              <div className="p-24 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/10 animate-pulse pointer-events-none"></div>
                <div className="w-24 h-24 border-8 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-8"></div>
                <h3 className="text-4xl font-black text-white">Processing Data</h3>
                <p className="text-xl text-gray-400 mt-4 font-medium">Securing transaction payload on FinEdge Ledger...</p>
              </div>
            )}

            {txStatus === 'success' && (
              <div className="p-24 flex flex-col items-center justify-center text-center relative">
                <div className="absolute inset-0 bg-green-500/10 pointer-events-none"></div>
                <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-green-500/30">
                  <CheckCircle className="w-20 h-20 text-green-400" />
                </div>
                <h3 className="text-5xl font-black text-white mb-4">Transaction Confirmed</h3>
                <p className="text-2xl text-green-400 font-bold max-w-md">{txMessage}</p>
                <button onClick={closeModal} className="mt-12 px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white font-bold text-xl transition-all">Close Window</button>
              </div>
            )}

            {txStatus === 'error' && (
              <div className="p-24 flex flex-col items-center justify-center text-center relative">
                <div className="absolute inset-0 bg-red-500/10 pointer-events-none"></div>
                <div className="w-32 h-32 bg-red-500/20 rounded-full flex items-center justify-center mb-8 border-4 border-red-500/30">
                  <AlertOctagon className="w-20 h-20 text-red-500" />
                </div>
                <h3 className="text-5xl font-black text-white mb-4">Transaction Failed</h3>
                <p className="text-2xl text-red-400 font-bold max-w-md">{txMessage}</p>
                <button onClick={() => setTxStatus('idle')} className="mt-12 px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white font-bold text-xl transition-all">Try Again</button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
