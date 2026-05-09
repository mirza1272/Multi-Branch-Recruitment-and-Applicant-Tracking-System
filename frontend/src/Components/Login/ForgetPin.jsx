import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const C = { bg:'#0F172A', card:'#1E293B', primary:'#3B82F6', text:'#F1F5F9', muted:'#94A3B8', border:'#334155' };

function ForgetPin() {
    const navigate = useNavigate();
    const [pin, setPin] = useState("");

    const handleVerifyPin = (e) => {
        e.preventDefault();
        if (pin.length === 6) {
            sessionStorage.setItem("resetOtp", pin);
            navigate('/change-password');
        }
    };

    return (
        <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:'16px', boxShadow:'0 4px 24px rgba(0,0,0,0.08)', width:'100%', maxWidth:'420px', padding:'2.5rem' }}>
                <Link to="/forget-password" style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', fontSize:'0.8rem', color:C.muted, textDecoration:'none', fontWeight:'600', marginBottom:'2rem' }}>
                    ← Back
                </Link>
                <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                    <div style={{ width:'48px', height:'48px', background:'rgba(59,130,246,0.1)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', color:C.primary }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <h1 style={{ fontSize:'1.5rem', fontWeight:'800', color:C.text, marginBottom:'0.3rem' }}>Verify Code</h1>
                    <p style={{ fontSize:'0.85rem', color:C.muted }}>Enter the 6-digit code sent to your email.</p>
                    <p style={{ fontSize:'0.75rem', color:'#F87171', marginTop:'0.5rem', fontWeight:'500' }}>ℹ️ Still no code? Check your <b>Spam folder</b>.</p>
                </div>
                <form onSubmit={handleVerifyPin} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                    <div>
                        <label style={{ fontSize:'0.8rem', fontWeight:'600', color:C.text, display:'block', marginBottom:'0.4rem' }}>Verification Code</label>
                        <input type="text" inputMode="numeric" required maxLength={6} value={pin} onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ''))} placeholder="000000"
                            style={{ width:'100%', background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:'10px', padding:'0.9rem', fontSize:'1.5rem', color:C.text, outline:'none', fontFamily:'inherit', textAlign:'center', letterSpacing:'0.5em', fontWeight:'700', transition:'all 0.2s ease' }}
                            onFocus={e => { e.target.style.borderColor=C.primary; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background=C.card; }}
                            onBlur={e  => { e.target.style.borderColor=C.border; e.target.style.boxShadow='none'; e.target.style.background=C.bg; }} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width:'100%', padding:'0.75rem' }}>Verify Code</button>
                </form>
                <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.8rem', color:C.muted }}>
                    Didn't receive code? <span style={{ color:C.primary, fontWeight:'600', cursor:'pointer' }}>Resend</span>
                </p>
            </div>
        </div>
    );
}

export default ForgetPin;
