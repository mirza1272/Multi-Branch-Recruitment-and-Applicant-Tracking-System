import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "../../api/api";

const C = { bg: '#0F172A', card: '#1E293B', primary: '#3B82F6', text: '#F1F5F9', muted: '#94A3B8', border: '#334155' };

const UserIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MailIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LockIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const PhoneIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const MapIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BriefcaseIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

function SignUp() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        role: "Candidate",
        skills: "",
        company: "",
        bio: "",
        acceptTerms: false
    });

    const [error, setError] = useState("");

    // Load from sessionStorage on mount
    useEffect(() => {
        const savedData = sessionStorage.getItem('signup_form_progress');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    // Save to sessionStorage as formData changes
    useEffect(() => {
        sessionStorage.setItem('signup_form_progress', JSON.stringify(formData));
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Strong password verification
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");
        if (!strongRegex.test(formData.password)) {
            setError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
            return;
        }

        if (!formData.acceptTerms) {
            setError("You must accept the terms and conditions to create an account.");
            return;
        }

        setError("");

        try {
            await registerRequest({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role === 'HR' ? 'recruiter' : 'candidate',
                phone: formData.phone,
                location: formData.location,
                skills: formData.role === 'Candidate' ? formData.skills : undefined,
                company: formData.role === 'HR' ? formData.company : undefined,
                bio: formData.bio
            });

            sessionStorage.removeItem('signup_form_progress');
            navigate('/verify-user', { state: { email: formData.email } });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Unable to register. Please try again.');
        }
    };

    const inputS = { width: '100%', background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '0.75rem 1rem 0.75rem 2.75rem', fontSize: '0.875rem', color: C.text, outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s ease' };

    return (
        <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="p-6 sm:p-10 md:p-12" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', width: '100%', maxWidth: '650px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: C.primary }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: C.text, marginBottom: '0.3rem' }}>Create Account</h1>
                    <p style={{ fontSize: '0.95rem', color: C.muted }}>Step into the future of recruitment with HRConnect.</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239,68,68,0.2)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Role Toggle */}
                    <div style={{ display: 'flex', gap: '1rem', background: C.bg, padding: '0.4rem', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                        {['Candidate', 'HR'].map(r => (
                            <button key={r} type="button" onClick={() => setFormData({ ...formData, role: r })}
                                style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', background: formData.role === r ? C.primary : 'transparent', color: formData.role === r ? '#fff' : C.muted }}>
                                {r}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.text, display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><UserIcon /></span>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" style={inputS}
                                    onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background = C.card; }}
                                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.text, display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><MailIcon /></span>
                                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" style={inputS}
                                    onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background = C.card; }}
                                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.text, display: 'block', marginBottom: '0.5rem' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><PhoneIcon /></span>
                                <input type="tel" required value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                                    placeholder="1234567890" style={inputS}
                                    onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background = C.card; }}
                                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.text, display: 'block', marginBottom: '0.5rem' }}>Location</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><MapIcon /></span>
                                <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="New York, USA" style={inputS}
                                    onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background = C.card; }}
                                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.text, display: 'block', marginBottom: '0.5rem' }}>
                            {formData.role === 'Candidate' ? 'Skills (Comma separated)' : 'Company Name'}
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><BriefcaseIcon /></span>
                            <input type="text" required
                                value={formData.role === 'Candidate' ? formData.skills : formData.company}
                                onChange={e => formData.role === 'Candidate' ? setFormData({ ...formData, skills: e.target.value }) : setFormData({ ...formData, company: e.target.value })}
                                placeholder={formData.role === 'Candidate' ? "React, Node.js, Design" : "Tech Solutions Inc."}
                                style={inputS}
                                onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background = C.card; }}
                                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.text, display: 'block', marginBottom: '0.5rem' }}>Short Bio</label>
                        <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us about yourself..."
                            style={{ ...inputS, padding: '0.75rem 1rem', height: '100px', resize: 'none' }}
                            onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background = C.card; }}
                            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                    </div>

                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.text, display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><LockIcon /></span>
                            <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" style={inputS}
                                onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background = C.card; }}
                                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={formData.acceptTerms} onChange={e => setFormData({ ...formData, acceptTerms: e.target.checked })} style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: C.primary }} />
                            <span style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.5 }}>
                                I agree to the <Link to="/terms-policies" style={{ color: C.primary, textDecoration: 'none', fontWeight: '700' }}>Terms of Service</Link> and <Link to="/terms-policies" style={{ color: C.primary, textDecoration: 'none', fontWeight: '700' }}>Privacy Policy</Link>.
                            </span>
                        </label>
                        {error && <p style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: '600', margin: 0 }}>{error}</p>}
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem', fontSize: '1rem' }}>Create Account</button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: C.muted }}>
                    Already have an account? <Link to="/login" style={{ color: C.primary, fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
