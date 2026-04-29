import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldAlert, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';
import heroImage from '../assets/hero_illustration.png';
import './Landing.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      setIsSent(true);
      if (data.devResetUrl) {
         setResetLink(data.devResetUrl);
      }
    } catch (err) {
      alert('Network error connecting to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-container min-h-screen relative text-white font-sans overflow-hidden bg-[#121318]">
      
      {/* Immersive 3D Background */}
      <div className="hero-bg-layer pointer-events-none">
        <div className="hero-bg-gradient-overlay"></div>
        <img src={heroImage} alt="FinEdge Background" className="hero-bg-image opacity-70" />
      </div>

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="lg:hidden relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-8">
         <div className="max-w-[430px] mx-auto w-full">
            <Link to="/" style={{ textDecoration: 'none' }} className="flex flex-col items-center gap-0.5 cursor-pointer mb-8 animate-[fadeInUp_0.8s_ease-out_forwards] group">
               <div className="flex items-center gap-2">
                   <svg className="w-8 h-8 text-slate-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                   </svg>
                   <span className="font-extrabold text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-600">FinEdge</span>
               </div>
               <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 pl-10 group-hover:text-slate-400 transition-colors">Go Cashless Go FinEdge</span>
            </Link>

            <div className="w-full bg-[#1a1b22] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl animate-[fadeInUp_1s_ease-out_forwards]">
               <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-[#cca3ff] font-bold mb-8 w-fit transition-all text-xs uppercase tracking-widest">
                 <ArrowLeft className="w-4 h-4" /> Back to Login
               </Link>

               {!isSent ? (
                  <>
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-[#2d1b4e] rounded-xl flex items-center justify-center border border-purple-500/20">
                           <ShieldAlert className="w-6 h-6 text-[#cca3ff]" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">Reset Form.</h2>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Registered Email</label>
                           <div className="relative">
                              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                              <input 
                                 type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                                 className="w-full bg-[#f2f4ff] border-none focus:ring-2 focus:ring-[#cca3ff] rounded-2xl py-4 pl-12 pr-4 text-base font-bold text-black placeholder-gray-400 outline-none transition-all shadow-sm"
                              />
                           </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full py-4 mt-8 rounded-2xl bg-white hover:bg-gray-200 text-black text-lg font-black transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-70 active:scale-95">
                           {isLoading ? 'Processing...' : <>Send Link <ArrowRight className="w-6 h-6" /></>}
                        </button>
                     </form>
                  </>
               ) : (
                  <div className="text-center py-6 animate-[fadeInUp_0.8s_ease-out_forwards]">
                     <div className="w-20 h-20 bg-[#2d1b4e]/50 rounded-full flex items-center justify-center border border-purple-500/20 mx-auto mb-6">
                        <Mail className="w-8 h-8 text-[#cca3ff]" />
                     </div>
                     <h2 className="text-2xl font-bold text-white mb-2">Check Inbox.</h2>
                     <p className="text-sm text-gray-400 font-medium mb-8 p-4 bg-black/20 rounded-2xl border border-white/5">{email}</p>

                     {resetLink && (
                        <div className="mb-8 text-left bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl">
                           <p className="text-[#cca3ff] font-bold text-[10px] uppercase tracking-widest mb-2 text-center">Dev Environment Link</p>
                           <a href={resetLink} className="text-white hover:underline break-all text-xs block text-center opacity-70 italic">{resetLink}</a>
                        </div>
                     )}

                     <button onClick={() => setIsSent(false)} className="text-xs font-bold text-gray-500 hover:text-white transition-colors tracking-widest uppercase">
                        Use different email
                     </button>
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* ─── DESKTOP LAYOUT ─── */}
      <div className="hidden lg:flex relative z-10 w-full min-h-screen flex-row items-center justify-center px-8 max-w-full mx-auto gap-20 xl:gap-32">
         
         {/* Left Side: Massive Typography */}
         <div className="hidden md:flex w-full md:w-[600px] flex-col justify-center animate-[fadeInUp_0.8s_ease-out_forwards]">
            <Link to="/" style={{ textDecoration: 'none' }} className="flex flex-col items-start gap-0 cursor-pointer mb-10 w-fit group hover:opacity-100">
               <div className="flex items-center gap-2">
                   <svg className="w-9 h-9 text-slate-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                   </svg>
                   <span className="font-extrabold text-4xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-600">FinEdge</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 pl-11 group-hover:text-slate-400 transition-colors">Go Cashless Go FinEdge</span>
            </Link>

            <h1 className="text-[5rem] md:text-[6.5rem] xl:text-[7.5rem] font-bold tracking-tighter leading-[0.95] text-white">
              Lost access? <br/>
              <span className="text-[#cca3ff]">We got you.</span>
            </h1>
            <p className="mt-6 text-2xl text-gray-300 font-medium max-w-[90%] leading-relaxed">
              Verify your identity and regain control of your assets instantly.
            </p>
         </div>

         {/* Right Side: Dark Glass Form */}
         <div className="w-full md:w-auto flex justify-center">
            <div className="w-full min-w-[600px] max-w-[600px] bg-[#1a1b22] border border-white/5 rounded-[3rem] p-16 shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative z-10 animate-[fadeInUp_1s_ease-out_forwards]">
               
               <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-white font-bold mb-10 w-fit transition-colors relative z-10">
                 <ArrowLeft className="w-5 h-5" /> Return to Login
               </Link>

               {!isSent ? (
                  <>
                     <div className="flex items-center gap-5 mb-12">
                        <div className="w-16 h-16 bg-[#2d1b4e] rounded-2xl flex items-center justify-center border border-purple-500/20">
                           <ShieldAlert className="w-8 h-8 text-[#cca3ff]" />
                        </div>
                        <h2 className="text-5xl font-bold text-white">Reset Form.</h2>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-8">
                       <div className="space-y-3">
                         <label className="text-[0.8rem] font-bold text-gray-400 uppercase tracking-widest pl-4">Registered Email</label>
                         <div className="relative">
                           <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 z-10" />
                           <input 
                             type="email" 
                             required
                             value={email}
                             onChange={(e) => setEmail(e.target.value)}
                             placeholder="you@example.com"
                             className="w-full bg-[#f2f4ff] border-none focus:ring-2 focus:ring-[#cca3ff] rounded-[1.5rem] py-5 pl-14 pr-6 text-[1.1rem] font-bold text-black placeholder-gray-400 outline-none transition-all shadow-sm"
                           />
                         </div>
                       </div>

                       <button 
                         type="submit" 
                         disabled={isLoading}
                         className="w-full py-5 mt-10 rounded-[1.5rem] bg-white hover:bg-gray-200 text-black text-[1.25rem] font-black transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-xl disabled:opacity-70"
                       >
                         {isLoading ? 'Encrypting Payload...' : <><ArrowRight className="w-7 h-7" /> Send Security Link</>}
                       </button>
                     </form>
                  </>
               ) : (
                  <div className="text-center py-6 relative z-10 animate-[fadeInUp_0.8s_ease-out_forwards]">
                     <div className="w-24 h-24 bg-[#2d1b4e]/50 rounded-full flex items-center justify-center border border-purple-500/20 mx-auto mb-8 shadow-[0_0_20px_rgba(204,163,255,0.2)]">
                        <Mail className="w-10 h-10 text-[#cca3ff]" />
                     </div>
                     <h2 className="text-4xl font-bold text-white mb-4">Inbox Check Required.</h2>
                     <p className="text-[1.1rem] text-gray-400 font-medium mb-10 leading-relaxed">
                       We deployed a secure tunnel link to <br/>
                       <span className="text-[#cca3ff] bg-[#2d1b4e]/40 px-3 py-1.5 rounded-xl inline-block mt-4 border border-purple-500/20 font-bold">{email}</span>
                     </p>

                     {resetLink && (
                        <div className="mb-10 text-left bg-[#f2f4ff]/10 border border-white/10 p-6 rounded-2xl relative z-20">
                           <p className="text-white font-bold mb-3 uppercase tracking-widest text-sm text-center">Development Mode Link</p>
                           <a href={resetLink} className="text-[#cca3ff] hover:text-purple-300 break-all underline block text-center bg-black/40 p-4 rounded-xl border border-white/10">{resetLink}</a>
                        </div>
                     )}

                     <button 
                        onClick={() => setIsSent(false)}
                        className="text-gray-400 font-bold hover:text-white transition-colors tracking-wide uppercase text-sm mt-4"
                     >
                        Initiate override for different email
                     </button>
                  </div>
               )}

            </div>
         </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
