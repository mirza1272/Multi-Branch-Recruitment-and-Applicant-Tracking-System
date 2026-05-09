import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationByIdRequest, updateApplicationStatusRequest } from "../../api/api";

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

import { STATUSES } from "../../Constants";

const ViewCandidateApp = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchApplication = async () => {
            console.log("🔍 Fetching application details for ID:", id);
            try {
                const response = await getApplicationByIdRequest(id);
                console.log("✅ API Response:", response.data);

                const appData = response.data?.data?.application;
                if (appData) {
                    setApplication(appData);
                    setStatus(appData.status || "pending");
                } else {
                    console.error("❌ Application data missing in response");
                }
            } catch (err) {
                console.error("❌ Failed to fetch application:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchApplication();
        } else {
            console.error("❌ No application ID found in URL");
            setLoading(false);
        }
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        setStatus(newStatus);
        try {
            await updateApplicationStatusRequest(id, { status: newStatus });
            setApplication(prev => ({ ...prev, status: newStatus }));
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update status");
        }
    };

    if (loading) return <div style={{ padding: '100px', color: C.text, textAlign: 'center', background: C.bg, minHeight: '100vh' }}>Loading candidate application details...</div>;
    if (!application) return <div style={{ padding: '100px', color: C.text, textAlign: 'center', background: C.bg, minHeight: '100vh' }}>Application details not found. Please try again or contact support.</div>;

    const candidateName = application.candidateName || application.userId?.name || "Unknown Candidate";
    const candidateInitial = candidateName.charAt(0).toUpperCase();

    return (
        <div style={{ background: C.bg, minHeight: '100vh', padding: '100px 2rem 4rem', color: C.text }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Back Button */}
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: C.primary, fontWeight: '700', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ← Back to Dashboard
                </button>

                <div className="glass-card" style={{ padding: '3rem', borderRadius: '24px', background: C.card, border: `1px solid ${C.border}` }}>
                    {/* Profile Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900', color: '#fff' }}>
                                {candidateInitial}
                            </div>
                            <div>
                                <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.25rem' }}>{candidateName}</h1>
                                <p style={{ color: C.primary, fontWeight: '700' }}>Applied for: {application.jobId?.title}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: C.muted, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    style={{ background: C.bg, color: C.text, border: `1.5px solid ${C.primary}`, borderRadius: '10px', padding: '0.6rem 1rem', fontSize: '0.9rem', fontWeight: '700', outline: 'none', textTransform: 'capitalize' }}>
                                    {STATUSES.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => navigate(`/schedule-interview/${id}`)}
                                style={{ background: '#8B5CF6', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer', transition: '0.3s', boxShadow: '0 10px 20px rgba(139,92,246,0.2)' }}
                                onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                                📅 Schedule Interview
                            </button>
                        </div>
                    </div>

                    {/* Candidate Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                        <InfoItem label="Email Address" value={application.candidateEmail || application.userId?.email} />
                        <InfoItem label="Phone Number" value={application.candidatePhone || "Not provided"} />
                        <InfoItem label="Location" value={application.candidateLocation || "Not provided"} />
                        <InfoItem label="Date Applied" value={new Date(application.createdAt).toLocaleDateString()} />
                        {application.candidateExperience && <InfoItem label="Experience" value={`${application.candidateExperience} Years`} />}
                        {application.candidateQualification && <InfoItem label="Qualification" value={application.candidateQualification} />}
                    </div>

                    {/* Documents Section */}
                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={SectionTitleS}>Documents</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            {application.resumeUrl ? (
                                <a
                                    href={application.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ ...DocBtnS(C.primary), textDecoration: 'none' }}>
                                    <span style={{ fontSize: '1.2rem' }}>📄</span> View Resume
                                </a>
                            ) : (
                                <span style={{ color: C.muted, fontSize: '0.9rem' }}>No resume uploaded</span>
                            )}

                            {application.coverLetterUrl ? (
                                <a
                                    href={application.coverLetterUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ ...DocBtnS(C.accent), textDecoration: 'none' }}>
                                    <span style={{ fontSize: '1.2rem' }}>✉️</span> View Cover Letter
                                </a>
                            ) : (
                                <div style={{ 
                                    ...DocBtnS(C.border), 
                                    opacity: 0.5, 
                                    cursor: 'not-allowed',
                                    color: C.muted,
                                    background: 'rgba(255,255,255,0.05)'
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>✉️</span> Cover Letter Not Provided
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills Section */}
                    {application.candidateSkills && (
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={SectionTitleS}>Key Skills</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {application.candidateSkills.split(',').map(s => (
                                    <span key={s} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem', color: C.muted }}>
                                        {s.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bio Section */}
                    {(application.userId?.bio || application.candidateBio) && (
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={SectionTitleS}>Professional Bio</h3>
                            <p style={{ color: C.muted, lineHeight: 1.6, fontSize: '0.95rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '15px', border: `1px solid ${C.border}` }}>
                                {application.userId?.bio || application.candidateBio}
                            </p>
                        </div>
                    )}

                    {/* Application Details */}
                    <div>
                        <h3 style={SectionTitleS}>Hiring Answers</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {application.additionalInfo && (
                                <AnswerBox q="Why do you want to work here?" a={application.additionalInfo} />
                            )}
                            {application.achievement && (
                                <AnswerBox q="Notable achievement in previous role?" a={application.achievement} />
                            )}
                            {(!application.additionalInfo && !application.achievement) && (
                                <p style={{ color: C.muted, fontSize: '0.9rem' }}>No additional answers provided.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
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
