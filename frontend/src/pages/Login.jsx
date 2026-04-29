import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import heroImage from '../assets/hero_illustration.png';
import './Landing.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
         if (data.requiresTwoFactor) {
            navigate('/2fa', { state: { token: data.token } });
         } else {
            localStorage.setItem('finedgeToken', data.token);
            navigate('/dashboard');
         }
      } else {
         alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-container min-h-screen relative text-white font-sans overflow-hidden bg-[#121318]">
      
      {/* Immersive 3D Background imported from Landing CSS */}
      <div className="hero-bg-layer pointer-events-none">
        <div className="hero-bg-gradient-overlay"></div>
        <img src={heroImage} alt="FinEdge Background" className="hero-bg-image" />
      </div>

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="lg:hidden relative z-50 w-full min-h-screen bg-[#121318] flex flex-col items-center justify-center px-4 py-8">
         <div className="max-w-[430px] mx-auto w-full">
            <Link to="/" style={{ textDecoration: 'none' }} className="flex flex-col items-center gap-0.5 cursor-pointer mb-10 animate-[fadeInUp_0.8s_ease-out_forwards] group">
               <div className="flex items-center gap-2">
                   <svg className="w-9 h-9 text-slate-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                       <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                   </svg>
                   <span className="font-extrabold text-4xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-600">FinEdge</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 pl-11 group-hover:text-slate-400 transition-colors">Go Cashless Go FinEdge</span>
            </Link>

            <div className="w-full bg-[#1a1b22] border border-white/5 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl animate-[fadeInUp_1s_ease-out_forwards]">
               <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-[#2d1b4e] rounded-2xl flex items-center justify-center border border-purple-500/20">
                     <ShieldCheck className="w-7 h-7 text-[#cca3ff]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white leading-tight">Welcome.</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Sign in to continue</p>
                  </div>
               </div>

               <form onSubmit={handleLogin} className="space-y-6">
                 <div className="space-y-2.5">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-3">Email Address</label>
                   <div className="relative">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                     <input 
                       type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                       className="w-full bg-[#f2f4ff] border-none focus:ring-2 focus:ring-[#cca3ff] rounded-2xl py-4.5 pl-14 pr-6 text-base font-bold text-black placeholder-gray-400 outline-none transition-all shadow-sm"
                     />
                   </div>
                 </div>

                 <div className="space-y-2.5">
                   <div className="flex justify-between items-center pl-3 pr-3">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Password</label>
                     <Link to="/forgot-password" className="text-[10px] font-black text-[#cca3ff] hover:text-purple-300 transition-colors uppercase tracking-widest">Forgot?</Link>
                   </div>
                   <div className="relative">
                     <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                     <input 
                       type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                       className="w-full bg-[#f2f4ff] border-none focus:ring-2 focus:ring-[#cca3ff] rounded-2xl py-4.5 pl-14 pr-6 text-base font-bold text-black placeholder-gray-400 outline-none transition-all shadow-sm"
                     />
                   </div>
                 </div>

                 <button 
                   type="submit" disabled={isLoading}
                   className="w-full py-5 mt-6 rounded-2xl bg-white hover:bg-gray-200 text-black text-xl font-black transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)] disabled:opacity-70 active:scale-95"
                 >
                   {isLoading ? 'Processing...' : <>Sign In <ArrowRight className="w-6 h-6" /></>}
                 </button>
               </form>

               <div className="mt-10 pt-8 border-t border-white/5 text-center">
                 <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                   New to the network? <Link to="/register" className="text-white hover:text-[#cca3ff] transition-colors ml-1">Create account</Link>
                 </p>
               </div>
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
              Log back <br/>
              <span className="text-[#cca3ff]">into power.</span>
            </h1>
            <p className="mt-6 text-2xl text-gray-300 font-medium max-w-[90%] leading-relaxed">
              Secure access to your unified financial ecosystem.
            </p>
         </div>

         {/* Right Side: Dark Glass Form */}
         <div className="w-full md:w-auto flex justify-center">
            <div className="w-full max-w-[600px] md:min-w-[600px] bg-[#1a1b22] border border-white/5 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-16 shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative z-10 animate-[fadeInUp_1s_ease-out_forwards]">
               
               <div className="flex items-center gap-5 mb-12">
                  <div className="w-16 h-16 bg-[#2d1b4e] rounded-2xl flex items-center justify-center border border-purple-500/20">
                     <ShieldCheck className="w-8 h-8 text-[#cca3ff]" />
                  </div>
                  <h2 className="text-5xl font-bold text-white">Welcome back.</h2>
               </div>

               <form onSubmit={handleLogin} className="space-y-8">
                 <div className="space-y-3">
                   <label className="text-[0.8rem] font-bold text-gray-400 uppercase tracking-widest pl-4">Email Address</label>
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

                 <div className="space-y-3">
                   <div className="flex justify-between items-center pl-4 pr-4">
                     <label className="text-[0.8rem] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                     <Link to="/forgot-password" className="text-[0.8rem] font-bold text-[#cca3ff] hover:text-purple-300 transition-colors">Forgot Password?</Link>
                   </div>
                   <div className="relative">
                     <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 z-10" />
                     <input 
                       type="password" 
                       required
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="••••••••"
                       className="w-full bg-[#f2f4ff] border-none focus:ring-2 focus:ring-[#cca3ff] rounded-[1.5rem] py-5 pl-14 pr-6 text-[1.1rem] font-bold text-black placeholder-gray-400 outline-none transition-all shadow-sm"
                     />
                   </div>
                 </div>

                 <button 
                   type="submit" 
                   disabled={isLoading}
                   className="w-full py-5 mt-10 rounded-[1.5rem] bg-white hover:bg-gray-200 text-black text-[1.25rem] font-black transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-xl disabled:opacity-70"
                 >
                   {isLoading ? 'Authenticating...' : (
                     <>Sign In <ArrowRight className="w-7 h-7" /></>
                   )}
                 </button>
               </form>

               <p className="mt-10 text-center text-gray-400 text-sm font-medium">
                 Need premium access? <Link to="/register" className="text-white font-bold hover:underline ml-1">Create account</Link>
               </p>
            </div>
         </div>

      </div>
    </div>
  );
};

export default Login;
