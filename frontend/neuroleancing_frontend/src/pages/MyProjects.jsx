import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, Clock, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { getProjects, deleteProject } from '../api';
import ConfirmModal from '../components/common/ConfirmModal';

const STATUS_MAP = {
    open:      { cls: 'badge-sky',     label: 'Open' },
    assigned:  { cls: 'badge-gold',    label: 'In Progress' },
    completed: { cls: 'badge-emerald', label: 'Completed' },
};

const MyProjects = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmId, setConfirmId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const uid = user?.id;

    useEffect(() => {
        getProjects()
            .then(data => {
                const mine = Array.isArray(data)
                    ? data.filter(p => p.client?.id === uid || p.client?._id === uid || p.client === uid || p.clientId === uid)
                    : [];
                setProjects(mine);
            })
            .catch(() => toast.error('Failed to load projects'))
            .finally(() => setLoading(false));
    }, [uid]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProject(confirmId);
            setProjects(p => p.filter(x => (x.id || x._id) !== confirmId));
            toast.success('Project deleted');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false);
            setConfirmId(null);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.div className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                    <div>
                        <h1 className="text-3xl font-black" style={{ color: 'var(--text-loud)' }}>My Projects</h1>
                        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Manage all your posted jobs.
                        </p>
                    </div>
                    <motion.button onClick={() => navigate('/projects/new')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white btn-primary"
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Plus className="h-4 w-4" />Post a Job
                    </motion.button>
                </motion.div>

                {loading ? (
                    <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="card p-5">
                                <div className="skeleton h-5 w-1/2 rounded mb-3" />
                                <div className="skeleton h-4 w-full rounded mb-2" />
                                <div className="skeleton h-4 w-3/4 rounded" />
                            </div>
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="text-5xl mb-4">📋</div>
                        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-loud)' }}>No projects yet</h3>
                        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Post your first job to get started.</p>
                        <motion.button onClick={() => navigate('/projects/new')}
                            className="px-5 py-2.5 text-sm font-bold rounded-xl text-white btn-primary"
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                            + Post a Job
                        </motion.button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {projects.map((p, i) => {
                                const pid = p.id || p._id;
                                const { cls, label } = STATUS_MAP[p.status] || STATUS_MAP.open;
                                return (
                                    <motion.div key={pid} className="card p-5"
                                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.05 }}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <h3 className="text-base font-bold" style={{ color: 'var(--text-loud)' }}>{p.title}</h3>
                                                    <span className={`px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>
                                                </div>
                                                <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>{p.description}</p>
                                                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="h-3.5 w-3.5" style={{ color: 'var(--emerald)' }} />
                                                        <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>${p.budget}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {new Date(p.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span>{p.proposals?.length || 0} proposal{p.proposals?.length !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Link to={`/projects/${pid}`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium btn-secondary">
                                                        <Eye className="h-3.5 w-3.5" />View
                                                    </Link>
                                                </motion.div>
                                                <motion.button
                                                    onClick={() => setConfirmId(pid)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium btn-danger"
                                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Trash2 className="h-3.5 w-3.5" />Delete
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={!!confirmId}
                title="Delete Project"
                message="This will permanently delete the project and all its proposals. This cannot be undone."
                confirmLabel={deleting ? 'Deleting…' : 'Delete Project'}
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setConfirmId(null)}
            />
        </div>
    );
};

export default MyProjects;
