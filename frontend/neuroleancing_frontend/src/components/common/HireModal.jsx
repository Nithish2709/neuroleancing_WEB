import React, { useState, useEffect, useContext } from 'react';
import { X, Briefcase, CheckCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { getProjects, assignProject } from '../../api';

const HireModal = ({ isOpen, onClose, freelancer }) => {
    const { user: authUser } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [selected, setSelected] = useState('');
    const [loading, setLoading]   = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess]   = useState(false);

    const uid = authUser?.id;

    useEffect(() => {
        if (!isOpen) { setSelected(''); setSuccess(false); return; }
        setFetching(true);
        getProjects()
            .then(data => {
                const mine = (Array.isArray(data) ? data : []).filter(p =>
                    (p.client?.id === uid || p.client?._id === uid || p.client === uid || p.clientId === uid) &&
                    p.status === 'open'
                );
                setProjects(mine);
            })
            .catch(err => toast.error('Could not load your projects: ' + err.message))
            .finally(() => setFetching(false));
    }, [isOpen, uid]);

    // FIX 16 — no token param, credentials:include via api.js
    const handleHire = async () => {
        if (!selected) { toast.error('Please select a project first'); return; }
        setLoading(true);
        try {
            await assignProject(selected, { freelancerId: freelancer.id || freelancer._id });
            setSuccess(true);
            toast.success(`${freelancer.name} has been hired successfully!`);
            setTimeout(onClose, 1800);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div
                        className="absolute inset-0"
                        style={{ background: 'rgba(2,5,8,0.85)', backdropFilter: 'blur(8px)' }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="relative w-full max-w-md overflow-hidden"
                        style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', borderRadius: '16px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.96 }}
                        transition={{ duration: 0.22, ease: [0.34,1.56,0.64,1] }}
                    >
                        {/* Header stripe */}
                        <div style={{ background: 'var(--grad-emerald)', height: '3px' }} />

                        <div className="px-6 py-5">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                                        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--border-emerald)' }}>
                                        <Briefcase className="h-5 w-5" style={{ color: 'var(--emerald)' }} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold" style={{ color: 'var(--text-loud)' }}>Hire Freelancer</h3>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            Assign {freelancer?.name} to a project
                                        </p>
                                    </div>
                                </div>
                                <button onClick={onClose}
                                    className="h-8 w-8 rounded-lg flex items-center justify-center transition-all"
                                    style={{ color: 'var(--text-muted)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {success ? (
                                <motion.div className="py-8 flex flex-col items-center gap-3 text-center"
                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300 }}>
                                    <div className="h-16 w-16 rounded-full flex items-center justify-center"
                                        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--border-emerald)' }}>
                                        <CheckCircle className="h-8 w-8" style={{ color: 'var(--emerald)' }} />
                                    </div>
                                    <p className="text-base font-semibold" style={{ color: 'var(--text-loud)' }}>Hired Successfully!</p>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        {freelancer?.name} has been assigned to your project.
                                    </p>
                                </motion.div>
                            ) : fetching ? (
                                <div className="py-8 flex items-center justify-center">
                                    <Loader className="h-6 w-6 animate-spin" style={{ color: 'var(--sky)' }} />
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="py-8 text-center">
                                    <Briefcase className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No open projects found</p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Post a job first, then hire a freelancer.</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                                        Select which project to assign this freelancer to:
                                    </p>
                                    <div className="space-y-2 max-h-52 overflow-y-auto mb-5">
                                        {projects.map(p => (
                                            <label key={p.id || p._id}
                                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                                                style={{
                                                    border: `1px solid ${selected === (p.id || p._id) ? 'var(--border-emerald)' : 'var(--border-default)'}`,
                                                    background: selected === (p.id || p._id) ? 'rgba(16,185,129,0.08)' : 'var(--bg-surface)',
                                                }}>
                                                <input type="radio" name="project" value={p.id || p._id}
                                                    checked={selected === (p.id || p._id)}
                                                    onChange={e => setSelected(e.target.value)}
                                                    style={{ accentColor: 'var(--emerald)' }} />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-loud)' }}>{p.title}</p>
                                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Budget: ${p.budget}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={onClose}
                                            className="flex-1 py-2.5 rounded-xl text-sm font-medium btn-secondary">
                                            Cancel
                                        </button>
                                        <motion.button onClick={handleHire} disabled={loading || !selected}
                                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white btn-success flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            whileHover={{ scale: loading || !selected ? 1 : 1.02 }}
                                            whileTap={{ scale: loading || !selected ? 1 : 0.97 }}>
                                            {loading
                                                ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Hiring…</>
                                                : 'Confirm Hire'
                                            }
                                        </motion.button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default HireModal;
