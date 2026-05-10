import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobByIdRequest, getJobsRequest } from "../../api/api";

const C = { bg: '#0F172A', card: '#1E293B', primary: '#3B82F6', text: '#F1F5F9', muted: '#94A3B8', border: '#334155', accent: '#2DD4BF' };

// Icons
const CheckIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const ClockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const MapIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const DollarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const BriefcaseIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch job details
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getJobByIdRequest(id);
                setJob(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load job details");
                console.error("Error fetching job:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    // Fetch related jobs
    useEffect(() => {
        const fetchRelatedJobs = async () => {
            if (!job) return;

            try {
                const response = await getJobsRequest({
                    category: job.category,
                    limit: 6,
                });

                const jobs = response.data.data.jobs || [];
                const filtered = jobs
                    .filter(j => j._id !== job._id)
                    .map(j => {
                        let score = 0;
                        if (j.department === job.department) score += 5;
                        if (j.branchId === job.branchId) score += 3;
                        if (j.branchId?.branchName === job.branchId?.branchName) score += 1;
                        return { ...j, score };
                    })
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3);

                setRelatedJobs(filtered);
            } catch (err) {
                console.error("Error fetching related jobs:", err);
            }
        };

        fetchRelatedJobs();
    }, [job]);

    return (
        <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'Inter, sans-serif' }}>

            {/* Loading State */}
            {loading && (
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: C.muted, fontSize: '1.1rem' }}>Loading job details...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', maxWidth: '500px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#DC2626' }}>Error</h2>
                        <p style={{ color: C.muted, marginBottom: '2rem' }}>{error}</p>
                        <button
                            onClick={() => navigate('/jobs')}
                            style={{
                                padding: '0.75rem 2rem',
                                borderRadius: '8px',
                                background: C.primary,
                                color: 'white',
                                border: 'none',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            Back to Jobs
                        </button>
                    </div>
                </div>
            )}

            {/* Content */}
            {!loading && job && (
                <>
                    {/* Hero Section with Premium Background */}
                    <div className="hero-section" style={{ height: '400px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                            alt="Hero Background"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35) contrast(1.1)' }}
                        />
                        {/* Decorative Overlay */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0) 0%, rgba(15,23,42,0.8) 100%)' }}></div>

                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', animation: 'fadeInDown 0.8s ease-out' }}>
                            <h1 className="hero-title" style={{ fontSize: '2.75rem', fontWeight: '900', letterSpacing: '-0.03em', textShadow: '0 4px 20px rgba(0,0,0,0.6)', margin: 0 }}>
                                Job <span style={{ color: C.primary }}>Details</span>
                            </h1>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 py-12" style={{ marginTop: '-60px', position: 'relative', zIndex: 10 }}>
                        <div className="job-details-grid">

                            {/* Left Content */}
                            <div style={{ animation: 'fadeInLeft 0.6s ease-out' }}>
                                {/* Main Header Card */}
                                <div className="main-content-card" style={{ background: C.card, borderRadius: '20px', border: `1px solid ${C.border}`, padding: '2.5rem', marginBottom: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.2rem' }}>
                                                <h2 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.02em' }}>{job.title}</h2>
                                                <span style={{ fontSize: '0.65rem', background: 'rgba(45,212,191,0.1)', color: C.accent, padding: '0.2rem 0.6rem', borderRadius: '99px', fontWeight: '800' }}>Active</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: C.muted }}>
                                                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{job.company}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${C.border}` }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary }}><BriefcaseIcon /></div>
                                            <div>
                                                <p style={{ fontSize: '0.6rem', color: C.muted, fontWeight: '700', textTransform: 'uppercase' }}>Department</p>
                                                <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{job.department}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary }}><ClockIcon /></div>
                                            <div>
                                                <p style={{ fontSize: '0.6rem', color: C.muted, fontWeight: '700', textTransform: 'uppercase' }}>Job Type</p>
                                                <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{job.type}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary }}><DollarIcon /></div>
                                            <div>
                                                <p style={{ fontSize: '0.6rem', color: C.muted, fontWeight: '700', textTransform: 'uppercase' }}>Salary Range</p>
                                                <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{job.salary || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description Content */}
                                <div className="main-content-card" style={{ background: C.card, borderRadius: '20px', border: `1px solid ${C.border}`, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                                    <section>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ width: '4px', height: '18px', background: C.primary, borderRadius: '2px' }}></span> Job Description
                                        </h3>
                                        <p style={{ lineHeight: 1.8, color: C.muted, fontSize: '0.9rem' }}>
                                            {job.description}
                                        </p>
                                    </section>

                                    {(job.requirements || job.responsibilities) && (
                                        <section>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ width: '4px', height: '18px', background: C.primary, borderRadius: '2px' }}></span> Key Responsibilities
                                            </h3>
                                            <div style={{ display: 'grid', gap: '1rem' }}>
                                                {(job.requirements || job.responsibilities).split('\n').filter(r => r.trim()).map((req, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                        <span style={{ marginTop: '3px', flexShrink: 0 }}><CheckIcon /></span>
                                                        <p style={{ color: C.muted, fontSize: '0.9rem', lineHeight: 1.6 }}>{req.trim()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <div className="sidebar-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeInRight 0.6s ease-out' }}>
                                <button
                                    onClick={() => {
                                        const isLoggedIn = !!localStorage.getItem('user');
                                        if (isLoggedIn) {
                                            navigate(`/apply-job/${job._id}`);
                                        } else {
                                            navigate('/signup');
                                        }
                                    }}
                                    className="btn-primary"
                                    style={{ width: '100%', padding: '1.1rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '800', boxShadow: '0 10px 20px rgba(37,99,235,0.2)', cursor: 'pointer' }}
                                >
                                    Apply For This Job
                                </button>

                                {/* Job Overview */}
                                <div style={{ background: C.card, borderRadius: '16px', border: `1px solid ${C.border}`, padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${C.border}` }}>Job Overview</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        {[
                                            { label: 'Job Title', val: job.title, icon: <BriefcaseIcon /> },
                                            { label: 'Experience', val: job.experience || "5+ Years", icon: <CheckIcon /> },
                                            { label: 'Education', val: job.degree || "Master's Degree", icon: <CheckIcon /> },
                                            { label: 'Seats Available', val: `${job.seats} Positions`, icon: <CheckIcon /> },
                                            { label: 'Location', val: job.branchId?.branchName || "Not specified", icon: <MapIcon /> },
                                            { label: 'Offered Salary', val: job.salary, icon: <DollarIcon /> },
                                            { label: 'Department', val: job.department, icon: <BriefcaseIcon /> }
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                                                <div style={{ color: C.primary, marginTop: '2px', flexShrink: 0 }}>{item.icon}</div>
                                                <div>
                                                    <p style={{ fontSize: '0.65rem', color: C.muted, marginBottom: '0.1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{item.val}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Related Jobs Section */}
                        <div style={{ marginTop: '5rem', animation: 'fadeInUp 0.8s ease-out' }}>
                            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.75rem' }}>Recommended <span style={{ color: C.primary }}>Jobs</span></h2>
                                <p style={{ color: C.muted, fontSize: '1.1rem' }}>Based on the <span style={{ color: C.primary, fontWeight: '700' }}>{job.department}</span> department and your location preferences.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                                {relatedJobs.map(rJob => (
                                    <div key={rJob._id} style={{ background: C.card, borderRadius: '20px', border: `1px solid ${C.border}`, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                                        onClick={() => navigate(`/job-details/${rJob._id}`)}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ width: '56px', height: '56px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, fontWeight: '900', fontSize: '1.25rem' }}>
                                                {rJob.company?.[0] || 'J'}
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: C.accent, fontWeight: '800', textTransform: 'uppercase', padding: '0.3rem 0.75rem', background: 'rgba(45,212,191,0.1)', borderRadius: '99px' }}>
                                                {rJob.score >= 5 ? 'Top Match' : 'Suggested'}
                                            </span>
                                        </div>

                                        <div>
                                            <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{rJob.title}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: C.muted, fontSize: '0.9rem' }}>
                                                <span>{rJob.company}</span>
                                                <span>•</span>
                                                <span>{rJob.location}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '0.75rem', background: C.bg, padding: '0.4rem 0.8rem', borderRadius: '8px', border: `1px solid ${C.border}`, color: C.muted }}>{rJob.type}</span>
                                            <span style={{ fontSize: '0.75rem', background: C.bg, padding: '0.4rem 0.8rem', borderRadius: '8px', border: `1px solid ${C.border}`, color: C.muted }}>{rJob.department}</span>
                                        </div>

                                        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: '800', color: C.text }}>{rJob.salary ? rJob.salary.split(' ')[0] : '$0'}<span style={{ fontSize: '0.8rem', color: C.muted, fontWeight: '400' }}> / Monthly</span></span>
                                            <button style={{ background: 'transparent', border: 'none', color: C.primary, fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                View Detail →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </>
            )}

            {/* Global Animations & Responsive CSS */}
            <style>{`
                @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

                .job-details-grid {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 2.5rem;
                    align-items: start;
                }

                @media (max-width: 1024px) {
                    .job-details-grid {
                        grid-template-columns: 1fr 300px;
                        gap: 1.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .job-details-grid {
                        grid-template-columns: 1fr;
                    }
                    .hero-section {
                        height: 300px !important;
                    }
                    .hero-title {
                        font-size: 2rem !important;
                    }
                    .main-content-card {
                        padding: 1.5rem !important;
                    }
                    .sidebar-container {
                        order: -1; /* Move apply button and overview to top on mobile */
                    }
                }
            `}</style>
        </div>
    );
}

export default JobDetails;
