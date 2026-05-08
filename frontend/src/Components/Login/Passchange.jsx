import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const C = { bg:'#0F172A', card:'#1E293B', primary:'#3B82F6', accent:'#22C55E', text:'#F1F5F9', muted:'#94A3B8', border:'#334155', error:'#EF4444' };

function Passchange() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword]         = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSuccess, setIsSuccess]             = useState(false);
    const [error, setError]                     = useState("");

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        setError("");

        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");
        if (!strongRegex.test(newPassword)) {
            setError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
            return;
        }

        if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
        // Backend integration point: call API to update password
        console.log("Updating password to:", newPassword);
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
    };

    const iStyle = (hasErr) => ({
        width:'100%', background:C.bg, border:`1.5px solid ${hasErr ? C.error : C.border}`,
        borderRadius:'10px', padding:'0.8rem 1rem', fontSize:'0.875rem', color:C.text, outline:'none', fontFamily:'inherit',
        transition:'all 0.2s ease'
    });

    if (isSuccess) return (
        <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:'16px', boxShadow:'0 4px 24px rgba(0,0,0,0.08)', width:'100%', maxWidth:'420px', padding:'2.5rem', textAlign:'center' }}>
                <div style={{ width:'64px', height:'64px', background:'rgba(34,197,94,0.1)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem', color:C.accent }}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h1 style={{ fontSize:'1.5rem', fontWeight:'800', color:C.text, marginBottom:'0.5rem' }}>Password Updated!</h1>
                <p style={{ color:C.muted, fontSize:'0.875rem', marginBottom:'1.5rem' }}>Your password has been changed successfully. Redirecting to login...</p>
                <div style={{ background:C.bg, borderRadius:'99px', height:'6px', overflow:'hidden' }}>
                    <div className="animate-progress" style={{ height:'100%', background:C.accent, borderRadius:'99px' }} />
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:'16px', boxShadow:'0 4px 24px rgba(0,0,0,0.08)', width:'100%', maxWidth:'420px', padding:'2.5rem' }}>
                <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                    <div style={{ width:'48px', height:'48px', background:'rgba(59,130,246,0.1)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', color:C.primary }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h1 style={{ fontSize:'1.5rem', fontWeight:'800', color:C.text, marginBottom:'0.3rem' }}>New Password</h1>
                    <p style={{ fontSize:'0.85rem', color:C.muted }}>Choose a strong password you haven't used before.</p>
                </div>
                <form onSubmit={handleUpdatePassword} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                    <div>
                        <label style={{ fontSize:'0.8rem', fontWeight:'600', color:C.text, display:'block', marginBottom:'0.4rem' }}>New Password</label>
                        <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" style={iStyle(false)}
                            onFocus={e => { e.target.style.borderColor=C.primary; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background=C.card; }}
                            onBlur={e  => { e.target.style.borderColor=C.border; e.target.style.boxShadow='none'; e.target.style.background=C.bg; }} />
                    </div>
                    <div>
                        <label style={{ fontSize:'0.8rem', fontWeight:'600', color:C.text, display:'block', marginBottom:'0.4rem' }}>Confirm Password</label>
                        <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" style={iStyle(!!error)}
                            onFocus={e => { e.target.style.borderColor=error ? C.error : C.primary; e.target.style.boxShadow=`0 0 0 3px ${error ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.12)'}`; e.target.style.background=C.card; }}
                            onBlur={e  => { e.target.style.borderColor=error ? C.error : C.border; e.target.style.boxShadow='none'; e.target.style.background=C.bg; }} />
                        {error && <p style={{ color:C.error, fontSize:'0.75rem', fontWeight:'600', marginTop:'0.3rem' }}>{error}</p>}
                    </div>
                    <button type="submit" className="btn-primary" style={{ width:'100%', padding:'0.75rem' }}>Update Password</button>
                </form>
            </div>
        </div>
    );
}

export default Passchange;
