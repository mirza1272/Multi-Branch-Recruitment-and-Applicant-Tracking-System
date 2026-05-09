import React from "react";
import { useNavigate } from "react-router-dom";
import { getJobsRequest, getBranchesRequest } from "../../api/api";
import { CATEGORIES as DEPARTMENTS } from "../../Constants";
import HRHome from "./HRHome";

const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const MapPinIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BriefcaseIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const UsersIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const BuildingIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const StarIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>;
const ArrowRightIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const ClockIcon = () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const DollarIcon = () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const RECENT_JOBS = [
    { id: 1, title: "Forward Security Director", company: "Bauch, Schuppe and Schulist Co", location: "New-York, USA", salary: "$4000-$4200", type: "Full time", category: "Hotels & Tourism", timeAgo: "10 min ago", logo: "https://api.dicebear.com/7.x/initials/svg?seed=FS" },
    { id: 2, title: "Regional Creative Facilitator", company: "Wisozk - Becker Co", location: "Los-Angeles, USA", salary: "$2500-$3200", type: "Part time", category: "Media", timeAgo: "12 min ago", logo: "https://api.dicebear.com/7.x/initials/svg?seed=RC" },
    { id: 3, title: "Internal Integration Planner", company: "Hauck, Quigley and Feest Inc", location: "Texas, USA", salary: "$1800-$3000", type: "Full time", category: "Construction", timeAgo: "15 min ago", logo: "https://api.dicebear.com/7.x/initials/svg?seed=II" },
    { id: 4, title: "District Intranet Director", company: "VonRueden - Weber Co", location: "Florida, USA", salary: "$4200-$4800", type: "Full time", category: "Commerce", timeAgo: "24 min ago", logo: "https://api.dicebear.com/7.x/initials/svg?seed=DI" },
];
const CATEGORIES = [
    { name: "Engineering", icon: "💻" },
    { name: "Sales", icon: "📈" },
    { name: "Marketing", icon: "📣" },
    { name: "HR", icon: "👥" },
    { name: "Finance", icon: "💵" },
    { name: "Operations", icon: "⚙️" },
    { name: "Design", icon: "🎨" },
    { name: "Customer Support", icon: "🎧" },
    { name: "Product", icon: "📦" },
    { name: "Quality Assurance", icon: "🛡️" },
    { name: "Healthcare", icon: "🏥" },
    { name: "Other", icon: "✨" },
];
const TESTIMONIALS = [
    { name: "Marco Rihn", text: "Amazing services, they helped me find my dream job within a week!", rating: 5 },
    { name: "Kristin Heeter", text: "Everything is simple and the clean UI is just stunning. Best ATS ever.", rating: 5 },
    { name: "Zion Clarista", text: "Awesome, thank you! The best platform I've ever used for my career.", rating: 5 },
    { name: "Sarah Jenkins", text: "The hiring process was so smooth. I highly recommend HRConnect!", rating: 5 },
    { name: "Michael Chen", text: "I found a great opportunity in a branch I didn't even know existed.", rating: 5 },
    { name: "Aria Rodriguez", text: "The interface is very intuitive and the job recommendations are spot on.", rating: 5 },
    { name: "David Wilson", text: "Professional and efficient. The direct email pipeline is a game changer.", rating: 4 },
    { name: "Emily Brown", text: "I love how easy it is to track my applications. Great experience!", rating: 5 },
    { name: "James Taylor", text: "A must-have for anyone looking to scale their career globally.", rating: 5 },
    { name: "Olivia Martinez", text: "The categories are so well organized. Found my design job easily.", rating: 5 },
];

// ── COLOR CONSTANTS ───────────────────────────────────
const C = {
    bg: '#0F172A',
    card: '#1E293B',
    primary: '#3B82F6',
    accent: '#22C55E',
    text: '#F1F5F9',
    muted: '#94A3B8',
    border: '#334155',
    inputBg: '#0F172A',
};

function Home() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [keyword, setKeyword] = React.useState("");
    const [location, setLocation] = React.useState("All");
    const [category, setCategory] = React.useState("All");
    const [trendingJobs, setTrendingJobs] = React.useState([]);
    const [branches, setBranches] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch trending jobs (limit 4)
                const jobRes = await getJobsRequest({ limit: 4 });
                if (jobRes.data?.success) {
                    setTrendingJobs(jobRes.data.data.jobs);
                }

                // Fetch branches
                const branchRes = await getBranchesRequest();
                if (branchRes.data?.success) {
                    setBranches(branchRes.data.data.branches);
                }
            } catch (err) {
                console.error("Home Data Fetch Error:", err);
            }
        };
        fetchData();
    }, []);

    // Dynamic Job Recommendations based on skills
    let displayedJobs = trendingJobs;
    let jobSectionTitle = "Trending Opportunities";
    let jobSectionSubtitle = "Discover the latest job openings from top companies.";

    if (user?.role === 'candidate' && user?.skills) {
        jobSectionTitle = "Recommended Jobs for You";
        jobSectionSubtitle = `Based on your skills: ${user.skills}`;

        const skillsArray = user.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
        if (skillsArray.length > 0 && trendingJobs.length > 0) {
            displayedJobs = [...trendingJobs].sort((a, b) => {
                const aMatch = skillsArray.some(s =>
                    a.title.toLowerCase().includes(s) ||
                    (a.category && a.category.toLowerCase().includes(s)) ||
                    (a.department && a.department.toLowerCase().includes(s))
                );
                const bMatch = skillsArray.some(s =>
                    b.title.toLowerCase().includes(s) ||
                    (b.category && b.category.toLowerCase().includes(s)) ||
                    (b.department && b.department.toLowerCase().includes(s))
                );
                return (bMatch ? 1 : 0) - (aMatch ? 1 : 0);
            });
        }
    }

    // Intersection Observer for scroll animations
    React.useEffect(() => {
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
    }, [displayedJobs, trendingJobs]); // Corrected dependencies

    // Ensure page starts at the top instantly
    React.useEffect(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = '';
    }, []);

    if (user?.role === 'recruiter' || user?.role === 'admin') {
        return <HRHome />;
    }

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);
        if (location !== "All") params.append("branch", location);
        if (category !== "All") params.append("department", category);
        navigate(`/jobs?${params.toString()}`);
    };

    return (
        <div className="animate-fade-in" style={{ background: C.bg, minHeight: '100vh', color: C.text }}>

            {/* ── HERO ── */}
            <section style={{
                backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.80) 60%, rgba(30,41,59,0.90) 100%), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '93vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
            }} className="px-4">
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />
                <div className="max-w-7xl mx-auto text-center" style={{ position: 'relative', zIndex: 1, width: '100%', paddingTop: '2rem', paddingBottom: '3rem' }}>

                    <h1 className="text-5xl md:text-6xl font-extrabold mb-5 tracking-tight animate-fade-in-up"
                        style={{ color: C.text, lineHeight: 1.15 }}>
                        Find Your <span style={{ color: C.primary }}>Dream Job</span> Today!
                    </h1>
                    <p className="text-lg mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200" style={{ color: C.muted }}>
                        Connecting Talent with Opportunity. Your Gateway to Career Success.
                    </p>

                    {/* Search Bar */}
                    <div className="animate-fade-in-up delay-300 flex flex-col md:flex-row flex-wrap"
                        style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '900px', margin: '0 auto', overflow: 'hidden' }}>
                        <div className="w-full md:w-auto border-b md:border-b-0 md:border-r border-slate-700" style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', padding: '0.75rem 1rem' }}>
                            <span style={{ color: C.primary, marginRight: '0.6rem', flexShrink: 0 }}><SearchIcon /></span>
                            <input type="text" placeholder="Job Title or Company"
                                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem', color: C.text, width: '100%' }}
                                value={keyword} onChange={e => setKeyword(e.target.value)} />
                        </div>
                        <div className="w-full md:w-auto border-b md:border-b-0 md:border-r border-slate-700" style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', padding: '0.75rem 1rem' }}>
                            <span style={{ color: C.primary, marginRight: '0.6rem', flexShrink: 0 }}><MapPinIcon /></span>
                            <select style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem', color: C.text, width: '100%', cursor: 'pointer' }}
                                value={location} onChange={e => setLocation(e.target.value)}>
                                <option value="All">Select Branch</option>
                                {branches.map(b => {
                                    const bName = b.branchName || b;
                                    const bId = b._id || b;
                                    return <option key={bId} value={bName}>{bName}</option>;
                                })}
                            </select>
                        </div>
                        <div className="w-full md:w-auto" style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', padding: '0.75rem 1rem' }}>
                            <span style={{ color: C.primary, marginRight: '0.6rem', flexShrink: 0 }}><BriefcaseIcon /></span>
                            <select style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem', color: C.text, width: '100%', cursor: 'pointer' }}
                                value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="All">Select Department</option>
                                {DEPARTMENTS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <button onClick={handleSearch} className="btn-primary w-full md:w-auto"
                            style={{ borderRadius: '0', margin: '0', padding: '0.75rem 1.75rem', whiteSpace: 'nowrap' }}>
                            Search Jobs
                        </button>
                    </div>
                </div>
            </section>

            {/* ── RECENT JOBS ── */}
            <section style={{ background: C.card, padding: '5rem 1rem' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: C.text, marginBottom: '0.4rem' }}>{jobSectionTitle}</h2>
                            <p style={{ color: C.muted, fontSize: '0.9rem' }}>{jobSectionSubtitle}</p>
                        </div>
                        <button onClick={() => navigate('/jobs')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: C.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}>
                            View all <ArrowRightIcon />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {displayedJobs.map((job, index) => (
                            <div key={job._id || job.id} className="glass-card reveal" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', transitionDelay: `${index * 0.1}s` }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: C.text }}>{job.title}</h3>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: C.muted, marginBottom: '0.75rem' }}>{job.company}</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {[
                                            { icon: <BriefcaseIcon />, text: job.category || job.department || "Other" },
                                            { icon: <ClockIcon />, text: job.type || "Full Time" },
                                            { icon: <DollarIcon />, text: job.salary || "Competitive" },
                                            { icon: <MapPinIcon />, text: job.location || job.branchId?.branchName || "N/A" },
                                        ].map((tag, idx) => (
                                            <span key={idx} className="tag-pill">
                                                <span style={{ color: C.primary }}>{tag.icon}</span>{tag.text}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => navigate(`/job-details/${job._id || job.id}`)} className="btn-secondary" style={{ padding: '0.45rem 1.2rem', fontSize: '0.8rem', flexShrink: 0 }}>Job Details</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CATEGORIES ── */}
            <section style={{ background: C.bg, padding: '5rem 1rem' }}>
                <div className="max-w-7xl mx-auto text-center reveal">
                    <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: C.text, marginBottom: '0.4rem' }}>Browse by Category</h2>
                    <p style={{ color: C.muted, marginBottom: '3rem', fontSize: '0.9rem' }}>Explore jobs by specialized industry categories.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {CATEGORIES.map((cat, index) => (
                            <div
                                key={cat.name}
                                className="glass-card reveal"
                                style={{ padding: '2rem 1.25rem', cursor: 'pointer', textAlign: 'center', transition: '0.3s', transitionDelay: `${index * 0.05}s` }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                                onClick={() => navigate(`/jobs?department=${cat.name}`)}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{cat.icon}</div>
                                <h4 style={{ fontWeight: '700', fontSize: '1rem', color: C.text, marginBottom: '0.3rem' }}>{cat.name}</h4>
                                <p style={{ fontSize: '0.75rem', color: C.primary, fontWeight: '700' }}>View Openings</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ background: C.card, padding: '3.5rem 1rem', overflow: 'hidden' }}>
                <div className="max-w-7xl mx-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                    <div className="reveal-left" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', maxHeight: '320px' }}>
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="Work" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div className="reveal-right">
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: C.text, marginBottom: '1rem', lineHeight: 1.25 }}>Good Life Begins With A Good Company</h2>
                        <p style={{ color: C.muted, marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
                            We bridge the gap between world-class companies and top-tier talent. Our platform is designed to make your job search as seamless as possible.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: C.primary }}>20k+</p>
                                <p style={{ fontSize: '0.8rem', color: C.muted, fontWeight: '600' }}>Active resumes</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '1.75rem', fontWeight: '800', color: C.primary }}>18k+</p>
                                <p style={{ fontSize: '0.8rem', color: C.muted, fontWeight: '600' }}>Companies</p>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => navigate('/jobs')}>Search Jobs</button>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="animate-fade-in" style={{ background: C.bg, padding: '5rem 0', overflow: 'hidden' }}>
                <div className="max-w-7xl mx-auto text-center px-4 mb-12">
                    <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: C.text, marginBottom: '0.4rem' }}>Testimonials from Our Customers</h2>
                    <p style={{ color: C.muted, fontSize: '0.9rem' }}>Hear what our users have to say about their experience.</p>
                </div>

                <div style={{ position: 'relative', width: '100%' }}>
                    <div className="animate-marquee">
                        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                            <div key={i} className="glass-card" style={{ width: '350px', margin: '0 1rem', padding: '2rem', textAlign: 'left', flexShrink: 0 }}>
                                <div style={{ display: 'flex', color: '#F59E0B', marginBottom: '1rem' }}>
                                    {[...Array(t.rating)].map((_, i) => <span key={i}><StarIcon /></span>)}
                                </div>
                                <p style={{ color: C.muted, marginBottom: '1.5rem', fontStyle: 'italic', lineHeight: 1.65, fontSize: '0.9rem' }}>"{t.text}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '0.875rem', color: C.text }}>{t.name}</p>
                                        <p style={{ fontSize: '0.65rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>Happy Client</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;