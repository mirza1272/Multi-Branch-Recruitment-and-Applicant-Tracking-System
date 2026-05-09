import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtpRequest, resendOtpRequest } from "../../api/api";

const C = { bg: '#0F172A', card: '#1E293B', primary: '#3B82F6', text: '#F1F5F9', muted: '#94A3B8', border: '#334155' };

function VerifyUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const incomingEmail = location.state?.email;
        if (incomingEmail) {
            setEmail(incomingEmail);
            setInfo(`A verification code was sent to ${incomingEmail}.`);
            return;
        }

        const savedData = sessionStorage.getItem('signup_form_progress');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed?.email) {
                setEmail(parsed.email);
                setInfo(`A verification code was sent to ${parsed.email}.`);
            }
        }
    }, [location.state]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Account email not available. Please complete registration again.");
            return;
        }

        if (code.trim().length < 4) {
            setError("Please enter the verification code sent to your email.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await verifyOtpRequest({ email, otp: code });
            const user = response?.data?.data?.user;
            const token = response?.data?.data?.token || response?.data?.token;
            localStorage.setItem('user', JSON.stringify(user));
            if (token) {
                localStorage.setItem('token', token);
                console.log('✅ Token saved to localStorage');
            }
            window.dispatchEvent(new Event('auth-change'));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Unable to verify OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            setError("Unable to resend OTP without email. Please complete registration again.");
            return;
        }

        setError("");
        setIsResending(true);

        try {
            await resendOtpRequest({ email });
            setInfo(`A new verification code was sent to ${email}.`);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Unable to resend OTP.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: C.primary }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: C.text, marginBottom: '0.3rem' }}>Verify Your Email</h1>
                    <p style={{ fontSize: '0.85rem', color: C.muted }}>{info || "We've sent a verification code to your email address."}</p>
                </div>
                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: C.text, display: 'block', marginBottom: '0.5rem', textAlign: 'center' }}>Enter Verification Code</label>
                        <input type="text" required maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/[^0-9]/g, ''))} placeholder="000000"
                            style={{ width: '100%', background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '1rem', fontSize: '1.75rem', color: C.text, outline: 'none', fontFamily: 'inherit', textAlign: 'center', letterSpacing: '0.4em', fontWeight: '800', transition: 'all 0.2s ease' }}
                            onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background = C.card; }}
                            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; e.target.style.background = C.bg; }} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={isLoading}>
                        {isLoading ? 'Completing...' : 'Verify & Complete'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: C.muted }}>
                    Didn't receive the code? <span onClick={handleResend} style={{ color: C.primary, fontWeight: '700', cursor: 'pointer' }}>{isResending ? 'Resending...' : 'Resend'}</span>
                </p>
            </div>
        </div>
    );
}

export default VerifyUser;