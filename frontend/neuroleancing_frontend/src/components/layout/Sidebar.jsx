import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Briefcase, FileText, MessageCircle,
    Settings, PlusCircle, Users, DollarSign, Search,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

// FIX 8 — correct routes for all nav items
const FREELANCER_NAV = [
    { label: 'Dashboard',    icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Browse Jobs',  icon: Search,          to: '/projects' },
    { label: 'Applied Jobs', icon: FileText,        to: '/projects/applied' },
    { label: 'Earnings',     icon: DollarSign,      to: '/earnings' },
    { label: 'Messages',     icon: MessageCircle,   to: '/messages' },
    { label: 'Settings',     icon: Settings,        to: '/settings' },
];

const CLIENT_NAV = [
    { label: 'Dashboard',   icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Post a Job',  icon: PlusCircle,      to: '/projects/new' },
    { label: 'My Projects', icon: Briefcase,       to: '/projects/mine' },
    { label: 'Freelancers', icon: Users,           to: '/freelancers' },
    { label: 'Messages',    icon: MessageCircle,   to: '/messages' },
    { label: 'Settings',    icon: Settings,        to: '/settings' },
];

const Sidebar = ({ collapsed, onToggle }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const nav = user?.role === 'client' ? CLIENT_NAV : FREELANCER_NAV;

    // FIX 7 — exact match for /dashboard to prevent multiple active items
    const isActive = (to) => {
        if (to === '/dashboard') return location.pathname === '/dashboard';
        return location.pathname === to || location.pathname.startsWith(to + '/');
    };

    return (
        <motion.aside
            className="sidebar flex flex-col h-full flex-shrink-0 relative"
            animate={{ width: collapsed ? 64 : 220 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {/* Toggle */}
            <motion.button
                onClick={onToggle}
                className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full flex items-center justify-center"
                style={{
                    background: 'var(--grad-sky)',
                    border: '1px solid var(--border-sky)',
                    color: 'white',
                    boxShadow: '0 0 10px var(--sky-glow)',
                }}
                aria-label="Toggle sidebar"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
            >
                {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </motion.button>

            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 py-5 overflow-hidden">
                <motion.div
                    className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-white text-sm"
                    style={{ background: 'var(--grad-sky)', boxShadow: '0 0 12px var(--sky-glow)' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    N
                </motion.div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            className="text-sm font-bold truncate text-grad-sky"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            Neurolance
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Role badge */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div className="px-4 mb-3"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full badge-sky">
                            {user?.role}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nav */}
            <nav className="flex-1 px-2 space-y-0.5 overflow-hidden">
                {nav.map(({ label, icon: Icon, to }, i) => (
                    <motion.div key={label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                        <Link to={to} className={`nav-item ${isActive(to) ? 'active' : ''}`} title={collapsed ? label : undefined}>
                            <Icon className="flex-shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span className="truncate"
                                        initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }}>
                                        {label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    </motion.div>
                ))}
            </nav>

            {/* User info */}
            <AnimatePresence>
                {!collapsed && user && (
                    <motion.div className="px-3 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: 'var(--grad-sky)', boxShadow: '0 0 8px var(--sky-glow)' }}>
                                <span className="text-xs font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-loud)' }}>{user.name}</p>
                                <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.aside>
    );
};

export default Sidebar;
