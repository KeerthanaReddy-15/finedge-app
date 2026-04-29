import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Database, EyeOff, Key, Cookie, Trash2 } from 'lucide-react';

const Privacy = () => {
    const sections = [
        {
            icon: <Database className="w-8 h-8 text-blue-400" />,
            title: "1. Data Collection",
            color: "blue",
            content: "We collect information you provide directly, such as when you create an account, verify your identity, or initiate transactions. This includes your name, email, encrypted password, and financial activity metadata."
        },
        {
            icon: <EyeOff className="w-8 h-8 text-purple-400" />,
            title: "2. Zero-Knowledge Proofs",
            color: "purple",
            content: "FinEdge employs zero-knowledge architecture for sensitive financial data. We cannot see your exact transaction destinations or private keys. Your data is encrypted locally before it ever reaches our servers."
        },
        {
            icon: <Key className="w-8 h-8 text-green-400" />,
            title: "3. Third-Party Sharing",
            color: "green",
            content: "We do not sell, rent, or trade your personal information to third parties. Data is only shared with verified financial infrastructure partners (like Visa or Stripe) strictly to process your requested transactions."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-pink-400" />,
            title: "4. Security Measures",
            color: "pink",
            content: "We use AES-256 encryption, strictly enforce HTTPS, and require Two-Factor Authentication (2FA) for high-value accounts. Our infrastructure is audited quarterly by independent cybersecurity firms."
        },
        {
            icon: <Cookie className="w-8 h-8 text-orange-400" />,
            title: "5. Cookies & Tracking",
            color: "orange",
            content: "We use essential cookies to maintain your login session and security tokens. We do not use cross-site tracking cookies or invasive marketing pixels. You can manage cookie preferences in your browser settings."
        },
        {
            icon: <Trash2 className="w-8 h-8 text-teal-400" />,
            title: "6. Data Deletion Rights",
            color: "teal",
            content: "You have the right to request the complete deletion of your account and associated data. Upon request, we will irrevocably erase your data from our active databases within 30 days, subject to legal retention laws."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-white font-sans overflow-hidden selection:bg-[#cca3ff] selection:text-black">
            
            {/* Massive Hero Background Orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Navigation Bar */}
            <nav className="w-full relative z-20 px-8 py-8 md:px-16 flex items-center justify-between">
                <Link to="/" className="inline-flex items-center gap-3 text-white hover:text-[#cca3ff] transition-colors font-bold tracking-widest text-sm uppercase group bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-md">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Return to Platform
                </Link>
            </nav>

            {/* Hero Section - Full Width */}
            <div className="w-full relative z-10 px-8 md:px-16 pt-10 pb-20 border-b border-white/5">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                    <div className="max-w-3xl">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                            Privacy <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5090e0] to-[#cca3ff]">Policy.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed">
                            Your data is your property. We built our entire infrastructure around military-grade privacy and zero-knowledge encryption.
                        </p>
                    </div>
                    <div className="hidden md:flex w-40 h-40 bg-gradient-to-br from-[#1a1b22] to-[#0A0A0F] rounded-full items-center justify-center border-4 border-white/5 shadow-[0_0_100px_rgba(80,144,224,0.15)] relative overflow-hidden group hover:scale-105 transition-transform duration-700">
                        <div className="absolute inset-0 bg-[#5090e0]/10 animate-pulse"></div>
                        <ShieldCheck className="w-16 h-16 text-[#5090e0] relative z-10 group-hover:scale-110 transition-transform" />
                    </div>
                </div>
            </div>

            {/* Content Grid - Full Horizontally */}
            <div className="w-full relative z-10 px-8 md:px-16 py-24 bg-[#121318]/50 backdrop-blur-3xl">
                <div className="max-w-[1400px] mx-auto">
                    
                    <div className="flex items-center gap-4 mb-16">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-sm font-black text-gray-500 uppercase tracking-[0.3em]">Last Updated: April 2026</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sections.map((section, idx) => (
                            <div key={idx} className="bg-[#1a1b22] border border-white/5 rounded-[2.5rem] p-10 hover:-translate-y-2 hover:bg-[#1e1f28] hover:border-white/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 group relative overflow-hidden">
                                
                                {/* Hover Glow Effect */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${section.color}-500/10 rounded-full blur-[50px] group-hover:bg-${section.color}-500/20 transition-colors`}></div>

                                <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner relative z-10">
                                    {section.icon}
                                </div>
                                <h2 className="text-2xl font-black text-white mb-4 relative z-10 leading-tight">
                                    {section.title}
                                </h2>
                                <p className="text-gray-400 text-base font-medium leading-relaxed relative z-10">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-24 p-12 bg-gradient-to-r from-[#1a1b22] to-[#0f1521] border border-blue-500/20 rounded-[3rem] text-center max-w-4xl mx-auto flex flex-col items-center">
                        <h3 className="text-3xl font-black text-white mb-4">Take control of your data.</h3>
                        <p className="text-gray-400 mb-8 max-w-lg">Want to download a copy of your personal data or request an account wipe? Our privacy team is ready to help.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 w-full max-w-2xl">
                            <div className="flex items-center gap-3 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 w-full justify-center">
                                <span className="text-xl">📞</span>
                                <span className="text-white font-mono font-bold tracking-widest text-sm sm:text-base">+1 (800) 555-0200</span>
                            </div>
                            <div className="flex items-center gap-3 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 w-full justify-center">
                                <span className="text-xl">✉️</span>
                                <span className="text-white font-mono font-bold tracking-widest text-sm sm:text-base">privacy@finedge.com</span>
                            </div>
                        </div>
                        <a href="mailto:privacy@finedge.com" className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-gray-200 transition-colors shadow-lg active:scale-95 inline-block">
                            Email Privacy Team
                        </a>
                    </div>

                </div>
            </div>

            {/* Simple Footer */}
            <footer className="w-full border-t border-white/5 py-10 text-center relative z-10 bg-[#0A0A0F]">
                <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">© 2026 FinEdge Inc. All Rights Reserved.</p>
            </footer>

        </div>
    );
};

export default Privacy;
