import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ALL_JOBS } from "./JobsData";

const C = {
    bg: '#0F172A',
    card: '#1E293B',
    primary: '#3B82F6',
    text: '#F1F5F9',
    muted: '#94A3B8',
    border: '#334155',
    accent: '#22C55E',
    error: '#EF4444'
};

const InputS = {
    width: '100%',
    background: '#0F172A',
    border: `1.5px solid ${C.border}`,
    borderRadius: '10px',
    padding: '0.85rem 1rem',
    color: C.text,
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.3s'
};

const LabelS = {
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: C.muted,
    marginBottom: '0.5rem',
    display: 'block'
};

const SectionTitleS = {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: C.text,
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
};

function ApplyJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const job = useMemo(() => ALL_JOBS.find(j => j.jobId === parseInt(id)) || ALL_JOBS[0], [id]);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        qualification: "",
        experience: "",
        currentCompany: "",
        skills: "",
        resume: null,
        coverLetter: null,
        q1: "", // Why do you want to work here?
        q2: "", // Notable achievement
        q3: "", // Expected salary
        terms: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);

        // Auto-fill if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const names = user.name ? user.name.split(' ') : ["", ""];
            setFormData(prev => ({
                ...prev,
                firstName: names[0] || "",
                lastName: names.slice(1).join(' ') || "",
                email: user.email || "",
                phone: user.phone || "",
                location: user.location || "",
                skills: user.skills || "",
                currentCompany: user.role === 'HR' ? user.name : user.company || ""
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file' && files[0]) {
            const file = files[0];
            if (name === 'resume') {
                if (file.type !== 'application/pdf') {
                    setErrors(prev => ({ ...prev, resume: "Resume must be a PDF file" }));
                    return;
                }
            } else if (name === 'coverLetter') {
                const allowedTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ];
                if (!allowedTypes.includes(file.type)) {
                    setErrors(prev => ({ ...prev, coverLetter: "Only PDF and Word files (.doc, .docx) are accepted" }));
                    return;
                }
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newE = { ...prev };
                delete newE[name];
                return newE;
            });
        }
    };

    const validate = () => {
        const newE = {};
        if (!formData.firstName) newE.firstName = "Required";
        if (!formData.lastName) newE.lastName = "Required";
        if (!formData.email) newE.email = "Required";
        if (!formData.resume) newE.resume = "Resume upload is mandatory";
        if (!formData.terms) newE.terms = "You must accept terms";

        setErrors(newE);
        return Object.keys(newE).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        // Simulate API Call
        setTimeout(() => {
            // Save to localStorage for demo persistence
            const newApplication = {
                id: Date.now(),
                jobId: job.jobId,
                title: job.title,
                company: job.company,
                branch: job.branchId || job.location,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: "Under Review",
                type: job.type,
                candidate: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                qualification: formData.qualification,
                experience: formData.experience,
                skills: formData.skills,
                q1: formData.q1,
                q2: formData.q2,
                resumeName: formData.resume ? formData.resume.name : null,
                coverLetterName: formData.coverLetter ? formData.coverLetter.name : null
            };

            const existingApps = JSON.parse(localStorage.getItem('all_applications')) || [];
            localStorage.setItem('all_applications', JSON.stringify([newApplication, ...existingApps]));

            setIsSubmitting(false);
            setIsSuccess(true);
            console.log("Application Submitted and Saved:", newApplication);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '24px', padding: '4rem 2rem', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', animation: 'scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(34,197,94,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accent, fontSize: '2.5rem', margin: '0 auto 1.5rem' }}>
                        ✓
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: C.text, marginBottom: '1rem' }}>Application Sent!</h2>
                    <p style={{ color: C.muted, lineHeight: 1.6, marginBottom: '2.5rem' }}>
                        Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been successfully submitted. Our team will review it and get back to you soon.
                    </p>
                    <button onClick={() => navigate('/jobs')} style={{ background: C.primary, color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s' }}>
                        Back to Job Directory
                    </button>
                </div>
                <style>{`@keyframes scaleUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'Inter, sans-serif' }}>
            {/* Header Area */}
            <div style={{ background: 'linear-gradient(to bottom, #1E293B, #0F172A)', padding: '4rem 1rem', borderBottom: `1px solid ${C.border}`, textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <span style={{ color: C.primary, fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Joining the Team</span>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0.5rem 0 1rem' }}>Apply for <span style={{ color: C.primary }}>{job.title}</span></h1>
                    <p style={{ color: C.muted, fontSize: '1rem' }}>{job.company} • {job.location} • {job.type}</p>
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '-40px auto 6rem', padding: '0 1rem' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Personal Information */}
                    <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px', animation: 'fadeInUp 0.6s ease-out' }}>
                        <h3 style={SectionTitleS}><span style={{ width: '4px', height: '18px', background: C.primary, borderRadius: '2px' }}></span> Personal Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <label style={LabelS}>First Name</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. John" style={{ ...InputS, borderColor: errors.firstName ? C.error : C.border }} />
                            </div>
                            <div>
                                <label style={LabelS}>Last Name</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Doe" style={{ ...InputS, borderColor: errors.lastName ? C.error : C.border }} />
                            </div>
                            <div>
                                <label style={LabelS}>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" style={{ ...InputS, borderColor: errors.email ? C.error : C.border }} />
                            </div>
                            <div>
                                <label style={LabelS}>Phone Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" style={InputS} />
                            </div>
                        </div>
                    </div>

                    {/* Professional Details */}
                    <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px', animation: 'fadeInUp 0.7s ease-out' }}>
                        <h3 style={SectionTitleS}><span style={{ width: '4px', height: '18px', background: C.primary, borderRadius: '2px' }}></span> Professional Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <label style={LabelS}>Highest Qualification</label>
                                <select name="qualification" value={formData.qualification} onChange={handleChange} style={InputS}>
                                    <option value="">Select Qualification</option>
                                    <option value="High School">High School</option>
                                    <option value="Bachelor's">Bachelor's Degree</option>
                                    <option value="Master's">Master's Degree</option>
                                    <option value="PhD">PhD</option>
                                </select>
                            </div>
                            <div>
                                <label style={LabelS}>Years of Experience</label>
                                <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5" style={InputS} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={LabelS}>Skills (Comma separated)</label>
                                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, Project Management" style={InputS} />
                            </div>
                        </div>
                    </div>

                    {/* Hiring Questions */}
                    <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px', animation: 'fadeInUp 0.8s ease-out' }}>
                        <h3 style={SectionTitleS}><span style={{ width: '4px', height: '18px', background: C.primary, borderRadius: '2px' }}></span> Hiring Questions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={LabelS}>Why are you interested in this position at {job.company}?</label>
                                <textarea name="q1" value={formData.q1} onChange={handleChange} rows="4" style={{ ...InputS, resize: 'none' }} placeholder="Your answer..."></textarea>
                            </div>
                            <div>
                                <label style={LabelS}>Describe a notable achievement in your previous role.</label>
                                <textarea name="q2" value={formData.q2} onChange={handleChange} rows="4" style={{ ...InputS, resize: 'none' }} placeholder="Your answer..."></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Document Uploads */}
                    <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '20px', animation: 'fadeInUp 0.9s ease-out' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {/* Resume Upload */}
                            <div>
                                <h3 style={SectionTitleS}><span style={{ width: '4px', height: '18px', background: C.primary, borderRadius: '2px' }}></span> Resume Upload</h3>
                                <div style={{ padding: '2rem', border: `2px dashed ${errors.resume ? C.error : C.border}`, borderRadius: '15px', textAlign: 'center', background: 'rgba(15,23,42,0.5)', transition: 'all 0.3s' }}>
                                    <input type="file" name="resume" id="resume" accept=".pdf" onChange={handleChange} style={{ display: 'none' }} />
                                    <label htmlFor="resume" style={{ cursor: 'pointer' }}>
                                        <div style={{ fontSize: '2.5rem', color: C.primary, marginBottom: '1rem' }}>📄</div>
                                        <p style={{ fontWeight: '700', marginBottom: '0.5rem' }}>{formData.resume ? formData.resume.name : "Click to upload your resume"}</p>
                                        <p style={{ fontSize: '0.75rem', color: C.muted }}>PDF format only (Max 5MB)</p>
                                    </label>
                                </div>
                                {errors.resume && <p style={{ color: C.error, fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '600' }}>{errors.resume}</p>}
                            </div>

                            {/* Cover Letter Upload */}
                            <div>
                                <h3 style={SectionTitleS}><span style={{ width: '4px', height: '18px', background: C.accent, borderRadius: '2px' }}></span> Cover Letter (Optional)</h3>
                                <div style={{ padding: '2rem', border: `2px dashed ${errors.coverLetter ? C.error : C.border}`, borderRadius: '15px', textAlign: 'center', background: 'rgba(15,23,42,0.5)', transition: 'all 0.3s' }}>
                                    <input type="file" name="coverLetter" id="coverLetter" accept=".pdf,.doc,.docx" onChange={handleChange} style={{ display: 'none' }} />
                                    <label htmlFor="coverLetter" style={{ cursor: 'pointer' }}>
                                        <div style={{ fontSize: '2.5rem', color: C.accent, marginBottom: '1rem' }}>✉️</div>
                                        <p style={{ fontWeight: '700', marginBottom: '0.5rem' }}>{formData.coverLetter ? formData.coverLetter.name : "Upload your cover letter"}</p>
                                        <p style={{ fontSize: '0.75rem', color: C.muted }}>PDF or Word format (Max 5MB)</p>
                                    </label>
                                </div>
                                {errors.coverLetter && <p style={{ color: C.error, fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '600' }}>{errors.coverLetter}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Final Submission */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', maxWidth: '600px' }}>
                            <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: C.primary }} />
                            <span style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.5 }}>
                                I agree to the <Link to="/terms-policies" style={{ color: C.primary, textDecoration: 'none', fontWeight: '700' }}>Terms of Service</Link> and <Link to="/terms-policies" style={{ color: C.primary, textDecoration: 'none', fontWeight: '700' }}>Privacy Policy</Link>. I confirm that the information provided is accurate and I understand that providing false info could lead to disqualification.
                            </span>
                        </label>
                        {errors.terms && <p style={{ color: C.error, fontSize: '0.75rem', fontWeight: '600' }}>{errors.terms}</p>}

                        <button type="submit" disabled={isSubmitting} style={{
                            width: '100%', maxWidth: '400px', padding: '1.25rem', borderRadius: '15px', background: C.primary, color: '#fff', border: 'none', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', transition: 'all 0.4s',
                            boxShadow: '0 15px 30px rgba(59,130,246,0.3)', position: 'relative', overflow: 'hidden'
                        }} onMouseEnter={e => e.target.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.target.style.transform = 'none'}>
                            {isSubmitting ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                    <div className="spinner"></div> Processing...
                                </span>
                            ) : "Submit Application"}
                        </button>
                    </div>

                </form>
            </div>

            <style>{`
                .glass-card { background: ${C.card}; border: 1px solid ${C.border}; box-shadow: 0 10px 30px rgba(0,0,0,0.1); backdrop-filter: blur(10px); }
                .glass-card:hover { border-color: ${C.primary}; transform: translateY(-5px); transition: all 0.4s; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                input:focus, textarea:focus, select:focus { border-color: ${C.primary} !important; background: #1E293B !important; }
            `}</style>
        </div>
    );
}

export default ApplyJob;