import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { updateProfileRequest } from "../../api/api";

const C = { bg: '#0F172A', card: '#1E293B', primary: '#3B82F6', text: '#F1F5F9', muted: '#94A3B8', border: '#334155', accent: '#22C55E' };

// Icons
const UserIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MailIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const PhoneIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const MapIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BriefcaseIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

function EditProfile() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};

    const [formData, setFormData] = useState({
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        location: storedUser.location || "",
        role: storedUser.role || "Candidate",
        skills: storedUser.skills || "",
        company: storedUser.company || "",
        bio: storedUser.bio || "",
        initialEmail: storedUser.email || ""
    });
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();

        if (formData.email !== formData.initialEmail) {
            navigate('/verify-user', { state: { userData: formData } });
        } else {
            try {
                const res = await updateProfileRequest(formData);
                const updatedUser = res.data?.data?.user;
                if (updatedUser) {
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                } else {
                    localStorage.setItem('user', JSON.stringify(formData));
                }
                window.dispatchEvent(new Event('auth-change'));
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    navigate('/profile');
                }, 2000);
            } catch (err) {
                console.error("Failed to update profile", err);
                alert(err.response?.data?.message || "Failed to update profile");
            }
        }
    };

    const inputS = { width: '100%', background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '0.75rem 1rem 0.75rem 2.75rem', fontSize: '0.875rem', color: C.text, outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s ease' };

    if (isSuccess) return (
        <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '2.5rem', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: C.accent }}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: C.text, marginBottom: '0.5rem' }}>Profile Updated!</h1>
                <p style={{ color: C.muted, fontSize: '0.875rem' }}>Your changes have been saved successfully.</p>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', boxShadow: '0 15px 50px rgba(0,0,0,0.3)', width: '100%', maxWidth: '700px', padding: '3.5rem' }}>
                <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: C.muted, textDecoration: 'none', fontWeight: '600', marginBottom: '2.5rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = C.primary} onMouseLeave={e => e.target.style.color = C.muted}>
                    ← Back to Profile
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'rgba(59,130,246,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: C.primary }}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: C.text, marginBottom: '0.5rem' }}>Profile Settings</h1>
                    <p style={{ fontSize: '1rem', color: C.muted }}>Update your personal and professional information.</p>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.text, display: 'block', marginBottom: '0.6rem' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><UserIcon /></span>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputS}
                                    onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.15)'; e.target.style.background = C.card; }}
                                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.text, display: 'block', marginBottom: '0.6rem' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><MailIcon /></span>
                                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputS}
                                    onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.15)'; e.target.style.background = C.card; }}
                                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.text, display: 'block', marginBottom: '0.6rem' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><PhoneIcon /></span>
                                <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={inputS}
                                    onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.15)'; e.target.style.background = C.card; }}
                                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.text, display: 'block', marginBottom: '0.6rem' }}>Location</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><MapIcon /></span>
                                <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={inputS}
                                    onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.15)'; e.target.style.background = C.card; }}
                                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.text, display: 'block', marginBottom: '0.6rem' }}>
                            {formData.role === 'candidate' ? 'Skills' : 'Company Name'}
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><BriefcaseIcon /></span>
                            <input type="text" required
                                value={formData.role === 'candidate' ? formData.skills : formData.company}
                                onChange={e => formData.role === 'candidate' ? setFormData({ ...formData, skills: e.target.value }) : setFormData({ ...formData, company: e.target.value })}
                                style={inputS}
                                onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.15)'; e.target.style.background = C.card; }}
                                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: C.text, display: 'block', marginBottom: '0.6rem' }}>Professional Bio</label>
                        <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            style={{ ...inputS, padding: '0.8rem 1.25rem', height: '120px', resize: 'none' }}
                            onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.15)'; e.target.style.background = C.card; }}
                            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: '700', marginTop: '1rem' }}>Save Profile Details</button>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;