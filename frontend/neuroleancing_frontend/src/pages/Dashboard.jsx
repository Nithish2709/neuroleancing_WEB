import React, { useState, useEffect, useContext, useRef } from 'react';
import { Briefcase, Plus, Bell, DollarSign, TrendingUp, CheckCircle, Clock, ArrowRight, Loader, ChevronRight, MessageCircle, Settings, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import { toast } from 'react-hot-toast';
import { getDashboardStats, getProjects, updateProjectStatus } from '../api';

const STATUS_TABS = ['All', 'Active', 'Completed', 'Pending'];

const StatusBadge = ({ status }) => {
    const map = {
        open:      { cls: 'badge-sky',     label: 'Open' },
        assigned:  { cls: 'badge-gold',    label: 'In Progress' },
        completed: { cls: 'badge-emerald', label: 'Completed' },
    };
    const { cls, label } = map[status] || map.open;
    return <span className={`px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>;
};

const CountUp = ({ end, duration = 1400, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);
    const hasRun = useRef(false);
    const ref = useRef(null);

    useEffect(() => {
        if (end === 0) { setCount(0); return; }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasRun.current) {
                hasRun.current = true;
                const startTime = performance.now();
                const animate = (now) => {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * end));
                    if (progress < 1) requestAnimationFrame(animate);
                    else setCount(end);
                };
                requestAnimationFrame(animate);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const Dashboard = () => {
    const { user: authUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [updatingId, setUpdatingId] = useState(null);

    // Use stable primitives as effect deps — not the whole object
    const uid      = authUser?.id;
    const role     = authUser?.role;
    const isClient = role === 'client';

    useEffect(() => {
        // Wait until we have a real uid (not stale/undefined)
        if (!uid) return;

        setLoading(true);

        Promise.allSettled([getDashboardStats(), getProjects()])
            .then(([statsResult, projectsResult]) => {
                if (statsResult.status === 'fulfilled') {
                    setStats(statsResult.value);
                } else {
                    console.warn('Stats unavailable:', statsResult.reason?.message);
                }

                const raw = projectsResult.status === 'fulfilled' ? projectsResult.value : [];
                const list = Array.isArray(raw) ? raw : [];

                // Filter to only this user's projects
                // clientId is always a flat UUID string on list responses
                const mine = list.filter(p => {
                    if (role === 'client') {
                        return p.clientId === uid || p.client?.id === uid;
                    }
                    // freelancer: assigned to them OR submitted a proposal
                    const assigned = p.assignedTo === uid;
                    const proposed = (p.proposals || []).some(
                        prop => prop.freelancer === uid
                    );
                    return assigned || proposed;
                });

                setProjects(mine);
            })
            .finally(() => setLoading(false));

    }, [uid, role]); // stable string deps — no object reference churn

    const handleProjectCreated = (p) => setProjects(prev => [p, ...prev]);

    const handleStatusUpdate = async (projectId, newStatus) => {
        setUpdatingId(projectId);
        try {
            await updateProjectStatus(projectId, newStatus);
            setProjects(prev => prev.map(p =>
                (p.id || p._id) === projectId ? { ...p, status: newStatus } : p
            ));
            toast.success(`Marked as ${newStatus}!`);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredProjects = projects.filter(p => {
        if (activeTab === 'All')       return true;
        if (activeTab === 'Active')    return p.status === 'assigned' || p.status === 'open';
        if (activeTab === 'Completed') return p.status === 'completed';
        if (activeTab === 'Pending')   return p.status === 'open';
        return true;
    });

    const STAT_CARDS = [
        {
            label: isClient ? 'Total Spent' : 'Total Earnings',
            value: loading ? 0 : (stats?.totalEarnings ?? 0),
            prefix: '$',
            icon: DollarSign,
            grad: 'var(--grad-emerald)',
            glow: 'var(--emerald-glow)',
            trend: stats?.monthlyGrowth
                ? `${stats.monthlyGrowth > 0 ? '+' : ''}${stats.monthlyGrowth}% this month`
                : 'This month',
            trendColor: 'var(--emerald)',
        },
        {
            label: isClient ? 'Projects Posted' : 'Jobs Completed',
            value: loading ? 0 : (stats?.jobsCompleted ?? projects.length ?? 0),
            prefix: '',
            icon: Briefcase,
            grad: 'var(--grad-sky)',
            glow: 'var(--sky-glow)',
            trend: `${stats?.activeJobs ?? 0} active`,
            trendColor: 'var(--sky)',
        },
        {
            label: 'Unread Messages',
            value: loading ? 0 : (stats?.notifications ?? 0),
            prefix: '',
            icon: Bell,
            grad: 'var(--grad-violet)',
            glow: 'var(--violet-glow)',
            trend: 'In your inbox',
            trendColor: 'var(--violet)',
        },
    ];

    const QUICK_ACTIONS = isClient ? [
        { label: 'Post a Job',         icon: Plus,          grad: 'var(--grad-sky)',     action: () => setIsModalOpen(true) },
        { label: 'Browse Freelancers', icon: Briefcase,     grad: 'var(--grad-emerald)', action: () => navigate('/freelancers') },
        { label: 'Messages',           icon: MessageCircle, grad: 'var(--grad-violet)',  action: () => navigate('/messages') },
        { label: 'Settings',           icon: Settings,      grad: 'var(--grad-gold)',    action: () => navigate('/settings') },
    ] : [
        { label: 'Browse Jobs',  icon: Briefcase,     grad: 'var(--grad-sky)',     action: () => navigate('/projects') },
        { label: 'My Profile',   icon: CheckCircle,   grad: 'var(--grad-emerald)', action: () => navigate(`/freelancers/${uid}`) },
        { label: 'Messages',     icon: MessageCircle, grad: 'var(--grad-violet)',  action: () => navigate('/messages') },
        { label: 'Settings',     icon: Settings,      grad: 'var(--grad-gold)',    action: () => navigate('/settings') },
    ];

    return (
        <div className="py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
                    initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <div>
                        <h1 className="text-3xl font-black" style={{ color: 'var(--text-loud)' }}>Dashboard</h1>
                        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Welcome back,{' '}
                            <span className="font-semibold" style={{ color: 'var(--text-loud)' }}>{authUser?.name}</span>
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full badge-sky capitalize">{role}</span>
                        </p>
                    </div>
                    {isClient && (
                        <motion.button onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white btn-primary"
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Plus className="h-4 w-4" />Post a Job
                        </motion.button>
                    )}
                </motion.div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                    {STAT_CARDS.map(({ label, value, prefix, icon: Icon, grad, glow, trend, trendColor }, i) => (
                        <motion.div key={label} className="stat-card"
                            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}>
                            <div className="p-3 rounded-xl flex-shrink-0"
                                style={{ background: grad, boxShadow: `0 0 16px ${glow}` }}>
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                                <p className="text-4xl font-black" style={{ color: 'var(--text-loud)' }}>
                                    {loading ? '—' : <CountUp end={value} prefix={prefix} />}
                                </p>
                                <p className="text-xs mt-1 flex items-center gap-1 font-semibold" style={{ color: trendColor }}>
                                    <TrendingUp className="h-3 w-3" />{trend}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Project History */}
                    <motion.div className="lg:col-span-2 card overflow-hidden"
                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                            style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <h3 className="text-base font-bold" style={{ color: 'var(--text-loud)' }}>
                                Project History
                                {!loading && (
                                    <span className="ml-2 text-xs font-normal badge-neutral px-2 py-0.5">
                                        {projects.length} total
                                    </span>
                                )}
                            </h3>
                            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                {STATUS_TABS.map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        className={`tab-btn text-xs px-3 py-1.5 ${activeTab === tab ? 'active' : ''}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            {loading ? (
                                <div className="p-5 space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="skeleton h-4 flex-1 rounded" />
                                            <div className="skeleton h-5 w-16 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            ) : filteredProjects.length > 0 ? (
                                <AnimatePresence>
                                    {filteredProjects.map((project, idx) => {
                                        const pid = project.id || project._id;
                                        const isUpdating = updatingId === pid;
                                        const isAssignedToMe = project.assignedTo === uid;
                                        const isMyProject = project.clientId === uid || project.client?.id === uid;
                                        const showStatusBtns = !isClient && isAssignedToMe;
                                        return (
                                            <motion.div key={pid}
                                                className="px-5 py-4"
                                                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.04 }}
                                                whileHover={{ background: 'rgba(255,255,255,0.02)' }}>
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <Link to={`/projects/${pid}`}
                                                                className="text-sm font-semibold truncate transition-colors"
                                                                style={{ color: 'var(--text-loud)' }}
                                                                onMouseEnter={e => e.currentTarget.style.color = 'var(--sky)'}
                                                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-loud)'}>
                                                                {project.title}
                                                            </Link>
                                                            {isAssignedToMe && (
                                                                <span className="px-2 py-0.5 text-xs font-semibold badge-gold">Assigned to You</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                            <span style={{ color: isMyProject ? 'var(--sky)' : 'var(--text-muted)' }}>
                                                                {isMyProject ? 'Posted by you' : 'Applied for'}
                                                            </span>
                                                            <span className="font-semibold" style={{ color: 'var(--emerald)' }}>
                                                                ${project.budget}
                                                            </span>
                                                            <span>{new Date(project.createdAt || project.updatedAt).toLocaleDateString()}</span>
                                                        </div>
                                                        {showStatusBtns && (
                                                            <div className="flex items-center gap-2 mt-3">
                                                                <motion.button
                                                                    onClick={() => handleStatusUpdate(pid, 'completed')}
                                                                    disabled={isUpdating || project.status === 'completed'}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 badge-emerald"
                                                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                                                    {isUpdating ? <Loader className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                                                                    {project.status === 'completed' ? 'Completed' : 'Mark Completed'}
                                                                </motion.button>
                                                                <motion.button
                                                                    onClick={() => handleStatusUpdate(pid, 'assigned')}
                                                                    disabled={isUpdating || project.status === 'assigned'}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 badge-gold"
                                                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                                                    {isUpdating ? <Loader className="h-3 w-3 animate-spin" /> : <Clock className="h-3 w-3" />}
                                                                    {project.status === 'assigned' ? 'In Progress' : 'Mark In Progress'}
                                                                </motion.button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <StatusBadge status={project.status} />
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            ) : (
                                <motion.div className="empty-state py-14"
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className="text-5xl mb-4">📁</div>
                                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-loud)' }}>No projects yet</h3>
                                    <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                                        {isClient ? 'Start by posting your first job!' : 'Browse open projects and apply.'}
                                    </p>
                                    <motion.button
                                        onClick={() => isClient ? setIsModalOpen(true) : navigate('/projects')}
                                        className="px-5 py-2.5 text-sm font-bold rounded-xl text-white btn-primary"
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                        {isClient ? '+ Post a Job' : 'Browse Jobs'}
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>

                        <div className="px-5 py-3" style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.1)' }}>
                            <Link to={isClient ? '/projects/mine' : '/projects'}
                                className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
                                style={{ color: 'var(--sky)' }}>
                                {isClient ? 'View All My Projects' : 'Browse More Jobs'}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right column */}
                    <motion.div className="space-y-5"
                        initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>

                        {/* Quick Actions */}
                        <div className="card p-5">
                            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-loud)' }}>Quick Actions</h3>
                            <div className="space-y-2">
                                {QUICK_ACTIONS.map(({ label, icon: Icon, grad, action }) => (
                                    <motion.button key={label} onClick={action}
                                        className="quick-btn"
                                        whileHover={{ y: -2, scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}>
                                        <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ background: grad }}>
                                            <Icon className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="flex-1 text-sm font-medium">{label}</span>
                                        <ChevronRight className="h-4 w-4 opacity-40" />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Skills — freelancer only */}
                        {!isClient && (
                            <div className="card p-5">
                                <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-loud)' }}>Your Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(authUser?.skills?.length > 0) ? (
                                        authUser.skills.map((skill, i) => (
                                            <motion.span key={skill} className="px-2.5 py-1 text-xs font-medium badge-sky"
                                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.05 }}>
                                                {skill}
                                            </motion.span>
                                        ))
                                    ) : (
                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                            No skills added yet.{' '}
                                            <Link to="/complete-profile" style={{ color: 'var(--sky)' }}>Add skills →</Link>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div className="card p-5">
                            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-loud)' }}>Recent Activity</h3>
                            <div className="space-y-3">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="skeleton h-7 w-7 rounded-lg flex-shrink-0" />
                                            <div className="flex-1 space-y-1.5">
                                                <div className="skeleton h-3 w-3/4 rounded" />
                                                <div className="skeleton h-3 w-1/2 rounded" />
                                            </div>
                                        </div>
                                    ))
                                ) : (stats?.recentProjects?.length > 0 ? stats.recentProjects : projects.slice(0, 3)).length > 0 ? (
                                    (stats?.recentProjects?.length > 0 ? stats.recentProjects : projects.slice(0, 3)).map((p, i) => (
                                        <motion.div key={p.id || p._id} className="flex items-start gap-3"
                                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.08 }}>
                                            <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                                style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid var(--border-sky)' }}>
                                                <Clock className="h-3.5 w-3.5" style={{ color: 'var(--sky)' }} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium truncate" style={{ color: 'var(--text-loud)' }}>
                                                    {p.title || 'Untitled project'}
                                                </p>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : ''}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No recent activity.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={handleProjectCreated}
            />
        </div>
    );
};

export default Dashboard;
