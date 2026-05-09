import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationByIdRequest, scheduleInterviewRequest, getGoogleAuthUrlRequest, checkGoogleConnectionRequest } from "../../api/api";

const C = {
    bg: '#0F172A',
    card: '#1E293B',
    primary: '#3B82F6',
    accent: '#8B5CF6',
    text: '#F1F5F9',
    muted: '#94A3B8',
    border: '#334155'
};

const ScheduleInterview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [type, setType] = useState("Online");
    const [meetingLink, setMeetingLink] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const res = await getApplicationByIdRequest(id);
                setApplication(res.data?.data?.application);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await scheduleInterviewRequest({
                applicationId: id,
                date,
                time,
                type,
                meetingLink,
                message
            });
            setIsSuccess(true);
            window.scrollTo(0, 0);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to schedule interview");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: C.text, background: C.bg, minHeight: '100vh' }}>Loading...</div>;

    if (isSuccess) {
        return (
            <div style={{ background: C.bg, minHeight: '100vh', padding: '100px 2rem 4rem', color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-card" style={{ padding: '4rem 3rem', borderRadius: '32px', background: C.card, border: `1px solid ${C.border}`, maxWidth: '500px', width: '100%', textAlign: 'center', animation: 'slideUp 0.6s ease-out' }}>
                    <div style={{ width: '80px', height: '80px', background: '#22C55E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem', boxShadow: '0 20px 40px rgba(34,197,94,0.3)' }}>
                        ✓
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>Success!</h1>
                    <p style={{ color: C.muted, lineHeight: 1.6, marginBottom: '2.5rem' }}>
                        The interview has been scheduled successfully. An invitation email with the meeting details has been sent to <strong>{application?.candidateName || application?.userId?.name}</strong>.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={() => navigate(`/view-application/${id}`)} style={BtnS}>
                            View Application Details
                        </button>
                        <button onClick={() => navigate('/hr-dashboard')} style={{ ...BtnS, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, boxShadow: 'none' }}>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
                <style>{`
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ background: C.bg, minHeight: '100vh', padding: '100px 2rem 4rem', color: C.text }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: C.primary, fontWeight: '700', cursor: 'pointer', marginBottom: '2rem' }}>
                    ← Back
                </button>

                <div className="glass-card" style={{ padding: '3rem', borderRadius: '24px', background: C.card, border: `1px solid ${C.border}` }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.5rem' }}>Schedule Interview</h1>
                        <p style={{ color: C.muted, fontSize: '0.9rem' }}>
                            Candidate: <strong style={{ color: C.text }}>{application?.candidateName || application?.userId?.name}</strong><br />
                            Role: <strong style={{ color: C.text }}>{application?.jobId?.title}</strong>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={LabelS}>Interview Date</label>
                                <input 
                                    type="date" 
                                    required 
                                    value={date} 
                                    onChange={e => setDate(e.target.value)} 
                                    style={InputS} 
                                    className="custom-date-input"
                                />
                            </div>

                            <div>
                                <label style={LabelS}>Interview Time</label>
                                <input 
                                    type="time" 
                                    required 
                                    value={time} 
                                    onChange={e => setTime(e.target.value)} 
                                    style={InputS} 
                                    className="custom-time-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={LabelS}>Interview Type</label>
                            <select value={type} onChange={e => setType(e.target.value)} style={InputS}>
                                <option value="Online">Online / Video Call</option>
                                <option value="In-Person">In-Person / Office</option>
                                <option value="Phone">Phone Call</option>
                            </select>
                        </div>

                        {type === "Online" && (
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.2rem', borderRadius: '15px', border: '1px dashed #3B82F6', marginBottom: '0.5rem' }}>
                                <p style={{ fontSize: '0.9rem', color: C.primary, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✨ <strong>Google Meet</strong> link will be generated automatically for this specific time and sent to the candidate.
                                </p>
                            </div>
                        )}

                        <div>
                            <label style={LabelS}>Message to Candidate</label>
                            <textarea rows="4" placeholder="Mention any specific requirements or instructions..." value={message} onChange={e => setMessage(e.target.value)} style={InputS} />
                        </div>

                        <button type="submit" disabled={submitting} style={BtnS}>
                            {submitting ? "Scheduling..." : "Confirm & Schedule"}
                        </button>
                    </form>
                </div>
            </div>
            <style>{`
                input::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    cursor: pointer;
                    opacity: 0.8;
                    transition: 0.2s;
                }
                input::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }
                .custom-date-input, .custom-time-input {
                    color-scheme: dark;
                }
                input:focus {
                    border-color: ${C.primary} !important;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }
            `}</style>
        </div>
    );
};

const LabelS = { display: 'block', fontSize: '0.75rem', fontWeight: '800', color: C.muted, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' };
const InputS = { width: '100%', background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '0.8rem 1rem', color: C.text, outline: 'none', fontSize: '0.9rem', cursor: 'text' };
const BtnS = { background: C.accent, color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 10px 20px rgba(139,92,246,0.2)' };

export default ScheduleInterview;
