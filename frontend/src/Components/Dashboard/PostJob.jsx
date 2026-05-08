import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, getDynamicBranches } from "../../Constants";

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

const PostJob = () => {
    const navigate = useNavigate();
    const { editId } = useParams();
    const [branches] = useState(getDynamicBranches());
    const [formData, setFormData] = useState({
        title: "",
        category: CATEGORIES[0],
        type: "Full Time",
        salary: "",
        location: "",
        branchId: "Main Branch",
        description: "",
        requirements: "",
        deadline: ""
    });

    useEffect(() => {
        if (editId) {
            const managedJobs = JSON.parse(localStorage.getItem('managed_jobs')) || [];
            const jobToEdit = managedJobs.find(j => j.id.toString() === editId);
            if (jobToEdit) {
                setFormData(jobToEdit);
            }
        }
    }, [editId]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const managedJobs = JSON.parse(localStorage.getItem('managed_jobs')) || [];
            
            if (editId) {
                const updatedJobs = managedJobs.map(j => j.id.toString() === editId ? { ...formData, id: j.id, company: j.company, postedAt: j.postedAt, status: j.status } : j);
                localStorage.setItem('managed_jobs', JSON.stringify(updatedJobs));
            } else {
                const newJob = {
                    ...formData,
                    id: Date.now(),
                    company: "HRConnect", // Default for now
                    postedAt: "Just Now",
                    status: "Active"
                };
                localStorage.setItem('managed_jobs', JSON.stringify([newJob, ...managedJobs]));
            }

            setIsSubmitting(false);
            navigate('/hr-dashboard');
        }, 1200);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputS = { width: '100%', background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '1rem', color: C.text, fontSize: '0.9rem', outline: 'none', transition: 'all 0.3s' };
    const labelS = { display: 'block', fontSize: '0.75rem', fontWeight: '800', color: C.muted, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' };

    return (
        <div style={{ background: C.bg, minHeight: '100vh', padding: '100px 2rem 4rem', color: C.text }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: C.primary, fontWeight: '700', cursor: 'pointer', marginBottom: '2rem' }}>← Cancel</button>

                <div className="glass-card" style={{ padding: '3rem', borderRadius: '24px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem' }}>{editId ? "Update" : "Post"} <span style={{ color: C.primary }}>Opportunity</span></h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelS}>Job Title</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Software Engineer" style={inputS} />
                            </div>

                            <div>
                                <label style={labelS}>Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} style={inputS}>
                                    {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={labelS}>Employment Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} style={inputS}>
                                    <option>Full Time</option>
                                    <option>Part Time</option>
                                    <option>Contract</option>
                                    <option>Remote</option>
                                </select>
                            </div>

                            <div>
                                <label style={labelS}>Monthly Salary Range</label>
                                <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. $5k - $8k" style={inputS} />
                            </div>

                            <div>
                                <label style={labelS}>Assigned Branch</label>
                                <select name="branchId" value={formData.branchId} onChange={handleChange} style={inputS}>
                                    {branches.map(b => <option key={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={labelS}>Job Description</label>
                            <textarea required name="description" value={formData.description} onChange={handleChange} rows="6" placeholder="Describe the role and responsibilities..." style={{ ...inputS, resize: 'none' }}></textarea>
                        </div>

                        <div>
                            <label style={labelS}>Key Requirements</label>
                            <textarea required name="requirements" value={formData.requirements} onChange={handleChange} rows="4" placeholder="List technical and soft skill requirements..." style={{ ...inputS, resize: 'none' }}></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                background: C.primary, color: '#fff', border: 'none', padding: '1.25rem', borderRadius: '15px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', transition: '0.3s', boxShadow: '0 15px 30px rgba(59,130,246,0.3)', marginTop: '1rem'
                            }}
                            onMouseEnter={e => e.target.style.transform = 'translateY(-3px)'}
                            onMouseLeave={e => e.target.style.transform = 'none'}>
                            {isSubmitting ? (editId ? "Updating..." : "Creating...") : (editId ? "Update Job Post" : "Publish Job Post")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
