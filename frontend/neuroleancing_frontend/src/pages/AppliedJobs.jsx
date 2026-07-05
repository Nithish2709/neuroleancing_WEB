import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FileText, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { getProjects } from '../api';

const STATUS_MAP = {
    open:      { cls: 'badge-sky',     label: 'Open' },
    assigned:  { cls: 'badge-gold',    label: 'In Progress' },
    completed: { cls: 'badge-emerald', label: 'Completed' },
};

const PROPOSAL_STATUS = {
    pending:  { cls: 'badge-gold',    label: 'Pending' },
    accepted: { cls: 'badge-emerald', label: 'Accepted' },
    rejected: { cls: 'badge-rose',    label: 'Rejected' },
};

const AppliedJobs = () => {
    const { user } = useContext(AuthContext);
    const [applied, setApplied] = useState([]);
    const [loading, setLoading] = useState(true);

    const uid = user?.id;

    useEffect(() => {
        getProjects()
            .then(data => {
                const list = Array.isArray(data)
                    ? data.filter(p =>
                        p.proposals?.some(prop =>
                            prop.freelancer?.id === uid || prop.freelancer?._id === uid || prop.freelancer === uid
                        )
                    ).map(p => {
                        const myProposal = p.proposals.find(prop =>
                            prop.freelancer?.id === uid || prop.freelancer?._id === uid || prop.freelancer === uid
                        );
                        return { ...p, myProposal };
                    })
                    : [];
                setApplied(list);
            })
            .catch(() => toast.error('Failed to load applied jobs'))
            .finally(() => setLoading(false));
    }, [uid]);

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.div className="mb-8" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-black" style={{ color: 'var(--text-loud)' }}>Applied Jobs</h1>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Track all your submitted proposals.
                    </p>
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
                ) : applied.length === 0 ? (
                    <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <FileText className="h-12 w-12 mb-4" style={{ color: 'var(--text-muted)' }} />
                        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-loud)' }}>No applications yet</h3>
                        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Browse open projects and submit your first proposal.</p>
                        <Link to="/projects"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white btn-primary">
                            Browse Jobs <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {applied.map((p, i) => {
                            const pid = p.id || p._id;
                            const { cls: pCls, label: pLabel } = STATUS_MAP[p.status] || STATUS_MAP.open;
                            const propStatus = p.myProposal?.status || 'pending';
                            const { cls: prCls, label: prLabel } = PROPOSAL_STATUS[propStatus] || PROPOSAL_STATUS.pending;
                            return (
                                <motion.div key={pid} className="card p-5"
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <h3 className="text-base font-bold" style={{ color: 'var(--text-loud)' }}>{p.title}</h3>
                                                <span className={`px-2.5 py-0.5 text-xs font-semibold ${pCls}`}>{pLabel}</span>
                                                <span className={`px-2.5 py-0.5 text-xs font-semibold ${prCls}`}>
                                                    Proposal: {prLabel}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="h-3.5 w-3.5" style={{ color: 'var(--sky)' }} />
                                                    <span style={{ color: 'var(--sky)', fontWeight: 600 }}>
                                                        Budget: ${p.budget}
                                                    </span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="h-3.5 w-3.5" style={{ color: 'var(--emerald)' }} />
                                                    <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>
                                                        My Bid: ${p.myProposal?.bidAmount}
                                                    </span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Applied {new Date(p.myProposal?.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <Link to={`/projects/${pid}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium btn-secondary flex-shrink-0">
                                            View <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppliedJobs;
