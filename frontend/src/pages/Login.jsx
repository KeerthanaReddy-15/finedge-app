import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
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
      const response = await fetch(`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
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

      <div className="relative z-10 w-full h-screen flex flex-col md:flex-row items-center justify-center px-8 max-w-full mx-auto gap-16 md:gap-20 xl:gap-32">
         
         {/* Left Side: Massive Typography */}
         <div className="w-full md:w-[600px] flex flex-col justify-center animate-[fadeInUp_0.8s_ease-out_forwards]">
            <Link to="/" className="flex items-center gap-3 cursor-pointer mb-10 w-fit">
               <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
               </svg>
               <span className="font-extrabold text-4xl tracking-tight text-white">
                 FinEdge
               </span>
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
            <div className="w-full min-w-[600px] max-w-[600px] bg-[#1a1b22] border border-white/5 rounded-[3rem] p-16 shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative z-10 animate-[fadeInUp_1s_ease-out_forwards]">
               
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
