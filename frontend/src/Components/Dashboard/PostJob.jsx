import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES } from "../../Constants";
import { createJobRequest, updateJobRequest, getJobByIdRequest, getBranchesRequest } from "../../api/api";

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
    const [branches, setBranches] = useState([]);
    const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [formData, setFormData] = useState({
        title: "",
        company: user.company || "",
        category: CATEGORIES[0],
        type: "Full Time",
        salary: "",
        branchId: "",
        description: "",
        requirements: "",
        department: "",
        experience: "",
        degree: "",
        seats: 1,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBranchesAndJob = async () => {
            try {
                // Fetch branches first
                const branchRes = await getBranchesRequest();
                const fetchedBranches = branchRes.data?.data?.branches || [];
                setBranches(fetchedBranches);

                let defaultBranchId = fetchedBranches.length > 0 ? fetchedBranches[0]._id : "";

                // If edit mode, fetch job details
                if (editId) {
                    const jobRes = await getJobByIdRequest(editId);
                    const job = jobRes.data?.data;
                    if (job) {
                        setFormData({
                            title: job.title || "",
                            category: job.category || CATEGORIES[0],
                            type: job.type || "Full Time",
                            salary: job.salary || "",
                            branchId: job.branchId?._id || job.branchId || defaultBranchId,
                            description: job.description || "",
                            requirements: job.requirements || "",
                            department: job.department || "",
                            experience: job.experience || "",
                            degree: job.degree || "",
                            seats: job.seats || 1,
                        });
                    }
                } else {
                    setFormData(prev => ({ ...prev, branchId: defaultBranchId }));
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchBranchesAndJob();
    }, [editId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editId && editId !== "undefined") {
                await updateJobRequest(editId, formData);
            } else {
                await createJobRequest(formData);
            }
            navigate('/hr-dashboard');
        } catch (error) {
            console.error("Failed to save job:", error);
            alert(error.response?.data?.message || "Failed to save job");
        } finally {
            setIsSubmitting(false);
        }
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

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelS}>Company Name</label>
                                <input required type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Tech Solutions Inc." style={inputS} />
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
                                    <option>Internship</option>
                                </select>
                            </div>

                            <div>
                                <label style={labelS}>Branch (City)</label>
                                <select name="branchId" value={formData.branchId} onChange={handleChange} style={inputS} required>
                                    <option value="" disabled>Select Branch</option>
                                    {branches.map(b => <option key={b._id} value={b._id}>{b.branchName}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={labelS}>Department</label>
                                <input required type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Engineering" style={inputS} />
                            </div>

                            <div>
                                <label style={labelS}>Monthly Salary Range</label>
                                <input required type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. $5k - $8k" style={inputS} />
                            </div>

                            <div>
                                <label style={labelS}>Required Experience (in years)</label>
                                <input required type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 3+ Years" style={inputS} />
                            </div>

                            <div>
                                <label style={labelS}>Required Degree</label>
                                <input required type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="e.g. Bachelor's" style={inputS} />
                            </div>

                            <div>
                                <label style={labelS}>Available Seats</label>
                                <input required type="number" name="seats" value={formData.seats} onChange={handleChange} min="1" style={inputS} />
                            </div>
                        </div>

                        <div>
                            <label style={labelS}>Job Description</label>
                            <textarea required name="description" value={formData.description} onChange={handleChange} rows="6" placeholder="Describe the role and responsibilities..." style={{ ...inputS, resize: 'none' }}></textarea>
                        </div>

                        <div>
                            <label style={labelS}>Key Responsibilities & Requirements</label>
                            <textarea required name="requirements" value={formData.requirements} onChange={handleChange} rows="6" placeholder="List the requirements and responsibilities. Use new lines for bullet points." style={{ ...inputS, resize: 'none' }}></textarea>
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
