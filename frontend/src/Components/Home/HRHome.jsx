import React from "react";
import { useNavigate } from "react-router-dom";

const C = {
    bg: '#0F172A',
    card: '#1E293B',
    primary: '#3B82F6',
    accent: '#22C55E',
    text: '#F1F5F9',
    muted: '#94A3B8',
    border: '#334155'
};

const HRHome = () => {
    const navigate = useNavigate();

    // Ensure page starts at the top instantly
    React.useEffect(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = '';
    }, []);

    return (
        <div className="animate-fade-in" style={{ background: C.bg, minHeight: '100vh', color: C.text }}>

            {/* Hero Section */}
            <div className="px-4 md:px-8" style={{
                minHeight: '93vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '4rem',
                paddingBottom: '4rem',
                background: `linear-gradient(rgba(15,23,42,0.8), rgba(15,23,42,0.95)), url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textAlign: 'center',
                borderBottom: `1px solid ${C.border}`
            }}>
                <div className="animate-fade-in-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl" style={{ fontWeight: '900', marginBottom: '1.5rem', lineHeight: 1.2 }}>Your Bridge to <span style={{ color: C.primary }}>Global Talent</span></h1>
                    <p className="text-base md:text-lg" style={{ color: C.muted, marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 2.5rem' }}>HRConnect links your branches with top candidates, facilitating direct hiring through professional email communication.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate('/hr-dashboard')}
                            style={{ background: C.primary, color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 15px 30px rgba(59,130,246,0.25)', transition: '0.3s' }}>
                            Go to Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/post-job')}
                            style={{ background: 'rgba(255,255,255,0.05)', color: C.text, border: `1px solid ${C.border}`, padding: '1rem 2rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', transition: '0.3s' }}>
                            Post a Job
                        </button>
                    </div>
                </div>
            </div>

            {/* Trusted By Section */}
            <div className="py-16 md:py-20 px-4 md:px-8" style={{ borderBottom: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p style={{ textAlign: 'center', color: C.muted, fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.2em', marginBottom: '3rem' }}>Trusted by HR Teams Globally</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        <FeatureCard
                            icon="🌍"
                            title="Global Scale"
                            desc="Manage recruitment across multiple international branches from a single unified interface."
                        />
                        <FeatureCard
                            icon="⚡"
                            title="Instant Publishing"
                            desc="Get your job openings live in seconds and start receiving applications immediately."
                        />
                        <FeatureCard
                            icon="📊"
                            title="Direct Email Pipeline"
                            desc="Receive candidate dossiers directly in your inbox and initiate professional conversations instantly."
                        />
                    </div>
                </div>
            </div>

            {/* Recruiter Trust Section */}
            <div className="py-16 md:py-32 px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div>
                        <h2 className="text-3xl md:text-4xl" style={{ fontWeight: '900', marginBottom: '2rem' }}>Why Recruiters <span style={{ color: C.primary }}>Trust Us?</span></h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <TrustItem title="Centralized Management" desc="Forget switching between tabs. Manage jobs, applicants, and branches in one place." />
                            <TrustItem title="Secure Data Handling" desc="Your candidate data is encrypted and stored securely, meeting international standards." />
                            <TrustItem title="Direct Email Bridge" desc="Our platform connects you to talent; final communication and hiring happen through your professional email." />
                        </div>
                    </div>
                    <div style={{ background: C.card, borderRadius: '30px', border: `1px solid ${C.border}`, position: 'relative' }} className="p-8 md:p-12">
                        <p className="text-xl md:text-2xl" style={{ fontStyle: 'italic', lineHeight: 1.6, marginBottom: '2rem' }}>"The HRConnect changed how we hire. We've reduced our time-to-hire by 40% across all our European offices."</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div>
                                <p style={{ fontWeight: '800' }}>Sarah Jenkins</p>
                                <p style={{ fontSize: '0.8rem', color: C.muted }}>Chief People Officer, TechFlow</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px', border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{icon}</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>{title}</h3>
        <p style={{ color: C.muted, lineHeight: 1.6, fontSize: '0.95rem' }}>{desc}</p>
    </div>
);

const TrustItem = ({ title, desc }) => (
    <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ color: C.primary, fontSize: '1.2rem', fontWeight: '900' }}>✓</div>
        <div>
            <h4 style={{ fontWeight: '800', marginBottom: '0.25rem' }}>{title}</h4>
            <p style={{ color: C.muted, fontSize: '0.9rem' }}>{desc}</p>
        </div>
    </div>
);

export default HRHome;
