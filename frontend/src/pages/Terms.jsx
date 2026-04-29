import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Activity, FileText, AlertOctagon, RefreshCw } from 'lucide-react';

const Terms = () => {
    const sections = [
        {
            icon: <FileText className="w-8 h-8 text-blue-400" />,
            title: "1. Acceptance of Terms",
            color: "blue",
            content: "By accessing or using the FinEdge platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the Service. FinEdge provides financial dashboards, virtual wallets, and transaction management tools."
        },
        {
            icon: <Lock className="w-8 h-8 text-purple-400" />,
            title: "2. User Accounts & Security",
            color: "purple",
            content: "You are responsible for safeguarding the password and any 2FA tokens used to access the Service. You must notify us immediately upon becoming aware of any breach of security. FinEdge reserves the right to suspend accounts suspected of fraudulent activity."
        },
        {
            icon: <Activity className="w-8 h-8 text-green-400" />,
            title: "3. Financial Transactions",
            color: "green",
            content: "All transactions processed through FinEdge are subject to verification. Funds held in the FinEdge wallet are for illustrative and platform-specific purposes unless formally connected to verified external banking partners. Cryptocurrency values are highly volatile."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-pink-400" />,
            title: "4. Privacy & Data",
            color: "pink",
            content: "Your use of the Service is governed by our Privacy Policy. We collect, store, and process your data using industry-standard AES-256 encryption. We will never sell your personal financial data to third-party marketers without explicit consent."
        },
        {
            icon: <AlertOctagon className="w-8 h-8 text-orange-400" />,
            title: "5. Limitation of Liability",
            color: "orange",
            content: "In no event shall FinEdge, nor its directors, employees, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including loss of profits, data, use, or other intangible losses, resulting from your use of the Service."
        },
        {
            icon: <RefreshCw className="w-8 h-8 text-teal-400" />,
            title: "6. Changes to Terms",
            color: "teal",
            content: "We reserve the right to modify or replace these Terms at any time. Material changes will be determined at our sole discretion. We will notify you of any changes by updating the \"Last updated\" date of these Terms across the platform."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-white font-sans overflow-hidden selection:bg-[#cca3ff] selection:text-black">
            
            {/* Massive Hero Background Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

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
                            Terms & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cca3ff] to-[#8050e0]">Conditions.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed">
                            The legal foundation of your financial ecosystem. Transparency, security, and trust built into every clause.
                        </p>
                    </div>
                    <div className="hidden md:flex w-40 h-40 bg-gradient-to-br from-[#1a1b22] to-[#0A0A0F] rounded-full items-center justify-center border-4 border-white/5 shadow-[0_0_100px_rgba(204,163,255,0.15)] relative overflow-hidden group hover:scale-105 transition-transform duration-700">
                        <div className="absolute inset-0 bg-[#cca3ff]/10 animate-pulse"></div>
                        <ShieldCheck className="w-16 h-16 text-[#cca3ff] relative z-10 group-hover:scale-110 transition-transform" />
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
                    <div className="mt-24 p-12 bg-gradient-to-r from-[#1a1b22] to-[#120f1c] border border-purple-500/20 rounded-[3rem] text-center max-w-4xl mx-auto flex flex-col items-center">
                        <h3 className="text-3xl font-black text-white mb-4">Have questions about our terms?</h3>
                        <p className="text-gray-400 mb-8 max-w-lg">Our dedicated legal and support team is available 24/7 to clarify any questions regarding your account or our policies.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 w-full max-w-2xl">
                            <div className="flex items-center gap-3 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 w-full justify-center">
                                <span className="text-xl">📞</span>
                                <span className="text-white font-mono font-bold tracking-widest text-sm sm:text-base">+1 (800) 555-0199</span>
                            </div>
                            <div className="flex items-center gap-3 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 w-full justify-center">
                                <span className="text-xl">✉️</span>
                                <span className="text-white font-mono font-bold tracking-widest text-sm sm:text-base">legal@finedge.com</span>
                            </div>
                        </div>
                        <a href="mailto:legal@finedge.com" className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-gray-200 transition-colors shadow-lg active:scale-95 inline-block">
                            Email Support Team
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

export default Terms;
