import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ALL_JOBS } from "./JobsData";
import { CATEGORIES, getDynamicBranches } from "../../Constants";

const SearchIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const MapPinIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BriefcaseIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const ClockIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const DollarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ArrowRightIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;

const C = {
    bg: '#0F172A', card: '#1E293B', primary: '#3B82F6',
    accent: '#22C55E', text: '#F1F5F9', muted: '#94A3B8', border: '#334155',
};

const JOBS_PER_PAGE = 6;

function Jobs() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [searchTerm, setSearchTerm] = useState(searchParams.get("keyword") || "");
    const [branch, setBranch] = useState(searchParams.get("branch") || "All");
    const [department, setDepartment] = useState(searchParams.get("department") || "All");
    const [minSalary, setMinSalary] = useState(0);
    const [sortBy, setSortBy] = useState("Latest");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'HR') {
            navigate('/hr-dashboard');
        }
    }, [navigate]);

    useEffect(() => {
        setSearchTerm(searchParams.get("keyword") || "");
        setBranch(searchParams.get("branch") || "All");
        setDepartment(searchParams.get("department") || "All");
    }, [location.search]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, branch, department, minSalary, sortBy]);

    const filteredResults = useMemo(() => {
        let r = ALL_JOBS.filter(j =>
            (j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (branch === "All" || j.branchId === branch) &&
            (department === "All" || j.category === department) &&
            j.salaryNumeric >= minSalary
        );
        return r.sort((a, b) => b.timestamp - a.timestamp);
    }, [searchTerm, branch, department, minSalary, sortBy]);

    const totalPages = Math.ceil(filteredResults.length / JOBS_PER_PAGE);
    const displayedJobs = filteredResults.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

    const inputS = { width: '100%', background: '#0F172A', border: `1.5px solid ${C.border}`, borderRadius: '8px', padding: '0.55rem 0.85rem 0.55rem 2.5rem', fontSize: '0.8rem', color: C.text, outline: 'none', fontFamily: 'inherit' };
    const labelS = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: C.muted, display: 'block', marginBottom: '0.4rem' };

    return (
        <div className="animate-fade-in" style={{ background: C.bg, minHeight: '100vh', color: C.text }}>

            {/* Page Header */}
            <div style={{
                backgroundImage: `linear-gradient(rgba(15,23,42,0.88), rgba(15,23,42,0.88)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderBottom: `1px solid ${C.border}`,
                padding: '3.5rem 1rem',
                textAlign: 'center',
                position: 'relative',
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: C.text, marginBottom: '0.5rem' }}>Jobs Directory</h1>
                    <p style={{ color: C.muted, fontSize: '0.9rem' }}>Browse all open positions across our branches and departments</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row md:flex-wrap" style={{ gap: '2rem' }}>

                    {/* Sidebar */}
                    <aside className="w-full md:w-[260px] flex-shrink-0">
                        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: C.text, marginBottom: '1.5rem' }}>Search & Filter</h3>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={labelS}>Keywords</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><SearchIcon /></span>
                                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Title, company..." style={inputS}
                                        onFocus={e => e.target.style.borderColor = C.primary}
                                        onBlur={e => e.target.style.borderColor = C.border} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={labelS}>Branch</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><MapPinIcon /></span>
                                    <select value={branch} onChange={e => setBranch(e.target.value)} style={{ ...inputS, cursor: 'pointer', appearance: 'none' }}>
                                        <option value="All">All Branches</option>
                                        {getDynamicBranches().map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={labelS}>Category</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: C.primary }}><BriefcaseIcon /></span>
                                    <select value={department} onChange={e => setDepartment(e.target.value)} style={{ ...inputS, cursor: 'pointer', appearance: 'none' }}>
                                        <option value="All">All Categories</option>
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={labelS}>Min Salary: <span style={{ color: C.primary }}>${minSalary}</span></label>
                                <input type="range" min="0" max="10000" step="500" value={minSalary}
                                    onChange={e => setMinSalary(parseInt(e.target.value))}
                                    style={{ width: '100%', accentColor: C.primary, marginBottom: '1rem' }} />
                                <button onClick={() => { setSearchTerm(""); setBranch("All"); setDepartment("All"); setMinSalary(0); }}
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: `1.5px solid ${C.primary}`, background: 'transparent', color: C.primary, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main */}
                    <main style={{ flex: 1, minWidth: 0 }}>
                        {/* Sort row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.8rem', color: C.muted }}>Showing <strong style={{ color: C.text }}>{filteredResults.length}</strong> jobs</p>
                        </div>

                        {/* Job Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {displayedJobs.length > 0 ? displayedJobs.map(job => (
                                <div key={job.jobId} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                                            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: C.text }}>{job.title}</h3>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: C.muted, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <span style={{ width: '6px', height: '6px', background: C.accent, borderRadius: '50%', display: 'inline-block' }} />{job.company}
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                            {[
                                                { icon: <BriefcaseIcon />, text: job.category },
                                                { icon: <ClockIcon />, text: job.type },
                                                { icon: <DollarIcon />, text: `$${job.salary}` },
                                                { icon: <MapPinIcon />, text: job.location },
                                                { icon: <SearchIcon />, text: `${job.seats} Seats` },
                                            ].map((tag, idx) => (
                                                <span key={idx} className="tag-pill">
                                                    <span style={{ color: C.primary }}>{tag.icon}</span>{tag.text}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => navigate(`/job-details/${job.jobId}`)} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', flexShrink: 0 }}>Job Details</button>
                                </div>
                            )) : (
                                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '4rem', textAlign: 'center' }}>
                                    <p style={{ color: C.muted }}>No jobs match your search criteria.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)}
                                        style={{
                                            width: '36px', height: '36px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', border: '1.5px solid', transition: 'all 0.2s',
                                            background: currentPage === i + 1 ? C.primary : C.card,
                                            color: currentPage === i + 1 ? '#FFFFFF' : C.muted,
                                            borderColor: currentPage === i + 1 ? C.primary : C.border
                                        }}>
                                        {i + 1}
                                    </button>
                                ))}
                                {currentPage < totalPages && (
                                    <button onClick={() => setCurrentPage(currentPage + 1)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0 1rem', height: '36px', borderRadius: '8px', background: C.card, border: `1.5px solid ${C.border}`, color: C.muted, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
                                        Next <ArrowRightIcon />
                                    </button>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Jobs;
