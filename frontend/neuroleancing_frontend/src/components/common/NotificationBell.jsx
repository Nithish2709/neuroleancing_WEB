import React, { useState, useEffect, useRef, useContext } from 'react';
import { Bell, Briefcase, MessageCircle, FileText, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { getProjects, getProfile } from '../../api';

// FIX 3 — dark-safe rgba() colors, never Tailwind light-mode bg-* classes
const TYPE_STYLES = {
    job:      { bg: 'rgba(14,165,233,0.15)',  color: '#38bdf8', icon: Briefcase     },
    proposal: { bg: 'rgba(14,165,233,0.15)',  color: '#38bdf8', icon: FileText      },
    message:  { bg: 'rgba(139,92,246,0.15)',  color: '#a78bfa', icon: MessageCircle },
    hired:    { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', icon: CheckCircle   },
    default:  { bg: 'rgba(255,255,255,0.08)', color: '#94a3b8', icon: Bell          },
};

const NotificationBell = () => {
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const ref = useRef(null);

    const unread = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (!user) return;
        const fetch_ = async () => {
            try {
                const [projects, profile] = await Promise.all([getProjects(), getProfile()]);
                const uid = user.id || user._id;
                const notifs = [];

                if (user.role === 'freelancer') {
                    (Array.isArray(projects) ? projects : [])
                        .filter(p => p.status === 'open').slice(0, 5)
                        .forEach(p => notifs.push({ id: `job-${p.id}`, type: 'job', title: 'New job posted', body: p.title, link: `/projects/${p.id}`, time: p.createdAt, read: false }));
                    (Array.isArray(projects) ? projects : [])
                        .filter(p => p.assignedTo === uid)
                        .forEach(p => notifs.push({ id: `hired-${p.id}`, type: 'hired', title: 'You were hired!', body: p.title, link: `/projects/${p.id}`, time: p.updatedAt, read: false }));
                } else {
                    (Array.isArray(projects) ? projects : [])
                        .filter(p => (p.client?.id === uid || p.client === uid) && p.proposals?.length > 0)
                        .forEach(p => notifs.push({ id: `proposal-${p.id}`, type: 'proposal', title: `${p.proposals.length} proposal${p.proposals.length > 1 ? 's' : ''} received`, body: p.title, link: `/projects/${p.id}`, time: p.updatedAt, read: false }));
                }

                if (profile.newMessages > 0) {
                    notifs.unshift({ id: 'messages', type: 'message', title: `${profile.newMessages} new message${profile.newMessages > 1 ? 's' : ''}`, body: 'You have unread messages', link: '/messages', time: new Date().toISOString(), read: false });
                }

                setNotifications(prev => {
                    const readIds = new Set(prev.filter(n => n.read).map(n => n.id));
                    return notifs.map(n => ({ ...n, read: readIds.has(n.id) })).slice(0, 10);
                });
            } catch (_) {}
        };
        fetch_();
        const interval = setInterval(fetch_, 30000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
    const dismiss = (id) => setNotifications(n => n.filter(x => x.id !== id));

    const timeAgo = (iso) => {
        if (!iso) return '';
        const diff = Date.now() - new Date(iso).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1) return 'just now';
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        return `${Math.floor(h / 24)}d ago`;
    };

    return (
        <div className="relative" ref={ref}>
            <motion.button
                onClick={() => setOpen(o => !o)}
                className="relative p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Notifications"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                    <span
                        className="notif-badge absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full text-white text-[10px] font-bold leading-none"
                        style={{ background: 'var(--violet)', boxShadow: '0 0 8px var(--violet-glow)' }}
                    >
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </motion.button>

            {/* FIX 12 — AnimatePresence with key prop for exit animation */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="notification-dropdown"
                        className="notif-dropdown absolute right-0 mt-2 w-80 rounded-2xl border shadow-xl z-50 overflow-hidden"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                        <div className="flex items-center justify-between px-4 py-3"
                            style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <span className="text-sm font-bold" style={{ color: 'var(--text-loud)' }}>
                                Notifications
                                {unread > 0 && <span className="ml-1 text-xs" style={{ color: 'var(--sky)' }}>({unread} new)</span>}
                            </span>
                            {unread > 0 && (
                                <button onClick={markAllRead} className="text-xs font-medium transition-colors hover:opacity-80" style={{ color: 'var(--sky)' }}>
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                                    No notifications yet
                                </div>
                            ) : notifications.map(n => {
                                const { bg, color, icon: Icon } = TYPE_STYLES[n.type] || TYPE_STYLES.default;
                                return (
                                    <div key={n.id}
                                        className="flex items-start gap-3 px-4 py-3 transition-all"
                                        style={{ background: n.read ? 'transparent' : 'rgba(14,165,233,0.06)', borderBottom: '1px solid var(--border-subtle)' }}>
                                        <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                            style={{ background: bg }}>
                                            <Icon className="h-4 w-4" style={{ color }} />
                                        </div>
                                        <Link to={n.link}
                                            onClick={() => { setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x)); setOpen(false); }}
                                            className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-loud)' }}>{n.title}</p>
                                            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.body}</p>
                                            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{timeAgo(n.time)}</p>
                                        </Link>
                                        <button onClick={() => dismiss(n.id)} className="flex-shrink-0 mt-0.5 opacity-40 hover:opacity-80">
                                            <X className="h-3.5 w-3.5" style={{ color: 'var(--text-secondary)' }} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
