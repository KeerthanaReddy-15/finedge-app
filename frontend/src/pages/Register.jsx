import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { Mail, Lock, ArrowRight, TrendingUp } from 'lucide-react';
import heroImage from '../assets/hero_illustration.png';
import './Landing.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let score = 0;
    if (password.length > 7) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    setStrength(score);
  }, [password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (strength < 50) return setErrorMsg('Password is too weak. Meet all requirements below.');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
         navigate('/login');
      } else {
         setErrorMsg(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-[#E36C38]';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-[#cca3ff] shadow-[0_0_20px_rgba(204,163,255,0.6)]';
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
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[#2d1b4e] rounded-xl flex items-center justify-center border border-purple-500/20">
                     <TrendingUp className="w-6 h-6 text-[#cca3ff]" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Sign up.</h2>
               </div>

               <form onSubmit={handleRegister} className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Business Email</label>
                   <div className="relative">
                     <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                     <input 
                       type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@company.com"
                       className="w-full bg-[#f2f4ff] border-none focus:ring-2 focus:ring-[#cca3ff] rounded-2xl py-4 pl-12 pr-4 text-base font-bold text-black placeholder-gray-400 outline-none transition-all shadow-sm"
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Secure Password</label>
                   <div className="relative">
                     <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                     <input 
                       type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"
                       className="w-full bg-[#f2f4ff] border-none focus:ring-2 focus:ring-[#cca3ff] rounded-2xl py-4 pl-12 pr-4 text-base font-bold text-black placeholder-gray-400 outline-none transition-all shadow-sm"
                     />
                   </div>
                 </div>

                 {password.length > 0 && (
                   <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-xs font-bold text-gray-500 pl-2 pr-2">
                         <span className="uppercase tracking-widest">Strength</span>
                         <span className={`${strength === 100 ? 'text-[#cca3ff]' : 'text-gray-400'}`}>
                            {strength === 100 ? 'IRONCLAD' : strength >= 75 ? 'STRONG' : strength >= 50 ? 'FAIR' : 'WEAK'}
                         </span>
                      </div>
                      <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden mx-1 max-w-[95%]">
                         <div className={`h-full transition-all duration-700 ease-out ${getStrengthColor()}`} style={{ width: `${strength}%` }}></div>
                      </div>
                   </div>
                 )}

                 {errorMsg && (
                   <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-bold text-center">
                     {errorMsg}
                   </div>
                 )}

                 <button 
                   type="submit" disabled={isLoading || strength < 50}
                   className="w-full py-4 mt-8 rounded-2xl bg-white hover:bg-gray-200 text-black text-lg font-black transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-95"
                 >
                   {isLoading ? 'Creating Gateway...' : <>Generate Access <ArrowRight className="w-6 h-6" /></>}
                 </button>
               </form>

               <p className="mt-8 text-center text-gray-400 text-xs font-medium">
                 Already inside? <Link to="/login" className="text-white font-bold hover:text-[#cca3ff] transition-colors hover:underline ml-1">Log in</Link>
               </p>
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
              Claim your <br/>
              <span className="text-[#cca3ff]">advantage.</span>
            </h1>
            <p className="mt-6 text-2xl text-gray-300 font-medium max-w-[90%] leading-relaxed">
              The world's most advanced payment API is just a click away.
            </p>
         </div>

         {/* Right Side: Dark Glass Form */}
         <div className="w-full md:w-auto flex justify-center">
            <div className="w-full max-w-[600px] md:min-w-[600px] bg-[#1a1b22] border border-white/5 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-16 shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative z-10 animate-[fadeInUp_1s_ease-out_forwards]">
               
               <div className="flex items-center gap-5 mb-12">
                  <div className="w-16 h-16 bg-[#2d1b4e] rounded-2xl flex items-center justify-center border border-purple-500/20">
                     <TrendingUp className="w-8 h-8 text-[#cca3ff]" />
                  </div>
                  <h2 className="text-5xl font-bold text-white">Sign up.</h2>
               </div>

               <form onSubmit={handleRegister} className="space-y-8">
                 <div className="space-y-3">
                   <label className="text-[0.8rem] font-bold text-gray-400 uppercase tracking-widest pl-4">Business Email</label>
                   <div className="relative">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 z-10" />
                     <input 
                       type="email" 
                       required
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="hello@company.com"
                       className="w-full bg-[#f2f4ff] border-none focus:ring-2 focus:ring-[#cca3ff] rounded-[1.5rem] py-5 pl-14 pr-6 text-[1.1rem] font-bold text-black placeholder-gray-400 outline-none transition-all shadow-sm"
                     />
                   </div>
                 </div>

                 <div className="space-y-3">
                   <label className="text-[0.8rem] font-bold text-gray-400 uppercase tracking-widest pl-4">Secure Password</label>
                   <div className="relative">
                     <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 z-10" />
                     <input 
                       type="password" 
                       required
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="At least 8 characters"
                       className="w-full bg-[#f2f4ff] border-none focus:ring-2 focus:ring-[#cca3ff] rounded-[1.5rem] py-5 pl-14 pr-6 text-[1.1rem] font-bold text-black placeholder-gray-400 outline-none transition-all shadow-sm"
                     />
                   </div>
                 </div>

                 {/* Premium Password Strength Bar */}
                 {password.length > 0 && (
                   <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-xs font-bold text-gray-500 pl-4 pr-2">
                         <span className="uppercase tracking-widest">Strength</span>
                         <span className={`${strength === 100 ? 'text-[#cca3ff]' : 'text-gray-400'}`}>
                            {strength === 100 ? 'IRONCLAD' : strength >= 75 ? 'STRONG' : strength >= 50 ? 'FAIR' : 'WEAK'}
                         </span>
                      </div>
                      <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden mx-2 max-w-[95%]">
                         <div className={`h-full transition-all duration-700 ease-out ${getStrengthColor()}`} style={{ width: `${strength}%` }}></div>
                      </div>
                   </div>
                 )}

                 {errorMsg && (
                   <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-[1rem] text-[0.95rem] font-bold text-center">
                     {errorMsg}
                   </div>
                 )}

                 <button 
                   type="submit" 
                   disabled={isLoading || strength < 50}
                   className="w-full py-5 mt-10 rounded-[1.5rem] bg-white hover:bg-gray-200 text-black text-[1.25rem] font-black transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-xl disabled:opacity-50 disabled:hover:-translate-y-0"
                 >
                   {isLoading ? 'Creating Gateway...' : (
                     <>Generate Access <ArrowRight className="w-7 h-7" /></>
                   )}
                 </button>
               </form>

               <p className="mt-10 text-center text-gray-400 text-sm font-medium">
                 Already inside? <Link to="/login" className="text-white font-bold hover:text-[#cca3ff] transition-colors hover:underline ml-1">Log in</Link>
               </p>
            </div>
         </div>

      </div>
    </div>
  );
};

export default Register;
