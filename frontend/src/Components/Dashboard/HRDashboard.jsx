import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { STATUSES, getDynamicBranches, addBranch as addBranchToConstants } from "../../Constants";

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

const HRDashboard = () => {
    const [activeTab, setActiveTab] = useState('applications');
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [branches, setBranches] = useState(getDynamicBranches());
    const [newBranchName, setNewBranchName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Load data from localStorage
        const allApps = JSON.parse(localStorage.getItem('all_applications')) || [];
        setApplications(allApps);

        // For demo, we'll use a mix of hardcoded and localStorage jobs
        // In a real app, this would come from a database
        const storedJobs = JSON.parse(localStorage.getItem('managed_jobs')) || [];
        setJobs(storedJobs);
    }, []);

    const handleAddBranch = (e) => {
        e.preventDefault();
        if (newBranchName.trim()) {
            if (addBranchToConstants(newBranchName.trim())) {
                setBranches(getDynamicBranches());
                setNewBranchName("");
            }
        }
    };

    const handleDeleteJob = (id) => {
        const updated = jobs.filter(j => j.id !== id);
        setJobs(updated);
        localStorage.setItem('managed_jobs', JSON.stringify(updated));
    };

    const stats = [
        { label: 'Total Apps', value: applications.length, color: C.primary },
        { label: 'Shortlisted', value: applications.filter(a => a.status === 'Shortlisted').length, color: C.accent },
        { label: 'Hired', value: applications.filter(a => a.status === 'Hired').length, color: '#F59E0B' },
        { label: 'Interviews', value: applications.filter(a => a.status === 'Interview Scheduled').length, color: '#A855F7' }
    ];

    return (
        <div className="pt-24 pb-16 px-4 md:px-8" style={{ background: C.bg, minHeight: '100vh', color: C.text }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 mb-12">
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>HR <span style={{ color: C.primary }}>Dashboard</span></h1>
                        <p style={{ color: C.muted }}>Manage your recruitment pipeline and talent acquisition.</p>
                    </div>
                    <button
                        onClick={() => navigate('/post-job')}
                        style={{ background: C.primary, color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 20px rgba(59,130,246,0.2)' }}>
                        <svg style={{ width: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Post New Job
                    </button>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map(s => (
                        <div key={s.label} className="glass-card" style={{ padding: '2rem', borderRadius: '20px', textAlign: 'center', borderBottom: `4px solid ${s.color}` }}>
                            <h4 style={{ color: C.muted, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{s.label}</h4>
                            <p style={{ fontSize: '2.5rem', fontWeight: '900', color: s.color }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: `1px solid ${C.border}`, paddingBottom: '1rem', overflowX: 'auto', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }} className="scrollbar-hide">
                    {['applications', 'jobs', 'branches'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ background: 'none', border: 'none', color: activeTab === tab ? C.primary : C.muted, fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', position: 'relative', padding: '0.5rem 1rem', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                            {tab === 'applications' ? 'Applicants' : tab === 'jobs' ? 'Active Jobs' : 'Branches'}
                            {activeTab === tab && <div style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '3px', background: C.primary, borderRadius: '2px' }} />}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    {activeTab === 'applications' ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <th style={thS}>Candidate</th>
                                        <th style={thS}>Applied For</th>
                                        <th style={thS}>Date</th>
                                        <th style={thS}>Status</th>
                                        <th style={thS}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.length > 0 ? applications.map(app => (
                                        <tr key={app.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                                            <td style={tdS}>
                                                <div style={{ fontWeight: '700' }}>{app.candidate}</div>
                                                <div style={{ fontSize: '0.75rem', color: C.muted }}>{app.email}</div>
                                            </td>
                                            <td style={tdS}>
                                                <div style={{ fontWeight: '600' }}>{app.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: C.primary }}>{app.company}</div>
                                            </td>
                                            <td style={tdS}>{app.date}</td>
                                            <td style={tdS}>
                                                <span style={{
                                                    padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase',
                                                    background: app.status === 'Shortlisted' ? 'rgba(34,197,94,0.1)' : app.status === 'Rejected' ? 'rgba(239,68,68,0.1)' : app.status === 'Hired' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                                                    color: app.status === 'Shortlisted' ? C.accent : app.status === 'Rejected' ? C.error : app.status === 'Hired' ? '#F59E0B' : C.primary
                                                }}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td style={tdS}>
                                                <button
                                                    onClick={() => navigate(`/view-application/${app.id}`)}
                                                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: C.text, padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', transition: '0.2s' }}
                                                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                                    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}>
                                                    View App
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: C.muted }}>No applications found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : activeTab === 'jobs' ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <th style={thS}>Job Title</th>
                                        <th style={thS}>Branch</th>
                                        <th style={thS}>Apps</th>
                                        <th style={thS}>Type</th>
                                        <th style={thS}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.length > 0 ? jobs.map(job => (
                                        <tr key={job.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                                            <td style={tdS}><div style={{ fontWeight: '700' }}>{job.title}</div></td>
                                            <td style={tdS}>{job.branch || 'Global'}</td>
                                            <td style={tdS}>{applications.filter(a => a.jobId === job.id).length}</td>
                                            <td style={tdS}>{job.type}</td>
                                            <td style={tdS}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => navigate(`/post-job/${job.id}`)} style={actionBtnS(C.primary)}>Edit</button>
                                                    <button onClick={() => handleDeleteJob(job.id)} style={actionBtnS(C.error)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: C.muted }}>No jobs managed yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 md:p-12">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Manage Operating Branches</h3>
                                <form onSubmit={handleAddBranch} className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                                    <input
                                        type="text"
                                        value={newBranchName}
                                        onChange={(e) => setNewBranchName(e.target.value)}
                                        placeholder="Enter branch name..."
                                        style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '0.75rem 1rem', color: C.text, outline: 'none' }}
                                    />
                                    <button type="submit" className="w-full sm:w-auto" style={{ background: C.accent, color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                                        Add Branch
                                    </button>
                                </form>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                                {branches.map(b => (
                                    <div key={b} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600' }}>{b}</span>
                                        <span style={{ color: C.primary, fontSize: '0.8rem', fontWeight: '800' }}>ACTIVE</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const thS = { padding: '1.25rem 1.5rem', fontSize: '0.8rem', color: C.muted, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdS = { padding: '1.25rem 1.5rem', fontSize: '0.9rem' };
const actionBtnS = (color) => ({ background: 'transparent', border: `1px solid ${color}`, color: color, padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' });

export default HRDashboard;
