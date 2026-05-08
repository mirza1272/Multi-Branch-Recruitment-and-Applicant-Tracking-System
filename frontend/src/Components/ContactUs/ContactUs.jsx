import React, { useState, useEffect } from "react";

const C = { bg: '#0F172A', card: '#1E293B', primary: '#3B82F6', text: '#F1F5F9', muted: '#94A3B8', border: '#334155', accent: '#2DD4BF' };

const ContactInfoItem = ({ icon, label, val }) => (
    <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ width: '48px', height: '48px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primary, flexShrink: 0 }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem' }}>{label}</p>
            <p style={{ fontSize: '0.9rem', color: C.muted, lineHeight: 1.5 }}>{val}</p>
        </div>
    </div>
);

function ContactUs() {
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", message: "" });
    const user = JSON.parse(localStorage.getItem('user'));
    const isHR = user?.role === 'HR';
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Message sent successfully!");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
    };

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

    return (
        <div style={{ background: C.bg, color: C.text, minHeight: '100vh' }}>

            {/* Hero Section */}
            <div className="animate-fade-in" style={{ height: '350px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                    src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop"
                    alt="Contact Hero"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) contrast(1.1)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.95) 100%)' }}></div>
                <div className="animate-fade-in-up" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.03em', textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>Contact <span style={{ color: C.primary }}>Us</span></h1>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '5rem', alignItems: 'flex-start' }}>

                    {/* Left Side: Contact Info */}
                    <div className="reveal-left">
                        <h2 style={{ fontSize: '2.75rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                            {isHR ? (
                                <>Efficient hiring starts here — <span style={{ color: C.primary }}>our team is ready to help.</span></>
                            ) : (
                                <>You Will Grow, You Will Succeed. <span style={{ color: C.primary }}>We Promise That.</span></>
                            )}
                        </h2>
                        <p style={{ color: C.muted, fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '3rem' }}>
                            Have questions about our platform or need assistance with your recruitment process? Our team is here to help you succeed every step of the way.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <ContactInfoItem icon={<PhoneIcon />} label="Call for inquiry" val="+1 (212) 555-0198" />
                            <ContactInfoItem icon={<MailIcon />} label="Send us email" val="support@hrconnect.com" />
                            <ContactInfoItem icon={<ClockIcon />} label="Opening hours" val="Mon - Fri: 09AM - 06PM" />
                            <ContactInfoItem icon={<MapIcon />} label="Office Address" val="7th Ave, New York, NY 10001, USA" />
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="glass-card reveal-right" style={{ padding: '3rem', borderRadius: '24px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Contact Info</h3>
                            <p style={{ color: C.muted, fontSize: '0.9rem' }}>Fill out the form below and we'll get back to you shortly.</p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelS}>First Name</label>
                                    <input type="text" placeholder="Your name" style={inputS} value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={labelS}>Last Name</label>
                                    <input type="text" placeholder="Your last name" style={inputS} value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
                                </div>
                            </div>
                            <div>
                                <label style={labelS}>Email Address</label>
                                <input type="email" placeholder="Your E-mail address" style={inputS} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div>
                                <label style={labelS}>Message</label>
                                <textarea placeholder="Your message..." style={{ ...inputS, height: '120px', resize: 'none' }} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required></textarea>
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: '1rem', borderRadius: '12px', fontWeight: '800', fontSize: '1rem', marginTop: '1rem' }}>
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="reveal" style={{ marginTop: '6rem', borderRadius: '24px', overflow: 'hidden', border: `1px solid ${C.border}`, height: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                    <iframe
                        title="New York Office Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1699266000000!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>

        </div>
    );
}

const labelS = { fontSize: '0.85rem', fontWeight: '700', color: C.text, display: 'block', marginBottom: '0.5rem' };
const inputS = { width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '0.8rem 1rem', color: C.text, fontSize: '0.9rem', outline: 'none' };

// Icons
const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const MapIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

export default ContactUs;
