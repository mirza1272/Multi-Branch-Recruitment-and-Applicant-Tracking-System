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
                    content="Welcome to HRConnect. These Terms and Conditions govern your use of our multi-branch recruitment and applicant tracking platform. By accessing or using our services, you agree to comply with and be bound by these terms. If you do not agree, please refrain from using the platform. Our mission is to provide a seamless connection between top talent and leading companies across various industries and locations."
                />

                <PolicySection
                    title="2. User Accounts and Security"
                    content="To access certain features, you must register for an account as either a Candidate or an HR Representative. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts that violate our security protocols or provide false information during registration."
                />

                <PolicySection
                    title="3. Data Privacy and Collection"
                    content="Your privacy is paramount to us. We collect personal information such as names, email addresses, phone numbers, and professional details (resumes, experience, skills) solely for recruitment purposes. We use state-of-the-art encryption and secure storage to protect your data. By uploading a resume, you grant HRConnect and its affiliated hiring branches permission to review and process your information for potential employment matches. We do not sell your personal data to third-party marketers."
                />

                <PolicySection
                    title="4. Resume and Application Submission"
                    content="When applying for a job, you must ensure that all provided information is accurate and truthful. Currently, we strictly accept resumes in PDF format to maintain document integrity and ensure a professional review process. Misrepresentation of qualifications, experience, or identity may lead to immediate disqualification from the recruitment process and potential banning from the platform."
                />

                <PolicySection
                    title="5. Intellectual Property"
                    content="All content on this platform, including logos, designs, software code, and text, is the property of HRConnect or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or modify any part of the platform without explicit written consent from our legal department."
                />

                <PolicySection
                    title="6. Limitation of Liability"
                    content="HRConnect serves as a facilitator between candidates and employers. While we strive to maintain high standards, we do not guarantee employment or the accuracy of job postings provided by third-party companies. HRConnect shall not be held liable for any direct or indirect damages arising from your use of the platform or any employment decisions made by participating companies."
                />

                <PolicySection
                    title="7. Cookies and Tracking"
                    content="We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and remember your preferences (such as branch locations or job categories). You can manage your cookie preferences through your browser settings; however, disabling cookies may limit your access to certain features of the platform."
                />

                <PolicySection
                    title="8. Amendments to Terms"
                    content="We reserve the right to update these Terms & Policies at any time to reflect changes in our services or legal requirements. We will notify users of significant changes through email or a prominent notice on the platform. Continued use of HRConnect following such updates constitutes your acceptance of the revised terms."
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
