import { useState, type FormEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useToast } from '../../components/toast/Toast';
import Footer from '../../components/layout/Footer';
import ScrollReveal from '../../components/scroll/ScrollReveal';
import './Contact.css';

// FAQ Data
const FAQ_DATA = [
    {
        question: 'How can I join OrbitX?',
        answer: 'You can apply to join OrbitX by navigating to our Recruitment page and browsing available open positions. Fill out the application form with your details, branch, and areas of interest. Our team reviews submissions each academic cycle.'
    },
    {
        question: 'What activities and sessions does OrbitX conduct?',
        answer: 'OrbitX organizes stargazing observation nights, radio astronomy workshops (VLF receivers), telescope collimation sessions, CanSat engineering projects, and astrophysics guest lectures on campus.'
    },
    {
        question: 'Do I need prior astrophysics or engineering experience to join?',
        answer: 'No prior experience is necessary. We welcome students from all engineering branches with curiosity about the cosmos. We provide hands-on workshops and peer mentorship.'
    },
    {
        question: 'How often are stargazing observation sessions hosted?',
        answer: 'We host monthly dark-sky stargazing sessions and regular rooftop observation nights on the Zeal College campus depending on lunar cycles and weather visibility.'
    },
    {
        question: 'Can external colleges or organizations collaborate with OrbitX?',
        answer: 'Yes! We actively collaborate with student astronomical societies, educational institutes, and industry sponsors. Select "Collaboration" or "Sponsorship" in the inquiry form below.'
    }
];

export default function Contact() {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!formData.name || !formData.email || !formData.subject) {
            showToast('Please fill in all required fields (*)', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            // Generate stacking identifiers
            const nameKey = formData.name.trim().toLowerCase();
            const emailKey = formData.email.trim().toLowerCase();
            const userHash = btoa(`${nameKey}:${emailKey}`).substring(0, 12);

            // Get or generate device ID
            let deviceId = localStorage.getItem('orbitx_device_id');
            if (!deviceId) {
                deviceId = Math.random().toString(36).substring(2, 15);
                localStorage.setItem('orbitx_device_id', deviceId);
            }

            const queryId = Math.floor(100000 + Math.random() * 900000);

            await addDoc(collection(db, 'contactMessages'), {
                ...formData,
                userHash,
                deviceId,
                queryId,
                createdAt: serverTimestamp(),
                status: 'unread'
            });

            showToast('Message sent successfully! We will get back to you soon.', 'success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    return (
        <>
            <main className="contact-page">
                {/* ===== Hero Section ===== */}
                <section className="contact-hero" aria-label="Contact Hero">
                    <div className="contact-hero__container">
                        <ScrollReveal direction="up" duration={0.6}>
                            <span className="contact-hero__tag">COMMUNICATIONS & INQUIRIES</span>
                            <h1 className="contact-hero__title">
                                GET IN TOUCH
                            </h1>
                            <p className="contact-hero__subtitle">
                                Have questions regarding memberships, observation nights, research collaborations, or sponsorships? Reach out to the OrbitX team at Zeal College of Engineering and Research, Pune.
                            </p>
                        </ScrollReveal>
                    </div>
                </section>

                {/* ===== Main Grid: Form & Info ===== */}
                <section className="contact-content-section" aria-label="Contact Form and Details">
                    <div className="contact-content__container">
                        <div className="contact-grid">
                            {/* Left Column: Inquiry Form */}
                            <div className="contact-form-wrapper">
                                <div className="contact-card-header">
                                    <span className="contact-card-tag">DIRECT INQUIRY</span>
                                    <h2 className="contact-section-title">Send Us a Message</h2>
                                    <p className="contact-card-desc">
                                        Fill out the form below and an OrbitX coordinator will respond directly to your email.
                                    </p>
                                </div>

                                <form className="contact-form" onSubmit={handleSubmit}>
                                    <div className="contact-form__group">
                                        <label htmlFor="contact-name" className="contact-form__label">
                                            Your Name <span className="contact-form__required">*</span>
                                        </label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            name="name"
                                            className="contact-form__input"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="contact-form__group">
                                        <label htmlFor="contact-email" className="contact-form__label">
                                            Email Address <span className="contact-form__required">*</span>
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            name="email"
                                            className="contact-form__input"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="contact-form__group">
                                        <label htmlFor="contact-subject" className="contact-form__label">
                                            Subject <span className="contact-form__required">*</span>
                                        </label>
                                        <div className="contact-form__select-wrap">
                                            <select
                                                id="contact-subject"
                                                name="subject"
                                                className="contact-form__select"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select an inquiry category</option>
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Membership">Membership & Recruitment</option>
                                                <option value="Events">Stargazing & Workshops</option>
                                                <option value="Collaboration">Project Collaboration</option>
                                                <option value="Sponsorship">Sponsorship & Grants</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="contact-form__group">
                                        <label htmlFor="contact-message" className="contact-form__label">
                                            Message
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            className="contact-form__textarea"
                                            placeholder="Describe your inquiry, project proposal, or question..."
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="contact-form__submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending Message...' : 'Send Message →'}
                                    </button>
                                </form>
                            </div>

                            {/* Right Column: Channels & Details */}
                            <div className="contact-info-wrapper">
                                <div className="contact-card-header">
                                    <span className="contact-card-tag">OFFICIAL CHANNELS</span>
                                    <h2 className="contact-section-title">Direct Communications</h2>
                                    <p className="contact-card-desc">
                                        Connect with our departmental lead and student council representatives directly.
                                    </p>
                                </div>

                                <div className="contact-channels-list">
                                    {/* Email Channel */}
                                    <a
                                        href="mailto:contact.orbitx@zealeducation.com"
                                        className="contact-channel-card"
                                    >
                                        <div className="contact-channel-card__icon" aria-hidden="true">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                        </div>
                                        <div className="contact-channel-card__content">
                                            <span className="contact-channel-card__label">Email Inquiries</span>
                                            <strong className="contact-channel-card__val">contact.orbitx@zealeducation.com</strong>
                                            <span className="contact-channel-card__note">General & academic communications</span>
                                        </div>
                                    </a>

                                    {/* Physical Location */}
                                    <a
                                        href="https://maps.app.goo.gl/zr4Yg3uhrYabnjH49"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="contact-channel-card"
                                    >
                                        <div className="contact-channel-card__icon" aria-hidden="true">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        </div>
                                        <div className="contact-channel-card__content">
                                            <span className="contact-channel-card__label">Campus Location</span>
                                            <strong className="contact-channel-card__val">Zeal College of Engineering and Research, Pune</strong>
                                        </div>
                                    </a>
                                </div>

                                {/* Social Network Links */}
                                <div className="contact-social-section">
                                    <span className="contact-social-section__title">Follow OrbitX Updates</span>
                                    <div className="contact-social-links">
                                        <a
                                            href="https://www.instagram.com/orbitx_zcoer/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-social-btn"
                                            aria-label="Instagram profile"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                            </svg>
                                            <span>Instagram</span>
                                        </a>

                                        <a
                                            href="https://www.linkedin.com/company/orbitx-zcoer/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-social-btn"
                                            aria-label="LinkedIn page"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                                <rect x="2" y="9" width="4" height="12" />
                                                <circle cx="4" cy="4" r="2" />
                                            </svg>
                                            <span>LinkedIn</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== Map Section ===== */}
                <section className="contact-map-section" aria-label="Campus Location Map">
                    <div className="contact-map__container">
                        <div className="contact-section-head">
                            <span className="contact-card-tag">CAMPUS NAVIGATION</span>
                            <h2 className="contact-section-title">Visit the Observatory Station</h2>
                        </div>
                        <div className="contact-map-frame">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2909.1004240421184!2d73.82559228870227!3d18.44842178988876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2be933201c149%3A0x1c055d83993ff72b!2sZeal%20College%20of%20Engineering%20and%20Research!5e1!3m2!1sen!2sus!4v1766668761486!5m2!1sen!2sus"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="OrbitX Zeal College Location Map"
                            />
                        </div>
                    </div>
                </section>

                {/* ===== FAQ Section ===== */}
                <section className="contact-faq-section" aria-label="Frequently Asked Questions">
                    <div className="contact-faq__container">
                        <div className="contact-section-head">
                            <span className="contact-card-tag">KNOWLEDGE BASE</span>
                            <h2 className="contact-section-title">Frequently Asked Questions</h2>
                        </div>
                        <div className="contact-faq-list">
                            {FAQ_DATA.map((faq, index) => {
                                const isExpanded = expandedFaq === index;
                                return (
                                    <div
                                        key={index}
                                        className={`contact-faq-item ${isExpanded ? 'active' : ''}`}
                                    >
                                        <button
                                            type="button"
                                            className="contact-faq-question"
                                            onClick={() => toggleFaq(index)}
                                            aria-expanded={isExpanded}
                                        >
                                            <span>{faq.question}</span>
                                            <span className="contact-faq-icon" aria-hidden="true">
                                                {isExpanded ? '−' : '+'}
                                            </span>
                                        </button>
                                        {isExpanded && (
                                            <div className="contact-faq-answer">
                                                <p>{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
