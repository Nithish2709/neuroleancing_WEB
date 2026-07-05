import React, { useState } from 'react';
import { Mail, Phone, MapPin, Twitter, Github, Linkedin, Send, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SOCIALS = [
    { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:bg-sky-500' },
    { icon: Github, label: 'GitHub', href: '#', color: 'hover:bg-gray-700' },
    { icon: Linkedin, label: 'LinkedIn', href: '#', color: 'hover:bg-blue-700' },
];

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
        if (!form.subject.trim()) e.subject = 'Subject is required';
        if (!form.message.trim()) e.message = 'Message is required';
        else if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setLoading(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        setLoading(false);
        setSubmitted(true);
        toast.success('Message sent! We\'ll get back to you soon.');
    };

    const set = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
        if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
    };

    const inputCls = (field) => `w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 ${
        errors[field] ? 'border-red-400 bg-red-50' : ''
    }`;

    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-main)' }}>

            {/* Hero */}
            <section className="py-20 px-4 text-center"
                style={{ background: 'var(--grad-hero)' }}>
                <h1 className="text-4xl font-extrabold text-white mb-3">Get in Touch</h1>
                <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Have a question, feedback, or just want to say hello? We're here to help.
                </p>
            </section>

            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Contact Info */}
                    <div className="space-y-5">
                        <div className="card p-6">
                            <h2 className="text-base font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Contact Information</h2>
                            <div className="space-y-4">
                                {[
                                    { icon: Mail, label: 'Email', value: 'support@neurolance.com' },
                                    { icon: Phone, label: 'Phone', value: '+1 (555) 000-1234' },
                                    { icon: MapPin, label: 'Address', value: '123 Tech Street, San Francisco, CA 94105' },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-start gap-3">
                                        <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)' }}>
                                            <Icon className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
                                            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card p-6">
                            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Follow Us</h2>
                            <div className="flex gap-3">
                                {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                                    <a key={label} href={href} aria-label={label}
                                        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all hover:text-white hover:-translate-y-0.5 ${color}`}
                                        style={{ background: 'var(--surface-hover)', color: 'var(--text-secondary)' }}>
                                        <Icon className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="card p-6">
                            <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Response Time</h2>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                We typically respond within <span className="font-semibold text-sky-600">24 hours</span> on business days.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2 card p-8">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                                    Thanks for reaching out. We'll get back to you within 24 hours.
                                </p>
                                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary">
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Send us a message</h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
                                            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                                                placeholder="John Doe"
                                                className={inputCls('name')}
                                                style={{ background: 'var(--surface-input)', borderColor: errors.name ? '' : 'var(--surface-border)', color: 'var(--text-primary)' }} />
                                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email Address *</label>
                                            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                                                placeholder="you@example.com"
                                                className={inputCls('email')}
                                                style={{ background: 'var(--surface-input)', borderColor: errors.email ? '' : 'var(--surface-border)', color: 'var(--text-primary)' }} />
                                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Subject *</label>
                                        <input type="text" value={form.subject} onChange={e => set('subject', e.target.value)}
                                            placeholder="How can we help?"
                                            className={inputCls('subject')}
                                            style={{ background: 'var(--surface-input)', borderColor: errors.subject ? '' : 'var(--surface-border)', color: 'var(--text-primary)' }} />
                                        {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Message *</label>
                                        <textarea value={form.message} onChange={e => set('message', e.target.value)}
                                            rows={5} placeholder="Tell us more about your inquiry..."
                                            className={inputCls('message')}
                                            style={{ background: 'var(--surface-input)', borderColor: errors.message ? '' : 'var(--surface-border)', color: 'var(--text-primary)', resize: 'vertical' }} />
                                        <div className="flex justify-between mt-1">
                                            {errors.message ? <p className="text-xs text-red-500">{errors.message}</p> : <span />}
                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{form.message.length} chars</p>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white btn-primary disabled:opacity-60">
                                        {loading ? (
                                            <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                                        ) : (
                                            <><Send className="h-4 w-4" /> Send Message</>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
