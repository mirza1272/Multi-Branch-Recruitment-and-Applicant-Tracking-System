import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { STATUSES } from "../../Constants";

const C = {
    bg: '#0F172A',
    card: '#1E293B',
    primary: '#3B82F6',
    accent: '#22C55E',
    error: '#EF4444',
    text: '#F1F5F9',
    muted: '#94A3B8',
    border: '#334155'
};

const ViewCandidateApp = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
        const allApps = JSON.parse(localStorage.getItem('all_applications')) || [];
        const app = allApps.find(a => a.id.toString() === id);
        if (app) {
            setApplication(app);
            setStatus(app.status);
        }
    }, [id]);

    const handleStatusUpdate = (newStatus) => {
        setStatus(newStatus);
        const allApps = JSON.parse(localStorage.getItem('all_applications')) || [];
        const updated = allApps.map(a => a.id.toString() === id ? { ...a, status: newStatus } : a);
        localStorage.setItem('all_applications', JSON.stringify(updated));
    };

    if (!application) return <div style={{ padding: '100px', color: C.text, textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ background: C.bg, minHeight: '100vh', padding: '100px 2rem 4rem', color: C.text }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Back Button */}
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: C.primary, fontWeight: '700', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ← Back to Dashboard
                </button>

                <div className="glass-card" style={{ padding: '3rem', borderRadius: '24px' }}>
                    {/* Profile Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900' }}>
                                {application.candidate[0]}
                            </div>
                            <div>
                                <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.25rem' }}>{application.candidate}</h1>
                                <p style={{ color: C.primary, fontWeight: '700' }}>Applied for: {application.title}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: C.muted, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Status</label>
                            <select 
                                value={status} 
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                style={{ background: C.bg, color: C.text, border: `1.5px solid ${C.primary}`, borderRadius: '10px', padding: '0.6rem 1rem', fontSize: '0.9rem', fontWeight: '700', outline: 'none' }}>
                                {STATUSES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Candidate Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                        <InfoItem label="Email Address" value={application.email} />
                        <InfoItem label="Phone Number" value={application.phone || "+1 234 567 890"} />
                        <InfoItem label="Location" value={application.location || "New York, USA"} />
                        <InfoItem label="Date Applied" value={application.date} />
                    </div>

                    {/* Documents Section */}
                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={SectionTitleS}>Documents</h3>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <button
                                onClick={() => setShowResumeModal(true)}
                                style={DocBtnS(C.primary)}>
                                <span style={{ fontSize: '1.2rem' }}>📄</span> View Resume
                            </button>
                            {application.coverLetterName && (
                                <button style={DocBtnS(C.accent)}>
                                    <span style={{ fontSize: '1.2rem' }}>✉️</span> View Cover Letter
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={SectionTitleS}>Key Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {(application.skills || "Management, Leadership, Strategy").split(',').map(s => (
                                <span key={s} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem', color: C.muted }}>
                                    {s.trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Application Details */}
                    <div>
                        <h3 style={SectionTitleS}>Hiring Answers</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <AnswerBox q="Why do you want to work here?" a={application.q1 || "I am passionate about the innovative culture and the impact the company has on the industry. My skills align perfectly with the requirements."} />
                            <AnswerBox q="Notable achievement in previous role?" a={application.q2 || "Successfully led a team of 10 to implement a new CRM system, increasing efficiency by 25%."} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Modal */}
            {showResumeModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
                    <div style={{ background: C.card, width: '90%', maxWidth: '800px', height: '85vh', borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '1.5rem 2rem', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Resume: {application.candidate}</h3>
                            <button onClick={() => setShowResumeModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: C.error, border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Close Preview</button>
                        </div>
                        <div style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                            {/* In a real app, this would be an <iframe> or <embed> with the PDF URL */}
                            <div style={{ textAlign: 'center', color: C.muted }}>
                                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📄</div>
                                <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>[ PDF PREVIEW COMPONENT ]</p>
                                <p>File: {application.resumeName || "resume.pdf"}</p>
                                <p style={{ maxWidth: '400px', margin: '1rem auto', fontSize: '0.9rem' }}>This modal represents a high-fidelity PDF viewer. In the production environment, the file would be rendered here via secure URL.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div>
        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: C.muted, textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</label>
        <p style={{ fontSize: '1rem', fontWeight: '600', color: C.text }}>{value}</p>
    </div>
);

const AnswerBox = ({ q, a }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${C.border}` }}>
        <p style={{ color: C.primary, fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.75rem', textTransform: 'uppercase' }}>{q}</p>
        <p style={{ color: C.muted, lineHeight: 1.6, fontSize: '0.95rem' }}>{a}</p>
    </div>
);

const SectionTitleS = { fontSize: '1.1rem', fontWeight: '800', color: C.text, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' };
const DocBtnS = (color) => ({ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.text, padding: '1rem 2rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', transition: '0.2s', borderLeft: `4px solid ${color}` });

export default ViewCandidateApp;
