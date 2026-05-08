import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const C = { bg: '#0F172A', card: '#1E293B', primary: '#3B82F6', text: '#F1F5F9', muted: '#94A3B8', border: '#334155', accent: '#2DD4BF' };

const StepCard = ({ icon, title, desc }) => (
    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <div style={{ width: '60px', height: '60px', background: 'rgba(59,130,246,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.6 }}>{desc}</p>
    </div>
);

const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <div style={{ borderBottom: `1px solid ${C.border}`, padding: '1.5rem 0' }}>
        <button onClick={onClick} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: C.text, cursor: 'pointer', textAlign: 'left', padding: 0 }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{question}</span>
            <span style={{ color: C.primary, fontSize: '1.5rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</span>
        </button>
        {isOpen && (
            <div style={{ marginTop: '1rem', color: C.muted, fontSize: '0.95rem', lineHeight: 1.8, animation: 'fadeIn 0.3s ease-out' }}>
                {answer}
            </div>
        )}
    </div>
);

function AboutUs() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [openFAQ, setOpenFAQ] = useState(0);
    const user = JSON.parse(localStorage.getItem('user'));
    const isHR = user?.role === 'HR';

    // Intersection Observer for scroll reveal
    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);


    const candidateSteps = [
        { title: "Create Account", desc: "Sign up for a free account to get started with your job search journey.", icon: <UserPlusIcon /> },
        { title: "Upload Resume", desc: "Upload your professional resume to stand out to top recruiters.", icon: <FileTextIcon /> },
        { title: "Find Jobs", desc: "Browse thousands of openings across multiple industries and branches.", icon: <SearchIcon /> },
        { title: "Apply Job", desc: "Submit your application with one click and track its status instantly.", icon: <CheckCircleIcon /> }
    ];

    const hrSteps = [
        { title: "Create Account", desc: "Register your company and set up your HR profile to start hiring.", icon: <UserPlusIcon /> },
        { title: "Post Jobs", desc: "Create detailed job listings across multiple branches and departments.", icon: <FileTextIcon /> },
        { title: "Review Applicants", desc: "Filter, sort, and review top candidates using our advanced tracking system.", icon: <SearchIcon /> },
        { title: "Hire Talent", desc: "Communicate directly with candidates and build your dream team.", icon: <CheckCircleIcon /> }
    ];

    const steps = isHR ? hrSteps : candidateSteps;

    const candidateFaqs = [
        { q: "Can I upload a CV?", a: "Yes! You can upload your CV in PDF or Word format directly from your profile settings or during the job application process." },
        { q: "How long will the recruitment process take?", a: "The duration varies by company, but typically takes between 2 to 4 weeks from application to offer." },
        { q: "Do you recruit for Graduates and Students?", a: "Absolutely! We have hundreds of internships and entry-level positions tailored specifically for fresh talent." },
        { q: "What does the selection process involve?", a: "It usually includes a resume screening, an initial HR call, and 1-2 technical or behavioral interviews." }
    ];

    const hrFaqs = [
        { q: "How do I add multiple branches?", a: "You can easily manage your company's branches from the HR Dashboard when creating or editing a job posting." },
        { q: "Can I communicate with candidates directly?", a: "Yes, our platform connects you with candidates so you can initiate direct email communication for interviews." },
        { q: "Is candidate data secure?", a: "Absolutely. We use industry-standard encryption to ensure all applicant data is stored securely." },
        { q: "How do I track application statuses?", a: "Your dashboard provides a comprehensive view to track and manage candidates through different hiring stages seamlessly." }
    ];

    const faqs = isHR ? hrFaqs : candidateFaqs;

    return (
        <div style={{ background: C.bg, color: C.text, minHeight: '100vh' }}>

            {/* Hero Section with Premium Background */}
            <div className="animate-fade-in" style={{ height: '400px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                    alt="About Us Hero"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) contrast(1.2)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.95) 100%)' }}></div>

                <div className="animate-fade-in-up" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 1.5rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '1rem', textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
                        About <span style={{ color: C.primary }}>Us</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.85)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6, fontWeight: '500' }}>
                        Connecting talent with opportunity across boundaries. HRConnect is the leading platform for multi-branch recruitment and applicant tracking.
                    </p>
                </div>
            </div>

            {/* How It Works */}
            <div className="reveal" style={{ padding: '6rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>How it works</h2>
                    <p style={{ color: C.muted }}>{isHR ? "Four simple steps to build your dream team." : "Four simple steps to land your dream job."}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {steps.map((step, i) => <StepCard key={i} {...step} />)}
                </div>
            </div>

            {/* Feature Section */}
            <div style={{ padding: '6rem 1.5rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="reveal-left" style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ height: '300px', background: 'rgba(59,130,246,0.1)', borderRadius: '24px', overflow: 'hidden' }}>
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Team" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ height: '140px', background: 'rgba(45,212,191,0.1)', borderRadius: '24px', overflow: 'hidden' }}>
                                <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800" alt="Office" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                            </div>
                            <div style={{ height: '140px', background: 'rgba(245,158,11,0.1)', borderRadius: '24px', overflow: 'hidden' }}>
                                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Meetings" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="reveal-right" style={{ flex: 1, minWidth: '300px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: 1.2 }}>We're Only Working With <span style={{ color: C.primary }}>The Best</span></h2>
                    <p style={{ color: C.muted, marginBottom: '2.5rem', lineHeight: 1.8 }}>
                        Our platform is designed to filter out the noise and bring the highest quality candidates to the world's most innovative companies.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {[
                            { label: 'Quality Job', icon: <BriefcaseIcon /> },
                            { label: 'Resume Builder', icon: <FileTextIcon /> },
                            { label: 'Top Companies', icon: <TrophyIcon /> },
                            { label: 'Top Talents', icon: <StarIcon /> }
                        ].map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ color: C.primary }}><CheckCircleIcon /></div>
                                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{f.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div style={{ padding: '6rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
                    <p style={{ color: C.muted }}>{isHR ? "Everything you need to know about managing recruitment." : "Everything you need to know about our recruitment process."}</p>
                </div>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '24px', padding: '1rem 2.5rem' }}>
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} question={faq.q} answer={faq.a} isOpen={openFAQ === i} onClick={() => setOpenFAQ(openFAQ === i ? -1 : i)} />
                    ))}
                </div>
            </div>

            {/* CTA Section */}


        </div>
    );
}

// Icons
const UserPlusIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>;
const FileTextIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const SearchIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const CheckCircleIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const BriefcaseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const TrophyIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path></svg>;
const StarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;

export default AboutUs;
