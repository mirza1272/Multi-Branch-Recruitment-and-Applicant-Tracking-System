import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Header() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    const navItems = ['Home'];
    if (isLoggedIn) {
        if (user?.role === 'recruiter' || user?.role === 'admin') {
            navItems.push('Dashboard');
        } else {
            navItems.push('Jobs', 'Applications');
        }
    } else {
        navItems.push('Jobs');
    }
    navItems.push('About Us', 'Contact Us');

    // Sync auth state across components/tabs
    React.useEffect(() => {
        const handleAuthChange = () => {
            const userData = localStorage.getItem('user');
            setIsLoggedIn(!!userData);
            setUser(userData ? JSON.parse(userData) : null);
        };
        window.addEventListener('storage', handleAuthChange);
        // Custom event for same-window updates
        window.addEventListener('auth-change', handleAuthChange);
        return () => {
            window.removeEventListener('storage', handleAuthChange);
            window.removeEventListener('auth-change', handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        setShowDropdown(false);
        // Trigger event for same-window sync
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
    };

    return (
        <header className="glass sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#F1F5F9', letterSpacing: '-0.03em' }}>
                            HR<span style={{ color: '#3B82F6' }}>Connect</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center" style={{ gap: '2rem' }}>
                        {navItems.map((item) => (
                            <Link key={item} to={
                                item === 'Home' ? '/' :
                                    item === 'Jobs' ? '/jobs' :
                                        item === 'Applications' ? '/applications' :
                                            item === 'Dashboard' ? '/hr-dashboard' :
                                                item === 'About Us' ? '/about-us' :
                                                    item === 'Contact Us' ? '/contact-us' : '#'
                            }
                                className="text-sm font-medium transition-all duration-200 relative group"
                                style={{ color: '#6B7280', textDecoration: 'none' }}
                                onMouseEnter={e => e.target.style.color = '#3B82F6'}
                                onMouseLeave={e => e.target.style.color = '#6B7280'}>
                                {item}
                                <span style={{ position: 'absolute', bottom: '-4px', left: 0, height: '2px', width: '0', background: '#3B82F6', borderRadius: '99px', transition: 'width 0.25s ease' }} className="group-hover:!w-full" />
                            </Link>
                        ))}
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                        {isLoggedIn && user ? (
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: '800' }}>
                                        {user.name ? user.name[0].toUpperCase() : 'U'}
                                    </div>
                                    <span style={{ color: '#F1F5F9', fontSize: '0.9rem', fontWeight: '600' }}>{user.name.split(' ')[0]}</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'none' }}>
                                        <path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                </button>

                                {showDropdown && (
                                    <div style={{ position: 'absolute', top: '120%', right: 0, width: '180px', background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', padding: '0.5rem', zIndex: 100 }}>
                                        <Link to="/profile" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.7rem', color: '#F1F5F9', textDecoration: 'none', fontSize: '0.85rem', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#2D3748'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                            View Profile
                                        </Link>
                                        <div style={{ height: '1px', background: '#334155', margin: '0.4rem 0' }}></div>
                                        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.7rem', color: '#EF4444', background: 'transparent', border: 'none', fontSize: '0.85rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-4">
                                <Link to="/login" style={{ color: '#F1F5F9', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }} onMouseEnter={e => e.target.style.color = '#3B82F6'} onMouseLeave={e => e.target.style.color = '#F1F5F9'}>Login</Link>
                                <button onClick={() => navigate('/signup')} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Sign Up</button>
                            </div>
                        )}

                        {/* Mobile Menu Toggle Button */}
                        <button className="md:hidden flex items-center" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: '#F1F5F9', cursor: 'pointer' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {isMobileMenuOpen ? (
                                    <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>
                                ) : (
                                    <><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden" style={{ background: '#1E293B', borderBottom: '1px solid #334155', borderTop: '1px solid #334155', position: 'absolute', width: '100%', left: 0, top: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                    {navItems.map((item) => (
                        <Link key={item} to={
                        item === 'Home' ? '/' :
                            item === 'Jobs' ? '/jobs' :
                                item === 'Applications' ? '/applications' :
                                    item === 'Dashboard' ? '/hr-dashboard' :
                                        item === 'About Us' ? '/about-us' :
                                            item === 'Contact Us' ? '/contact-us' : '#'
                        } onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#F1F5F9', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {item}
                        </Link>
                    ))}
                    {!isLoggedIn && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#3B82F6', textDecoration: 'none', textAlign: 'center', fontWeight: '600', padding: '0.75rem', border: '1px solid #3B82F6', borderRadius: '8px' }}>Login</Link>
                            <button onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }} className="btn-primary" style={{ width: '100%' }}>Sign Up</button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

export default Header;