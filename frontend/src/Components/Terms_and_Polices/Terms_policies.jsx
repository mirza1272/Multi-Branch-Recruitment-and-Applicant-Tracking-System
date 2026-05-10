import React, { useEffect } from "react";

const C = { bg: '#0F172A', card: '#1E293B', primary: '#3B82F6', text: '#F1F5F9', muted: '#94A3B8', border: '#334155' };

const PolicySection = ({ title, content }) => (
    <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.25rem', color: C.text, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: '4px', height: '24px', background: C.primary, borderRadius: '2px' }}></span>
            {title}
        </h2>
        <div style={{ fontSize: '1rem', color: C.muted, lineHeight: 1.8, textAlign: 'justify' }}>
            {content}
        </div>
    </section>
);

function TermsPolicies() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ background: C.bg, color: C.text, minHeight: '100vh' }}>

            {/* Hero Section */}
            <div style={{ height: '350px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"
                    alt="Terms Hero"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) contrast(1.1)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.95) 100%)' }}></div>
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.03em', textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>Terms & <span style={{ color: C.primary }}>Policies</span></h1>
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '6rem 1.5rem' }}>

                <PolicySection
                    title="1. Introduction"
                    content="Welcome to HRConnect, a premium Multi-Branch Recruitment and Applicant Tracking System (ATS). By using our platform, you agree to these Terms and Conditions. We provide a centralized hub where candidates can discover opportunities across diverse branches and departments, while recruiters leverage intelligent tools to find the perfect match."
                />

                <PolicySection
                    title="2. User Roles and Account Security"
                    content="Our system supports distinct roles for Candidates and HR Professionals (Recruiters/Admins). Candidates are responsible for providing authentic profile data, while HR users must use the platform solely for legitimate recruitment activities. You are responsible for safeguarding your account credentials. Any unauthorized access should be reported immediately to our support team."
                />

                <PolicySection
                    title="3. Data Privacy and Smart Recommendations"
                    content="To provide a superior experience, HRConnect utilizes a Smart Recommendation Engine. We collect professional data (skills, experience, branch preferences) to suggest the most relevant job opportunities to candidates. Your data is encrypted and stored securely. We do not share your personal information with external third parties without your explicit consent, except as required for the hiring process."
                />

                <PolicySection
                    title="4. Application and Document Submission"
                    content="Candidates can apply for positions by uploading a Resume and an optional Cover Letter. We accept Resumes in PDF format to ensure layout consistency. For Cover Letters, we support both PDF and Word (.doc, .docx) formats. Users are responsible for ensuring that uploaded documents are free from malware and contain truthful representations of their professional history."
                />

                <PolicySection
                    title="5. Interview Scheduling & Third-Party Integration"
                    content="HRConnect integrates with Google Calendar for seamless interview scheduling. When an HR representative schedules an interview, the system may generate meeting links and calendar invites. Use of these features is subject to both our privacy policy and the respective third-party service terms. We only access the minimum necessary calendar data required to facilitate these appointments."
                />

                <PolicySection
                    title="6. Live Search and Job Discovery"
                    content="Our platform features a real-time Live Search Engine that allows users to filter jobs by title, company, category, and branch location. While we strive for 100% accuracy, job availability is subject to change as positions are filled or updated by our multi-branch network."
                />

                <PolicySection
                    title="7. Intellectual Property"
                    content="All software code, UI designs, brand assets, and proprietary algorithms (including our recommendation logic) are the exclusive property of HRConnect. Unauthorized reproduction or reverse engineering of the platform is strictly prohibited."
                />

                <PolicySection
                    title="8. User Safety and Content Integrity"
                    content="At HRConnect, we prioritize the safety and trust of our community. However, please note that while we facilitate the connection between recruiters and candidates, we do not provide an absolute guarantee regarding the authenticity of every individual job posting. We strongly encourage users to exercise caution and report any suspicious activity. Our team actively monitors for fraudulent patterns and reserves the right to track and remove any job post or user account that appears suspicious, misleading, or in violation of our ethical standards."
                />

                <PolicySection
                    title="9. Limitation of Liability"
                    content="HRConnect acts as a facilitator in the recruitment process. We are not responsible for the ultimate hiring decisions made by branches or for any disputes arising between employers and candidates. The platform is provided 'as-is' without warranties of any kind regarding the continuous availability of the service or the absolute accuracy of user-generated content."
                />

                <div style={{ marginTop: '5rem', padding: '3rem', background: C.card, borderRadius: '24px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                    <p style={{ color: C.muted, marginBottom: '1.5rem' }}>Have questions about our terms?</p>
                    <a href="/contact-us" style={{ color: C.primary, fontWeight: '800', textDecoration: 'none', fontSize: '1.1rem' }}>Contact Legal Team →</a>
                </div>

            </div>

        </div>
    );
}

export default TermsPolicies;
