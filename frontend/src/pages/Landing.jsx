import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Landing.css';
import heroImage from '../assets/hero_illustration.png';
import companyImage from '../assets/company_art.png';

const Landing = () => {
    const navigate = useNavigate();

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
                    <div className="flex items-center gap-2">
                        <svg className="w-7 h-7 text-[#cca3ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span className="font-extrabold text-2xl tracking-tight text-white">FinEdge</span>
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
            </div>

            {/* ─── DESKTOP LAYOUT ─── */}
            <div className="hidden lg:block h-screen overflow-y-auto no-scrollbar">
                <nav className="landing-navbar">
                    <a href="#" className="navbar-logo">
                        <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        FinEdge
                    </a>
                    <div className="navbar-links">
                        <a href="#products" className="nav-link">Products</a>
                        <a href="#company" className="nav-link">Company</a>
                        <a href="#pricing" className="nav-link">Pricing</a>
                    </div>
                    <div className="navbar-actions">
                        <button onClick={() => navigate('/login')} className="btn-primary nav-btn">Get started</button>
                    </div>
                </nav>
                
                <main className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Unlock growth with every payment</h1>
                        <p className="hero-subtitle">Run payments, extend net terms and automate collections compliance.</p>
                        <div className="hero-actions">
                            <button onClick={() => navigate('/login')} className="btn-primary hero-main-btn">Get started</button>
                        </div>
                    </div>
                </main>

                <section id="products" className="landing-section">
                    <div className="section-header"><h2>Our Products</h2><p>Financial tools built for modern businesses</p></div>
                    <div className="products-grid">
                        <div className="product-card"><div className="product-icon">💳</div><h3>Corporate Cards</h3><p>Issue smart physical and virtual cards with built-in spend controls.</p></div>
                        <div className="product-card"><div className="product-icon">🔄</div><h3>Global Transfers</h3><p>Send and receive payments in 130+ currencies fast.</p></div>
                        <div className="product-card"><div className="product-icon">📄</div><h3>Smart Invoicing</h3><p>Automate your accounts receivable with dynamic payment links.</p></div>
                    </div>
                </section>

                <section id="pricing" className="landing-section pb-24">
                    <div className="section-header"><h2>Transparent Pricing</h2><p>Start for free, scale as you grow</p></div>
                    <div className="pricing-grid max-w-[1000px] mx-auto">
                        <div className="pricing-card"><h3>Starter</h3><div className="price">$0<span>/mo</span></div><button onClick={() => navigate('/login')} className="btn-secondary w-100">Get Started</button></div>
                        <div className="pricing-card popular"><div className="popular-badge">Most Popular</div><h3>Growth</h3><div className="price">$49<span>/mo</span></div><button onClick={() => navigate('/login')} className="btn-primary w-100">Start Free Trial</button></div>
                    </div>
                </section>

                <footer className="landing-footer">
                    <div className="footer-content">
                        <div className="footer-logo">
                            <svg className="logo-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span>FinEdge</span>
                        </div>
                        <p>© 2026 FinEdge Inc. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Landing;
