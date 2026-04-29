import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import './Landing.css';
import heroImage from '../assets/hero_illustration.png';
import companyImage from '../assets/company_art.png';

const Landing = () => {
    const navigate = useNavigate();
    const [isLangOpen, setIsLangOpen] = useState(false);
    
    const languages = [
        { code: 'en', name: 'English', flag: '🌍' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr', name: 'French', flag: '🇫🇷' },
        { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
        { code: 'te', name: 'Telugu', flag: '🇮🇳' },
        { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
        { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
        { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
        { code: 'de', name: 'German', flag: '🇩🇪' },
        { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    ];

    const handleLanguageSelect = (code) => {
        if (window.changeLanguageByButtonClick) {
            window.changeLanguageByButtonClick(code);
        }
        setIsLangOpen(false);
    };

    return (
        <div className="landing-container min-h-screen relative text-white font-sans overflow-hidden bg-[#121318]">
            {/* Background elements */}
            <div className="hero-bg-layer pointer-events-none">
                <div className="hero-bg-gradient-overlay"></div>
                <img src={heroImage} alt="FinEdge Background" className="hero-bg-image" />
            </div>

            {/* ─── MOBILE LAYOUT ─── */}
            <div className="lg:hidden relative z-50 w-full min-h-screen bg-[#121318] flex flex-col pt-6 pb-20 overflow-y-auto no-scrollbar">
                
                {/* Navbar Mobile */}
                <div className="flex items-center justify-between px-6 mb-12 animate-[fadeInDown_0.6s_ease-out]">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            <svg className="w-7 h-7 text-slate-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-600">FinEdge</span>
                        </div>
                        <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-slate-500 pl-9">Go Cashless Go FinEdge</span>
                    </div>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-[#cca3ff] active:scale-95 transition-all"
                    >
                        Login
                    </button>
                </div>

                {/* Hero Mobile */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6 space-y-8 animate-[fadeInUp_0.8s_ease-out_forwards]">
                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[0.9] text-white">
                            Unlock growth <br />
                            <span className="text-[#cca3ff]">every payment.</span>
                        </h1>
                        <p className="text-base sm:text-lg text-gray-400 font-medium max-w-[320px] mx-auto leading-relaxed">
                            Run payments, extend net terms, and automate collections compliance.
                        </p>
                    </div>
                    
                    <div className="w-full max-w-[340px] pt-4">
                        <button 
                            onClick={() => navigate('/login')} 
                            className="w-full py-5 bg-white text-black rounded-2xl font-black text-xl shadow-[0_15px_40px_rgba(255,255,255,0.1)] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            Get started free <ArrowRight className="w-6 h-6" />
                        </button>
                        <p className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">No credit card required</p>
                    </div>
                </div>

                {/* Stats Mobile (Simple Stack) */}
                <div className="mt-12 px-6 flex justify-between items-center py-8 border-t border-white/5 animate-[fadeInUp_1s_ease-out_forwards]">
                    <div className="text-center"><p className="text-xl font-black text-white">$10B+</p><p className="text-[9px] text-gray-500 font-bold uppercase">Processed</p></div>
                    <div className="w-px h-8 bg-white/5"></div>
                    <div className="text-center"><p className="text-xl font-black text-white">50k+</p><p className="text-[9px] text-gray-500 font-bold uppercase">Clients</p></div>
                    <div className="w-px h-8 bg-white/5"></div>
                    <div className="text-center"><p className="text-xl font-black text-white">99.9%</p><p className="text-[9px] text-gray-500 font-bold uppercase">Uptime</p></div>
                </div>

                {/* Mobile Footer Links */}
                <div className="px-6 flex flex-col gap-4 mt-8 animate-[fadeInUp_1s_ease-out_forwards]">
                    <a href="/terms" className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold tracking-widest text-xs uppercase active:bg-white/10 transition-colors">
                        <FileText className="w-4 h-4 text-[#cca3ff]" /> Terms & Conditions
                    </a>
                    <a href="/privacy" className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold tracking-widest text-xs uppercase active:bg-white/10 transition-colors">
                        <ShieldCheck className="w-4 h-4 text-[#cca3ff]" /> Privacy Policy
                    </a>
                </div>
            </div>

            {/* ─── DESKTOP LAYOUT ─── */}
            <div className="hidden lg:block h-screen overflow-y-auto no-scrollbar scroll-smooth">
                <nav className="landing-navbar">
                    <a href="#" style={{ textDecoration: 'none' }} className="flex flex-col items-start gap-0 hover:opacity-100 relative group">
                        <div className="flex items-center gap-2">
                            <svg className="w-8 h-8 text-slate-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span className="font-black text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-600">FinEdge</span>
                        </div>
                        <span className="text-[8.5px] font-black uppercase tracking-[0.25em] text-slate-500 pl-10 -mt-0.5 group-hover:text-slate-400 transition-colors">Go Cashless Go FinEdge</span>
                    </a>
                    <div className="navbar-links flex items-center gap-8">
                        <a href="#products" className="nav-link">Products</a>
                        <a href="#company" className="nav-link">Company</a>
                        <a href="#pricing" className="nav-link">Pricing</a>
                        
                        <a href="#languages" className="nav-link">🌍 Language</a>
                    </div>
                    <div className="navbar-actions">
                        <button onClick={() => navigate('/login')} className="btn-primary nav-btn">Get started</button>
                    </div>
                </nav>
                
                <main className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Unlock growth <br/><span className="text-[#cca3ff]">with every payment</span></h1>
                        <p className="hero-subtitle">Run payments, extend net terms and automate collections compliance.</p>
                        <div className="hero-actions">
                            <button onClick={() => navigate('/login')} className="btn-primary hero-main-btn">Get started</button>
                        </div>
                    </div>
                </main>

                <section id="products" className="landing-section pt-20 scroll-mt-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Premium <span className="text-[#cca3ff]">Arsenal.</span></h2>
                        <p className="text-xl text-gray-400 mt-4 font-medium">Financial tools engineered for hyper-growth.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto px-8">
                        {/* Corporate Cards */}
                        <div className="group relative bg-[#1a1b22] rounded-[2.5rem] p-8 border border-white/5 hover:border-[#cca3ff]/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(204,163,255,0.15)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#cca3ff]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            
                            <div className="w-16 h-16 bg-[#2d1b4e] rounded-2xl flex items-center justify-center text-3xl mb-8 border border-[#cca3ff]/20 shadow-inner">
                                💳
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Corporate Cards</h3>
                            <p className="text-gray-400 font-medium leading-relaxed mb-8">Issue smart physical and virtual cards instantly with built-in, granular spend controls.</p>
                            
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cashback</span>
                                    <span className="text-xl font-black text-white group-hover:text-[#cca3ff] transition-colors">Up to 3%</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Virtual Cards</span>
                                    <span className="text-xl font-black text-white group-hover:text-[#cca3ff] transition-colors">Unlimited</span>
                                </div>
                            </div>
                        </div>

                        {/* Global Transfers */}
                        <div className="group relative bg-[#1a1b22] rounded-[2.5rem] p-8 border border-white/5 hover:border-[#cca3ff]/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(204,163,255,0.15)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#cca3ff]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            
                            <div className="w-16 h-16 bg-[#2d1b4e] rounded-2xl flex items-center justify-center text-3xl mb-8 border border-[#cca3ff]/20 shadow-inner">
                                🔄
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Global Transfers</h3>
                            <p className="text-gray-400 font-medium leading-relaxed mb-8">Send and receive high-volume payments across 130+ currencies with unprecedented speed.</p>
                            
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">FX Markups</span>
                                    <span className="text-xl font-black text-white group-hover:text-[#cca3ff] transition-colors">0.0%</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Settlement</span>
                                    <span className="text-xl font-black text-white group-hover:text-[#cca3ff] transition-colors">Same-day</span>
                                </div>
                            </div>
                        </div>

                        {/* Smart Invoicing */}
                        <div className="group relative bg-[#1a1b22] rounded-[2.5rem] p-8 border border-white/5 hover:border-[#cca3ff]/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(204,163,255,0.15)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#cca3ff]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            
                            <div className="w-16 h-16 bg-[#2d1b4e] rounded-2xl flex items-center justify-center text-3xl mb-8 border border-[#cca3ff]/20 shadow-inner">
                                📄
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Smart Invoicing</h3>
                            <p className="text-gray-400 font-medium leading-relaxed mb-8">Automate your entire accounts receivable flow with dynamic, conversion-optimized payment links.</p>
                            
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time to Pay</span>
                                    <span className="text-xl font-black text-white group-hover:text-[#cca3ff] transition-colors">3x Faster</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reconciliation</span>
                                    <span className="text-xl font-black text-white group-hover:text-[#cca3ff] transition-colors">100% Auto</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="company" className="landing-section pt-12 scroll-mt-24">
                    <div className="section-header"><h2>Our Company</h2><p>Building the future of finance, today.</p></div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-16 max-w-[1200px] mx-auto px-8 mt-12">
                        <div className="flex-1 space-y-6">
                            <h3 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">We are redefining <br/><span className="text-[#cca3ff]">global payments.</span></h3>
                            <p className="text-lg lg:text-xl text-gray-400 font-medium leading-relaxed max-w-[90%]">FinEdge was founded with a single mission: to make financial operations seamless for modern businesses. We empower thousands of companies to scale globally without borders.</p>
                            
                            <div className="grid grid-cols-2 gap-6 mt-10">
                                <div className="bg-[#1a1b22] p-8 rounded-[2rem] border border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-[#cca3ff]/30 transition-all group">
                                    <p className="text-4xl lg:text-5xl font-black text-white group-hover:text-[#cca3ff] transition-colors">$10B+</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3">Volume Processed</p>
                                </div>
                                <div className="bg-[#1a1b22] p-8 rounded-[2rem] border border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-[#cca3ff]/30 transition-all group">
                                    <p className="text-4xl lg:text-5xl font-black text-white group-hover:text-[#cca3ff] transition-colors">50k+</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3">Active Clients</p>
                                </div>
                                <div className="bg-[#1a1b22] p-8 rounded-[2rem] border border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-[#cca3ff]/30 transition-all group">
                                    <p className="text-4xl lg:text-5xl font-black text-white group-hover:text-[#cca3ff] transition-colors">130+</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3">Countries</p>
                                </div>
                                <div className="bg-[#1a1b22] p-8 rounded-[2rem] border border-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-[#cca3ff]/30 transition-all group">
                                    <p className="text-4xl lg:text-5xl font-black text-white group-hover:text-[#cca3ff] transition-colors">99.9%</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3">System Uptime</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center lg:justify-end">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#cca3ff]/20 to-transparent blur-3xl rounded-full"></div>
                                <img src={companyImage} alt="FinEdge Company" className="relative z-10 w-full max-w-[500px] h-auto object-cover rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10" />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="landing-section pt-20 pb-24 relative scroll-mt-24">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#cca3ff]/5 blur-[120px] rounded-full pointer-events-none"></div>
                    
                    <div className="text-center mb-16 relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Transparent <span className="text-[#cca3ff]">Pricing.</span></h2>
                        <p className="text-xl text-gray-400 mt-4 font-medium">Start for free, scale as you conquer.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto px-8 relative z-10">
                        {/* Starter Plan */}
                        <div className="bg-[#1a1b22] border border-white/5 rounded-[2.5rem] p-10 flex flex-col hover:border-[#cca3ff]/30 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Starter</h3>
                            <p className="text-gray-400 font-medium mb-8">Perfect for early-stage startups.</p>
                            <div className="mb-8">
                                <span className="text-6xl font-black text-white tracking-tighter">$0</span>
                                <span className="text-gray-500 font-bold ml-2 uppercase tracking-widest text-[10px]">/ month</span>
                            </div>
                            
                            <ul className="space-y-5 mb-12 flex-1">
                                <li className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#cca3ff]/10 flex items-center justify-center text-[#cca3ff] text-xs font-black">✓</div>
                                    <span className="text-gray-300 font-medium">Up to 5 team members</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#cca3ff]/10 flex items-center justify-center text-[#cca3ff] text-xs font-black">✓</div>
                                    <span className="text-gray-300 font-medium">Basic corporate cards</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#cca3ff]/10 flex items-center justify-center text-[#cca3ff] text-xs font-black">✓</div>
                                    <span className="text-gray-300 font-medium">Standard transfers (3-5 days)</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#cca3ff]/10 flex items-center justify-center text-[#cca3ff] text-xs font-black">✓</div>
                                    <span className="text-gray-300 font-medium">Email support</span>
                                </li>
                            </ul>
                            
                            <button onClick={() => navigate('/login')} className="w-full py-5 rounded-2xl bg-[#121318] hover:bg-white/5 text-white font-black text-lg transition-all border border-white/10 active:scale-95">
                                Get Started Free
                            </button>
                        </div>

                        {/* Growth Plan */}
                        <div className="bg-gradient-to-b from-[#2d1b4e]/80 to-[#1a1b22] border border-[#cca3ff]/40 rounded-[2.5rem] p-10 flex flex-col relative transform md:-translate-y-4 shadow-[0_20px_50px_rgba(204,163,255,0.15)]">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#cca3ff] to-white text-black text-[10px] font-black uppercase tracking-widest py-1.5 px-5 rounded-full shadow-[0_5px_15px_rgba(204,163,255,0.4)]">
                                Most Popular
                            </div>
                            
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Growth</h3>
                            <p className="text-[#cca3ff]/80 font-medium mb-8">For scaling teams with global needs.</p>
                            <div className="mb-8">
                                <span className="text-6xl font-black text-white tracking-tighter">$49</span>
                                <span className="text-[#cca3ff]/60 font-bold ml-2 uppercase tracking-widest text-[10px]">/ month</span>
                            </div>
                            
                            <ul className="space-y-5 mb-12 flex-1">
                                <li className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#cca3ff] flex items-center justify-center text-black text-xs font-black shadow-[0_0_10px_rgba(204,163,255,0.5)]">✓</div>
                                    <span className="text-white font-medium">Unlimited team members</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#cca3ff] flex items-center justify-center text-black text-xs font-black shadow-[0_0_10px_rgba(204,163,255,0.5)]">✓</div>
                                    <span className="text-white font-medium">Unlimited smart virtual cards</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#cca3ff] flex items-center justify-center text-black text-xs font-black shadow-[0_0_10px_rgba(204,163,255,0.5)]">✓</div>
                                    <span className="text-white font-medium">Same-day global transfers</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#cca3ff] flex items-center justify-center text-black text-xs font-black shadow-[0_0_10px_rgba(204,163,255,0.5)]">✓</div>
                                    <span className="text-white font-medium">Advanced API access</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#cca3ff] flex items-center justify-center text-black text-xs font-black shadow-[0_0_10px_rgba(204,163,255,0.5)]">✓</div>
                                    <span className="text-white font-medium">24/7 Priority support</span>
                                </li>
                            </ul>
                            
                            <button onClick={() => navigate('/login')} className="w-full py-5 rounded-2xl bg-white hover:bg-gray-200 text-black font-black text-lg transition-all shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.25)] active:scale-95">
                                Start Free Trial
                            </button>
                        </div>
                    </div>
                </section>

                <section id="languages" className="landing-section pt-24 pb-24 overflow-hidden relative border-t border-white/5 scroll-mt-24">
                    <div className="text-center mb-16 relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Available in <span className="text-[#cca3ff]">Your Language.</span></h2>
                        <p className="text-xl text-gray-400 mt-4 font-medium">Select a language to instantly translate the entire platform.</p>
                    </div>

                    <div className="w-full overflow-x-auto pb-16 pt-8 no-scrollbar" style={{ perspective: '1200px' }}>
                        <div className="flex items-center gap-6 w-max mx-auto px-[10vw]">
                            {[
                                { code: 'mr', native: 'मराठी', color: 'from-[#e0f8e0] to-[#c8f0c8]', text: 'text-green-900', img: '🏰' },
                                { code: 'hi', native: 'हिंदी', color: 'from-[#f5f5dc] to-[#ebebe0]', text: 'text-stone-900', img: '🏛️' },
                                { code: 'te', native: 'తెలుగు', color: 'from-[#f3e5f5] to-[#e1bee7]', text: 'text-purple-900', img: '🕌' },
                                { code: 'ml', native: 'മലയാളം', color: 'from-[#e0f7fa] to-[#b2ebf2]', text: 'text-cyan-900', img: '⛵' },
                                { code: 'gu', native: 'ગુજરાતી', color: 'from-[#fff3e0] to-[#ffe0b2]', text: 'text-orange-900', img: '🗽' },
                                { code: 'kn', native: 'ಕನ್ನಡ', color: 'from-[#e3f2fd] to-[#bbdefb]', text: 'text-blue-900', img: '🏛️' },
                                { code: 'en', native: 'English', color: 'from-[#fce4ec] to-[#f8bbd0]', text: 'text-pink-900', img: '🌍' },
                                { code: 'es', native: 'Español', color: 'from-[#fff8e1] to-[#ffecb3]', text: 'text-amber-900', img: '🇪🇸' }
                            ].map((lang, idx, arr) => {
                                const centerIdx = arr.length / 2;
                                let rotate = 0;
                                let scale = 1;
                                
                                if (idx < centerIdx - 1) { rotate = 20; scale = 0.9; }
                                else if (idx === centerIdx - 1) { rotate = 10; scale = 0.95; }
                                else if (idx === centerIdx) { rotate = -10; scale = 0.95; }
                                else { rotate = -20; scale = 0.9; }

                                return (
                                    <div 
                                        key={lang.code}
                                        onClick={() => handleLanguageSelect(lang.code)}
                                        className={`relative w-64 h-[22rem] rounded-3xl bg-gradient-to-b ${lang.color} flex flex-col items-center justify-between p-8 cursor-pointer hover:scale-105 transition-transform duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.6)] group`}
                                        style={{
                                            transform: `rotateY(${rotate}deg) scale(${scale})`,
                                            transformStyle: 'preserve-3d'
                                        }}
                                    >
                                        <h3 className={`text-5xl font-black ${lang.text} mt-4 drop-shadow-sm tracking-tight`}>{lang.native}</h3>
                                        
                                        <div className="flex-1 flex items-center justify-center">
                                            <span className="text-[6rem] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-xl filter grayscale-[20%] sepia-[20%]">{lang.img}</span>
                                        </div>

                                        <div className="w-full py-3 rounded-xl bg-white/40 backdrop-blur-md flex items-center justify-center border border-white/50 group-hover:bg-white/70 transition-colors duration-300 shadow-sm">
                                            <span className={`text-sm font-black ${lang.text} uppercase tracking-widest`}>Select</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
                <footer className="landing-footer pb-12 pt-8 border-t border-white/5">
                    <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <svg className="w-8 h-8 text-slate-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                                <span className="font-black text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-600">FinEdge</span>
                            </div>
                            <span className="text-[8.5px] font-black uppercase tracking-[0.25em] text-slate-500 pl-10 -mt-0.5">Go Cashless Go FinEdge</span>
                        </div>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-4">© 2026 FinEdge Inc. All rights reserved.</p>
                        </div>
                        
                        <div className="flex flex-row items-center gap-6">
                            <a href="/terms" className="px-8 py-5 bg-gradient-to-r from-[#1a1b22] to-[#2d1b4e]/30 border border-[#cca3ff]/30 hover:border-[#cca3ff] rounded-2xl text-white font-black tracking-widest text-sm uppercase transition-all duration-300 hover:shadow-[0_15px_40px_rgba(204,163,255,0.3)] hover:-translate-y-2 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-[#cca3ff]" /> Terms & Conditions
                            </a>
                            <a href="/privacy" className="px-8 py-5 bg-gradient-to-r from-[#1a1b22] to-[#2d1b4e]/30 border border-[#cca3ff]/30 hover:border-[#cca3ff] rounded-2xl text-white font-black tracking-widest text-sm uppercase transition-all duration-300 hover:shadow-[0_15px_40px_rgba(204,163,255,0.3)] hover:-translate-y-2 flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-[#cca3ff]" /> Privacy Policy
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Landing;
