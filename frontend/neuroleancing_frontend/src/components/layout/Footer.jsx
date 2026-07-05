import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';


const LINKS = {
    Platform: [
        { label: 'Browse Projects', to: '/projects' },
        { label: 'Find Freelancers', to: '/freelancers' },
        { label: 'Post a Job', to: '/dashboard' },
    ],
    Company: [
        { label: 'About Us', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Blog', to: '#' },
    ],
    Support: [
        { label: 'Help Center', to: '#' },
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Service', to: '#' },
    ],
};

const SOCIALS = [
    { icon: Twitter,  label: 'Twitter',  href: '#' },
    { icon: Github,   label: 'GitHub',   href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
];

const Footer = () => (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }} className="mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                <div className="col-span-2 md:col-span-1">
                    <Link to="/" className="inline-flex items-center gap-2 font-bold text-lg mb-3">
                        <motion.div
                            className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
                            style={{ background: 'var(--grad-sky)', boxShadow: '0 0 12px var(--sky-glow)' }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            N
                        </motion.div>
                        <span className="gradient-text">Neurolance</span>
                    </Link>
                    <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
                        The platform where great work gets done. Connect, collaborate, and grow.
                    </p>
                    <div className="flex gap-3 mt-4">
                        {SOCIALS.map(({ icon: Icon, label, href }) => (
                            <motion.a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="h-8 w-8 rounded-lg flex items-center justify-center transition-all"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,165,233,0.15)'; e.currentTarget.style.borderColor = 'var(--border-sky)'; e.currentTarget.style.color = 'var(--sky)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                            >
                                <Icon className="h-4 w-4" />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {Object.entries(LINKS).map(([group, items]) => (
                    <div key={group}>
                        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
                            {group}
                        </h4>
                        <ul className="space-y-2">
                            {items.map(({ label, to }) => (
                                <li key={label}>
                                    <Link to={to}
                                        className="text-sm transition-colors"
                                        style={{ color: 'var(--text-muted)' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--sky)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
                style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    &copy; {new Date().getFullYear()} Neurolance, Inc. All rights reserved.
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Built with ❤️ for freelancers worldwide</p>
            </div>
        </div>
    </footer>
);

export default Footer;
