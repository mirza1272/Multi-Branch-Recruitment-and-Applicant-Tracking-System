import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { STATUSES } from "../../Constants";

const C = { bg: '#0F172A', card: '#1E293B', primary: '#3B82F6', text: '#F1F5F9', muted: '#94A3B8', border: '#334155', accent: '#2DD4BF', warning: '#F59E0B', danger: '#EF4444' };

// Generic Status Badge component
const StatusBadge = ({ status }) => {
    const getStyles = () => {
        switch (status) {
            case 'Shortlisted': return { bg: 'rgba(45,212,191,0.1)', color: C.accent };
            case 'Rejected': return { bg: 'rgba(239,68,68,0.1)', color: C.danger };
            case 'Hired': return { bg: 'rgba(245,158,11,0.1)', color: C.warning };
            default: return { bg: 'rgba(59,130,246,0.1)', color: C.primary };
        }
    };
    const s = getStyles();
    return (
        <span style={{
            padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase',
            background: s.bg, color: s.color
        }}>
            {status}
        </span>
    );
};

function Applications() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const isHR = user?.role === 'HR';

    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [loading, setLoading] = useState(true);

    // This effect simulates an API call and can be easily replaced with axios/fetch
    useEffect(() => {
        setLoading(true);
        // MOCK API CALL
        setTimeout(() => {
            const savedApps = JSON.parse(localStorage.getItem('all_applications')) || [];

            // Filter saved apps: Candidates only see their own, HR sees all
            const filteredSaved = isHR
                ? savedApps
                : savedApps.filter(app => app.email === user?.email);

            setApplications(filteredSaved);
            setLoading(false);
        }, 800);
    }, [isHR, user?.email]);

    const filteredApps = useMemo(() => {
        return applications.filter(app => {
            const targetField = isHR ? (app.candidate || "") : (app.title || "");
            const matchesSearch = targetField.toLowerCase().includes(searchTerm.toLowerCase()) || (app.company || "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === "All" || app.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [applications, searchTerm, filterStatus, isHR]);

    const handleStatusChange = (appId, newStatus) => {
        // Update state
        setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));

        // Persist to localStorage if it's a saved application
        const savedApps = JSON.parse(localStorage.getItem('all_applications')) || [];
        const updatedSaved = savedApps.map(app => app.id === appId ? { ...app, status: newStatus } : app);
        localStorage.setItem('all_applications', JSON.stringify(updatedSaved));
    };

    if (loading) return (
        <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: `4px solid ${C.border}`, borderTopColor: C.primary, borderRadius: '50%' }}></div>
        </div>
    );

    return (
        <div style={{ background: C.bg, minHeight: '100vh', color: C.text, padding: '4rem 1.5rem' }}>
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                            {isHR ? 'Candidate' : 'My'} <span style={{ color: C.primary }}>Applications</span>
                        </h1>
                        <p style={{ color: C.muted, fontSize: '1.05rem' }}>
                            {isHR ? 'Review and manage incoming applications for your positions.' : 'Track and manage your job applications across all branches.'}
                        </p>
                    </div>
                    {isHR && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ background: 'rgba(59,130,246,0.1)', border: `1px solid ${C.border}`, padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.65rem', fontWeight: '800', color: C.muted, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Hiring Branch</p>
                                <p style={{ fontSize: '0.9rem', fontWeight: '700', color: C.primary }}>{user.location || 'Global'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><SearchIcon /></span>
                        <input
                            type="text"
                            placeholder={isHR ? "Search by candidate name..." : "Search by job title or company..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '0.85rem 1rem 0.85rem 2.75rem', color: C.text, fontSize: '0.9rem', outline: 'none' }}
                        />
                    </div>
                    <div style={{ minWidth: '200px' }}>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '0.85rem 1rem', color: C.text, fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="All">All Statuses</option>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {/* Main Content Card */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                    {filteredApps.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    <tr>
                                        <th style={thS}>{isHR ? 'Candidate' : 'Job Role'}</th>
                                        <th style={thS}>Company & Type</th>
                                        <th style={thS}>Date Applied</th>
                                        <th style={thS}>Branch</th>
                                        <th style={thS}>Status</th>
                                        <th style={thS}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredApps.map((app, idx) => (
                                        <tr key={app.id} style={{ borderBottom: idx !== filteredApps.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                                            <td style={tdS}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, fontWeight: '800' }}>
                                                        {isHR ? app.candidate[0] : app.title[0]}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{isHR ? app.candidate : app.title}</p>
                                                        {isHR && <p style={{ fontSize: '0.75rem', color: C.muted }}>Applying for: {app.title}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdS}>
                                                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{app.company}</p>
                                                <p style={{ fontSize: '0.75rem', color: C.muted }}>{app.type}</p>
                                            </td>
                                            <td style={tdS}>
                                                <p style={{ fontSize: '0.85rem', color: C.muted }}>{app.date}</p>
                                            </td>
                                            <td style={tdS}>
                                                <p style={{ fontSize: '0.85rem', color: C.muted }}>{app.branch}</p>
                                            </td>
                                            <td style={tdS}>
                                                <StatusBadge status={app.status} />
                                            </td>
                                            <td style={tdS}>
                                                {isHR ? (
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                        style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, padding: '0.4rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                                                    >
                                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                ) : (
                                                    <button onClick={() => navigate(`/job-details/${app.jobId}`)} style={{ background: 'transparent', border: `1px solid ${C.primary}`, color: C.primary, padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>View Job</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                            <p style={{ color: C.muted }}>No applications found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const thS = { padding: '1.25rem 1.5rem', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: C.muted, letterSpacing: '0.05em' };
const tdS = { padding: '1.25rem 1.5rem' };

const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

export default Applications;
