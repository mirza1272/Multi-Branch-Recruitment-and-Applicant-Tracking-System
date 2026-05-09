import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPasswordRequest } from "../../api/api";

const C = { bg:'#0F172A', card:'#1E293B', primary:'#3B82F6', text:'#F1F5F9', muted:'#94A3B8', border:'#334155' };
const MailIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

function ForgetPass() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await forgotPasswordRequest({ email });
            sessionStorage.setItem("resetEmail", email);
            navigate('/reset-pin');
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:'16px', boxShadow:'0 4px 24px rgba(0,0,0,0.08)', width:'100%', maxWidth:'420px', padding:'2.5rem' }}>
                <Link to="/login" style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', color:C.muted, textDecoration:'none', fontWeight:'600', marginBottom:'2rem' }}>
                    ← Back to Login
                </Link>
                <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                    <div style={{ width:'48px', height:'48px', background:'rgba(59,130,246,0.1)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', color:C.primary }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                    </div>
                    <h1 style={{ fontSize:'1.5rem', fontWeight:'800', color:C.text, marginBottom:'0.3rem' }}>Forgot Password?</h1>
                    <p style={{ fontSize:'0.85rem', color:C.muted }}>Enter your email and we'll send you a reset code.</p>
                    <p style={{ fontSize:'0.75rem', color:'#F87171', marginTop:'0.5rem', fontWeight:'500' }}>ℹ️ If you don't see the email, please check your <b>Spam folder</b>.</p>
                </div>
                <form onSubmit={handleSendCode} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                    <div>
                        <label style={{ fontSize:'0.8rem', fontWeight:'600', color:C.text, display:'block', marginBottom:'0.4rem' }}>Email Address</label>
                        <div style={{ position:'relative' }}>
                            <span style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', color:C.primary }}><MailIcon /></span>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com"
                                style={{ width:'100%', background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:'10px', padding:'0.8rem 1rem 0.8rem 2.75rem', fontSize:'0.875rem', color:C.text, outline:'none', fontFamily:'inherit', transition:'all 0.2s ease' }}
                                onFocus={e => { e.target.style.borderColor=C.primary; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background=C.card; }}
                                onBlur={e  => { e.target.style.borderColor=C.border; e.target.style.boxShadow='none'; e.target.style.background=C.bg; }} />
                        </div>
                        {error && <p style={{ color:'#EF4444', fontSize:'0.75rem', fontWeight:'600', marginTop:'0.3rem' }}>{error}</p>}
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary" style={{ width:'100%', padding:'0.75rem' }}>
                        {loading ? "Sending..." : "Send Code"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgetPass;
