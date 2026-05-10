import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getJobsRequest, getBranchesRequest } from "../../api/api";
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
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [searchTerm, setSearchTerm] = useState(searchParams.get("keyword") || "");
    const [branch, setBranch] = useState(searchParams.get("branch") || "All");
    const [department, setDepartment] = useState(searchParams.get("department") || "All");
    const [minSalary, setMinSalary] = useState(0);
    const [sortBy, setSortBy] = useState("Latest");
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch state
    const [jobs, setJobs] = useState([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        revealElements.forEach(el => observer.observe(el));

        return () => {
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, [jobs, loading]); // Re-run when jobs are loaded or loading state changes

    // Removed HR redirect so recruiters can view the jobs board

    // Fetch branches on component mount
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await getBranchesRequest();
                setBranches(response.data.data.branches || []);
            } catch (err) {
                console.error("Error fetching branches:", err);
            }
        };
        fetchBranches();
    }, []);

    useEffect(() => {
        setSearchTerm(searchParams.get("keyword") || "");
        setBranch(searchParams.get("branch") || "All");
        setDepartment(searchParams.get("department") || "All");
    }, [location.search]);

    // Fetch jobs from backend
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {
                    page: currentPage,
                    limit: 6,
                    sortBy: "newest",
                };

                if (branch !== "All") params.branchId = branch;
                if (department !== "All") params.category = department;
                if (minSalary > 0) params.minSalary = minSalary;

                const response = await getJobsRequest(params);

                setJobs(response.data.data.jobs || []);
                setTotalJobs(response.data.data.pagination?.total || 0);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                const errorMsg = err.response?.data?.message || err.message || "Failed to fetch jobs";
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [searchTerm, branch, department, minSalary, currentPage]);

    const totalPages = Math.ceil(totalJobs / 6);

    const inputS = { width: '100%', background: '#0F172A', border: `1.5px solid ${C.border}`, borderRadius: '8px', padding: '0.55rem 0.85rem 0.55rem 2.5rem', fontSize: '0.8rem', color: C.text, outline: 'none', fontFamily: 'inherit' };
    const labelS = { fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: C.muted, display: 'block', marginBottom: '0.4rem' };

    return (
        <div className="animate-fade-in" style={{ background: C.bg, minHeight: '100vh', color: C.text }}>
            <style>
                {`
                @media (max-width: 768px) {
                    .jobs-header-h1 { font-size: 1.75rem !important; }
                    .jobs-container { flex-direction: column !important; }
                    .jobs-sidebar { width: 100% !important; margin-bottom: 2rem !important; }
                    .job-card { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
                    .job-card-btn { width: 100% !important; }
                    .pagination-row { flex-wrap: wrap !important; gap: 0.75rem !important; }
                }
                `}
            </style>

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
                <div style={{ position: 'relative', zIndex: 1 }} className="reveal">
                    <h1 className="jobs-header-h1" style={{ fontSize: '2.25rem', fontWeight: '800', color: C.text, marginBottom: '0.5rem' }}>Jobs Directory</h1>
                    <p style={{ color: C.muted, fontSize: '0.9rem' }}>Browse all open positions across our branches and departments</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row md:flex-wrap jobs-container" style={{ gap: '2rem' }}>

                    {/* Sidebar */}
                    <aside className="w-full md:w-[260px] flex-shrink-0 reveal-left jobs-sidebar">
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
                                        {branches.map(b => <option key={b._id} value={b._id}>{b.branchName}</option>)}
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
                                <button onClick={() => { setSearchTerm(""); setBranch("All"); setDepartment("All"); setMinSalary(0); }}
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: `1.5px solid ${C.primary}`, background: 'transparent', color: C.primary, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main */}
                    <main style={{ flex: 1, minWidth: 0 }}>
                        {/* Sort row removed as per request */}

                        {error && (
                            <div style={{ background: '#DC2626', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', color: 'white', fontSize: '0.85rem' }}>
                                {error}
                            </div>
                        )}

                        {loading && (
                            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '4rem', textAlign: 'center' }}>
                                <p style={{ color: C.muted }}>Loading jobs...</p>
                            </div>
                        )}

                        {!loading && jobs.length > 0 ? jobs.map((job, index) => (
                            <div key={job._id} className="glass-card reveal job-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', transitionDelay: `${index * 0.1}s` }}>
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
                                            { icon: <DollarIcon />, text: job.salary ? `$${job.salary}` : 'Not specified' },
                                            { icon: <MapPinIcon />, text: job.branchId?.branchName || "Not specified" },
                                            { icon: <SearchIcon />, text: `${job.seats} Seats` },
                                        ].map((tag, idx) => (
                                            <span key={idx} className="tag-pill">
                                                <span style={{ color: C.primary }}>{tag.icon}</span>{tag.text}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => navigate(`/job-details/${job._id}`)} className="btn-primary job-card-btn" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', flexShrink: 0 }}>Job Details</button>
                            </div>
                        )) : !loading && (
                            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '4rem', textAlign: 'center' }}>
                                <p style={{ color: C.muted }}>No jobs match your search criteria.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                                {currentPage > 1 && (
                                    <button onClick={() => setCurrentPage(currentPage - 1)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0 1rem', height: '36px', borderRadius: '8px', background: C.card, border: `1.5px solid ${C.border}`, color: C.muted, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
                                        ← Previous
                                    </button>
                                )}

                                {(() => {
                                    let start = Math.max(1, currentPage - 1);
                                    let end = Math.min(totalPages, start + 2);
                                    if (end === totalPages) start = Math.max(1, end - 2);

                                    const pages = [];
                                    for (let i = start; i <= end; i++) {
                                        pages.push(
                                            <button key={i} onClick={() => setCurrentPage(i)}
                                                style={{
                                                    width: '36px', height: '36px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', border: '1.5px solid', transition: 'all 0.2s',
                                                    background: currentPage === i ? C.primary : C.card,
                                                    color: currentPage === i ? '#FFFFFF' : C.muted,
                                                    borderColor: currentPage === i ? C.primary : C.border
                                                }}>
                                                {i}
                                            </button>
                                        );
                                    }
                                    return pages;
                                })()}

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
