import React, { useState, useEffect, useContext } from 'react';
import { DollarSign, TrendingUp, Briefcase, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { getDashboardStats, getProjects } from '../api';

const Earnings = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const uid = user?.id;

    useEffect(() => {
        Promise.all([getDashboardStats(), getProjects()])
            .then(([s, projects]) => {
                setStats(s);
                const completed = Array.isArray(projects)
                    ? projects.filter(p => p.status === 'completed' && (p.assignedTo === uid || p.assignedTo?.id === uid))
                    : [];
                setCompletedProjects(completed);
            })
            .catch(() => toast.error('Failed to load earnings'))
            .finally(() => setLoading(false));
    }, [uid]);

    const CARDS = [
        { label: 'Total Earnings', value: stats ? `$${(stats.totalEarnings || 0).toLocaleString()}` : '—', icon: DollarSign, grad: 'var(--grad-emerald)', glow: 'var(--emerald-glow)' },
        { label: 'This Month',     value: stats ? `$${(stats.monthlyEarnings || 0).toLocaleString()}` : '—', icon: TrendingUp, grad: 'var(--grad-sky)',     glow: 'var(--sky-glow)' },
        { label: 'Jobs Completed', value: stats ? String(stats.jobsCompleted || 0) : '—',                    icon: Briefcase,  grad: 'var(--grad-violet)', glow: 'var(--violet-glow)' },
        { label: 'Monthly Growth', value: stats ? `${stats.monthlyGrowth || 0}%` : '—',                      icon: Star,       grad: 'var(--grad-gold)',   glow: 'var(--gold-glow)' },
    ];

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.div className="mb-8" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-black" style={{ color: 'var(--text-loud)' }}>Earnings</h1>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Your complete earnings overview.
                    </p>
                </motion.div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {CARDS.map(({ label, value, icon: Icon, grad, glow }, i) => (
                        <motion.div key={label} className="stat-card"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}>
                            <div className="p-2.5 rounded-xl flex-shrink-0"
                                style={{ background: grad, boxShadow: `0 0 14px ${glow}` }}>
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                                <p className="text-2xl font-black" style={{ color: 'var(--text-loud)' }}>
                                    {loading ? '—' : value}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Completed jobs */}
                <motion.div className="card overflow-hidden"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <h3 className="text-base font-bold" style={{ color: 'var(--text-loud)' }}>Completed Jobs</h3>
                    </div>
                    {loading ? (
                        <div className="p-5 space-y-3">
                            {[1,2,3].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}
                        </div>
                    ) : completedProjects.length === 0 ? (
                        <div className="empty-state py-12">
                            <Briefcase className="h-10 w-10 mb-3" style={{ color: 'var(--text-muted)' }} />
                            <p style={{ color: 'var(--text-secondary)' }}>No completed jobs yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                            {completedProjects.map((p, i) => (
                                <motion.div key={p.id || p._id} className="px-5 py-4 flex items-center justify-between"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: 'var(--text-loud)' }}>{p.title}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                            {new Date(p.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-base font-black" style={{ color: 'var(--emerald)' }}>
                                        +${p.budget}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Earnings;
