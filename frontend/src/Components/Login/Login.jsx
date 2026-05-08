import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../../api/api";

const C = { bg: '#0F172A', card: '#1E293B', primary: '#3B82F6', accent: '#22C55E', text: '#F1F5F9', muted: '#94A3B8', border: '#334155' };
const MailIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LockIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const iStyle = { width: '100%', background: '#0F172A', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '0.8rem 1rem 0.8rem 2.75rem', fontSize: '0.875rem', color: C.text, outline: 'none', fontFamily: 'inherit' };

function Login() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await loginRequest({ email, password });
            const user = response?.data?.data?.user || response?.data?.user;
            const token = response?.data?.data?.token || response?.data?.token;

            if (!user) {
                throw new Error("Invalid login response from server.");
            }

            // Save both user and token to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            if (token) {
                localStorage.setItem('token', token);
                console.log('✅ Token saved to localStorage');
            }
            window.dispatchEvent(new Event('auth-change'));

            if (user.role === 'admin' || user.role === 'recruiter') {
                navigate('/hr-dashboard');
            } else {
                navigate('/jobs');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Unable to sign in. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', background: C.primary, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '14px', fontWeight: '800', color: '#fff' }}>HR</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: C.text, marginBottom: '0.3rem' }}>Welcome Back</h1>
                    <p style={{ fontSize: '0.85rem', color: C.muted }}>Sign in to your account</p>
                </div>
                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.text, display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><MailIcon /></span>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" style={iStyle}
                                onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; e.target.style.background = C.card; }}
                                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB'; }} />
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.text }}>Password</label>
                            <Link to="/forget-password" style={{ fontSize: '0.75rem', color: C.primary, fontWeight: '600', textDecoration: 'none' }}>Forgot Password?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><LockIcon /></span>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={iStyle}
                                onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; e.target.style.background = C.card; }}
                                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB'; }} />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem' }} disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: C.muted }}>
                    Don't have an account? <a href="/signup" style={{ color: C.primary, fontWeight: '600', cursor: 'pointer' }}>Request Access</a>
                </p>
            </div>
        </div>
    );
}

export default Login;