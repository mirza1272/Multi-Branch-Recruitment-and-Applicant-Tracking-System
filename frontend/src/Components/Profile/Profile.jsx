import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMeRequest } from "../../api/api";

const C = { bg: '#0F172A', card: '#1E293B', primary: '#3B82F6', text: '#F1F5F9', muted: '#94A3B8', border: '#334155', accent: '#22C55E' };

// Icons
const UserIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MailIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const MapIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BriefcaseIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Try to get from API for fresh data
                const response = await getMeRequest();
                const freshUser = response.data?.data?.user;
                if (freshUser) {
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                }
            } catch (err) {
                console.error("Failed to fetch fresh user data:", err);
                // Fallback to localStorage if API fails
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    navigate('/login');
                }
            }
        };
        fetchUserData();
    }, [navigate]);

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: C.bg, padding: '4rem 1rem' }}>
            <div className="max-w-4xl mx-auto">

                {/* Header Card */}
                <div style={{ background: C.card, borderRadius: '24px', border: `1px solid ${C.border}`, padding: '3rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)', opacity: 0.1 }}></div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                        <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '800', color: '#fff', boxShadow: '0 10px 25px rgba(37,99,235,0.3)' }}>
                            {user.name[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <h1 style={{ fontSize: '2.25rem', fontWeight: '900', color: C.text }}>{user.name}</h1>
                                <span style={{ background: 'rgba(59,130,246,0.1)', color: C.primary, padding: '0.35rem 0.85rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', border: `1px solid rgba(59,130,246,0.2)` }}>
                                    {user.role}
                                </span>
                            </div>
                            {user.role === 'candidate' && (
                                <p style={{ color: C.muted, fontSize: '1.05rem', maxWidth: '500px', lineHeight: 1.6 }}>
                                    {user.bio || "No professional bio added yet. Tell people about your expertise!"}
                                </p>
                            )}
                        </div>
                        <button onClick={() => navigate('/edit-profile')} className="btn-primary" style={{ padding: '0.8rem 1.75rem', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '700' }}>
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

                    {/* Contact Info */}
                    <div style={{ background: C.card, borderRadius: '20px', border: `1px solid ${C.border}`, padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: C.text, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ color: C.primary }}><MailIcon /></span> Contact Information
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ color: C.muted }}><MailIcon /></div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: C.muted, marginBottom: '0.1rem' }}>Email Address</p>
                                    <p style={{ fontSize: '0.95rem', color: C.text, fontWeight: '600' }}>{user.email}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ color: C.muted }}><PhoneIcon /></div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: C.muted, marginBottom: '0.1rem' }}>Phone Number</p>
                                    <p style={{ fontSize: '0.95rem', color: C.text, fontWeight: '600' }}>{user.phone || "Not provided"}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ color: C.muted }}><MapIcon /></div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: C.muted, marginBottom: '0.1rem' }}>Location</p>
                                    <p style={{ fontSize: '0.95rem', color: C.text, fontWeight: '600' }}>{user.location || "Not provided"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div style={{ background: C.card, borderRadius: '20px', border: `1px solid ${C.border}`, padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: C.text, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ color: C.primary }}><BriefcaseIcon /></span> Professional Details
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ color: C.muted }}><BriefcaseIcon /></div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: C.muted, marginBottom: '0.1rem' }}>
                                        {user.role === 'candidate' ? 'Skills & Expertise' : 'Associated Company'}
                                    </p>
                                    <p style={{ fontSize: '0.95rem', color: C.text, fontWeight: '600' }}>
                                        {user.role === 'candidate' ? (user.skills || "Add your skills") : (user.company || "Add company details")}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ color: C.muted }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: C.muted, marginBottom: '0.1rem' }}>Account Status</p>
                                    <p style={{ fontSize: '0.95rem', color: C.accent, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ width: '8px', height: '8px', background: C.accent, borderRadius: '50%' }}></span> Verified Member
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link to="/" style={{ color: C.muted, textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = C.primary} onMouseLeave={e => e.target.style.color = C.muted}>
                        Back to Home Page
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Profile;
