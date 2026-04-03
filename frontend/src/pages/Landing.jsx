import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import heroImage from '../assets/hero_illustration.png';
import companyImage from '../assets/company_art.png';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="hero-bg-layer">
                <div className="hero-bg-gradient-overlay"></div>
                <img 
                    src={heroImage} 
                    alt="FinEdge 3D Elements" 
                    className="hero-bg-image"
                />
            </div>

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
                    <p className="hero-subtitle">
                        Run payments, extend net terms and automate collections compliance.
                    </p>
                    <div className="hero-actions">
                        <button onClick={() => navigate('/login')} className="btn-primary hero-main-btn">Get started</button>
                    </div>
                </div>
            </main>

            {/* Products Section */}
            <section id="products" className="landing-section">
                <div className="section-header">
                    <h2>Our Products</h2>
                    <p>Financial tools built for modern businesses</p>
                </div>
                <div className="products-grid">
                    <div className="product-card">
                        <div className="product-icon">💳</div>
                        <h3>Corporate Cards</h3>
                        <p>Issue smart physical and virtual cards with built-in spend controls and automated receipt matching.</p>
                    </div>
                    <div className="product-card">
                        <div className="product-icon">🔄</div>
                        <h3>Global Transfers</h3>
                        <p>Send and receive payments in 130+ currencies with real-time tracking and competitive FX rates.</p>
                    </div>
                    <div className="product-card">
                        <div className="product-icon">📄</div>
                        <h3>Smart Invoicing</h3>
                        <p>Automate your accounts receivable with dynamic payment links, auto-reconciliation, and reminders.</p>
                    </div>
                </div>
            </section>

            {/* Company Section */}
            <section id="company" className="landing-section company-section">
                <div className="company-content">
                    <div className="section-header text-left">
                        <h2>About FinEdge</h2>
                        <p>We are rebuilding the financial stack for the next generation of global businesses.</p>
                    </div>
                    <div className="company-stats">
                        <div className="stat-item">
                            <h4>$10B+</h4>
                            <p>Processed</p>
                        </div>
                        <div className="stat-item">
                            <h4>50k+</h4>
                            <p>Customers</p>
                        </div>
                        <div className="stat-item">
                            <h4>99.99%</h4>
                            <p>Uptime</p>
                        </div>
                    </div>
                </div>
                <div className="company-image-container">
                    <img src={companyImage} alt="FinEdge Global Network" className="company-art-img" />
                    <div className="glass-panel-overlay"></div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="landing-section">
                <div className="section-header">
                    <h2>Transparent Pricing</h2>
                    <p>Start for free, scale as you grow</p>
                </div>
                <div className="pricing-grid">
                    <div className="pricing-card">
                        <h3>Starter</h3>
                        <div className="price">$0<span>/mo</span></div>
                        <ul className="pricing-features">
                            <li>Up to 5 team members</li>
                            <li>Basic corporate cards</li>
                            <li>Domestic transfers</li>
                            <li>Standard support</li>
                        </ul>
                        <button onClick={() => navigate('/login')} className="btn-secondary w-100">Get Started</button>
                    </div>
                    <div className="pricing-card popular">
                        <div className="popular-badge">Most Popular</div>
                        <h3>Growth</h3>
                        <div className="price">$49<span>/mo</span></div>
                        <ul className="pricing-features">
                            <li>Unlimited team members</li>
                            <li>Advanced spend controls</li>
                            <li>Global transfers (1% FX)</li>
                            <li>Priority 24/7 support</li>
                        </ul>
                        <button onClick={() => navigate('/login')} className="btn-primary w-100">Start Free Trial</button>
                    </div>
                    <div className="pricing-card">
                        <h3>Enterprise</h3>
                        <div className="price">Custom</div>
                        <ul className="pricing-features">
                            <li>Dedicated account manager</li>
                            <li>Custom API integration</li>
                            <li>Volume-based FX discounts</li>
                            <li>SLA guarantees</li>
                        </ul>
                        <button onClick={() => navigate('/login')} className="btn-secondary w-100">Contact Sales</button>
                    </div>
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
    );
};

export default Landing;
