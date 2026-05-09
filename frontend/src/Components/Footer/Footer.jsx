import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeRequest } from '../../api/api';

function Footer() {
    const user = JSON.parse(localStorage.getItem('user'));
    const isHR = user?.role === 'recruiter' || user?.role === 'admin';
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        try {
            setLoading(true);
            await subscribeRequest({ email });
            alert("Thank you for subscribing! Check your email for updates.");
            setEmail("");
        } catch (error) {
            console.error("Subscription failed:", error);
            alert(error.response?.data?.message || "Subscription failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const quickLinks = [
        ...(!isHR ? [{ label: 'Find Jobs', path: '/jobs' }] : []),
        ...(user?.role?.toLowerCase() !== 'candidate' ? [{ label: 'Post a Job', path: (user?.role === 'recruiter' || user?.role === 'admin') ? '/post-job' : '/signup' }] : []),
        { label: 'How it Works', path: '/about-us' }
    ];

    return (
        <footer style={{ background: '#111827', color: '#9CA3AF', borderTop: '3px solid #2563EB' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem' }}>

                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F9FAFB' }}>
                                HR<span style={{ color: '#2563EB' }}>Connect</span>
                            </h2>
                        </div>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.65 }}>
                            Connecting talent with opportunity across branches. Our ATS streamlines your recruitment process with modern technology.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{ color: '#F9FAFB', fontWeight: '700', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Quick Links</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {quickLinks.map(link => (
                                <li key={link.label}>
                                    <Link to={link.path} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = '#2563EB'}
                                        onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 style={{ color: '#F9FAFB', fontWeight: '700', fontSize: '0.875rem', marginBottom: '1.25rem' }}>Resources</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {['Help Center', 'Privacy Policy', 'Terms of Service'].map(link => (
                                <li key={link}>
                                    <Link to={link === 'Help Center' ? '/contact-us' : (link === 'Privacy Policy' || link === 'Terms of Service') ? '/terms-policies' : '#'} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = '#2563EB'}
                                        onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 style={{ color: '#F9FAFB', fontWeight: '700', fontSize: '0.875rem', marginBottom: '1rem' }}>Stay Updated</h3>
                        <p style={{ fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.6 }}>Subscribe for the latest job market insights.</p>
                        <form onSubmit={handleSubscribe} style={{ position: 'relative' }}>
                            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required
                                style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '0.6rem 4rem 0.6rem 0.9rem', fontSize: '0.8rem', color: '#F9FAFB', outline: 'none', fontFamily: 'inherit' }} />
                            <button type="submit" disabled={loading} style={{ position: 'absolute', right: '4px', top: '4px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
                                {loading ? "..." : "Join"}
                            </button>
                        </form>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '3rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>© 2026 HRConnect. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Privacy', 'Terms'].map(l => (
                            <Link key={l} to="/terms-policies" style={{ fontSize: '0.8rem', color: '#6B7280', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.target.style.color = '#2563EB'}
                                onMouseLeave={e => e.target.style.color = '#6B7280'}>
                                {l}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
