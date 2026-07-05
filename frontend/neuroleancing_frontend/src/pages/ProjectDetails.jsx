import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Calendar, MapPin, CheckCircle, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import SubmitProposalModal from '../components/projects/SubmitProposalModal';
import ConfirmModal from '../components/common/ConfirmModal';
import { getProjectById, acceptProposal, deleteProject, updateProject } from '../api';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const uid = user?.id;

    useEffect(() => {
        if (!UUID_REGEX.test(id)) { toast.error('Invalid project ID'); setLoading(false); return; }
        getProjectById(id)
            .then(setProject)
            .catch(err => toast.error(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent"
                style={{ borderColor: 'var(--sky)', borderTopColor: 'transparent' }} />
        </div>
    );

    if (!project) return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <p className="text-xl mb-4" style={{ color: 'var(--text-secondary)' }}>Project not found</p>
            <Link to="/projects" style={{ color: 'var(--sky)' }} className="hover:underline">Back to Projects</Link>
        </div>
    );

    // FIX 23 — single "Accept & Hire" action, no separate Assign
    const handleAcceptProposal = async (proposalId) => {
        if (!UUID_REGEX.test(proposalId)) { toast.error('Invalid proposal ID'); return; }
        try {
            const data = await acceptProposal(id, proposalId);
            toast.success('Proposal accepted! Freelancer hired.');
            setProject(data.project || data);
        } catch { toast.error('An error occurred'); }
    };

    // FIX 30 — delete with ConfirmModal
    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProject(id);
            toast.success('Project deleted');
            navigate('/projects/mine');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    const isFreelancer = user?.role === 'freelancer';
    const hasApplied = project.proposals?.some(p =>
        p.freelancer?.id === uid || p.freelancer?._id === uid || p.freelancer === uid
    );
    const isOwner = project.client?.id === uid || project.client?._id === uid || project.client === uid || project.clientId === uid;

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/projects" className="inline-flex items-center text-sm mb-6 transition-colors hover:opacity-80"
                    style={{ color: 'var(--sky)' }}>
                    <ArrowLeft className="w-4 h-4 mr-1" />Back to Projects
                </Link>

                {/* Main Card */}
                <div className="card overflow-hidden mb-6">
                    <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-black" style={{ color: 'var(--text-loud)' }}>{project.title}</h3>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                <span className={`px-2.5 py-0.5 text-xs font-semibold ${
                                    project.status === 'open' ? 'badge-sky' : project.status === 'assigned' ? 'badge-gold' : 'badge-emerald'
                                }`}>{(project.status || 'open').toUpperCase()}</span>
                                <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                    <Clock className="w-4 h-4" />Posted {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                                {project.location && (
                                    <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                        <MapPin className="w-4 h-4" />{project.location}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                            {isFreelancer && !hasApplied && (
                                <motion.button onClick={() => setIsModalOpen(true)}
                                    className="px-5 py-2.5 text-sm font-bold rounded-xl text-white btn-primary"
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    Apply Now
                                </motion.button>
                            )}
                            {hasApplied && (
                                <span className="px-5 py-2.5 text-sm font-medium rounded-xl badge-emerald">
                                    ✓ Proposal Submitted
                                </span>
                            )}
                            {/* FIX 17 — edit + delete for owner */}
                            {isOwner && (
                                <>
                                    <Link to="/projects/mine"
                                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl btn-secondary">
                                        Manage
                                    </Link>
                                    <motion.button onClick={() => setConfirmDelete(true)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl btn-danger"
                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Trash2 className="h-4 w-4" />Delete
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1 mb-1"
                                    style={{ color: 'var(--text-muted)' }}>
                                    <DollarSign className="w-3.5 h-3.5" />Budget
                                </dt>
                                <dd className="text-base font-bold" style={{ color: 'var(--emerald)' }}>${project.budget}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1 mb-1"
                                    style={{ color: 'var(--text-muted)' }}>
                                    <Calendar className="w-3.5 h-3.5" />Deadline
                                </dt>
                                <dd className="text-base font-bold" style={{ color: 'var(--text-loud)' }}>
                                    {project.deadline || 'Not specified'}
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Description</dt>
                                <dd className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{project.description}</dd>
                            </div>
                            {(project.skillsRequired || []).length > 0 && (
                                <div className="sm:col-span-2">
                                    <dt className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Required Skills</dt>
                                    <dd className="flex flex-wrap gap-2">
                                        {project.skillsRequired.map(skill => (
                                            <span key={skill} className="badge-sky px-3 py-0.5 text-sm font-medium">{skill}</span>
                                        ))}
                                    </dd>
                                </div>
                            )}
                            <div className="sm:col-span-2">
                                <dt className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>About the Client</dt>
                                <div className="flex items-center p-4 rounded-xl"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold" style={{ color: 'var(--text-loud)' }}>{project.client?.name}</p>
                                        <div className="flex items-center mt-1 gap-1">
                                            <CheckCircle className="w-4 h-4" style={{ color: 'var(--emerald)' }} />
                                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Verified Client</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applicants — FIX 23: only "Accept & Hire", no separate Assign */}
                {isOwner && project.proposals?.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-loud)' }}>
                            Applicants ({project.proposals.length})
                        </h3>
                        <div className="space-y-4">
                            {project.proposals.map((proposal) => (
                                <div key={proposal._id} className="card p-6">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={proposal.freelancer?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(proposal.freelancer?.name || 'F')}&background=0ea5e9&color=fff`}
                                                alt={proposal.freelancer?.name}
                                                className="h-12 w-12 rounded-full object-cover"
                                                style={{ boxShadow: '0 0 10px var(--sky-glow)' }}
                                            />
                                            <div>
                                                <h4 className="text-base font-bold" style={{ color: 'var(--text-loud)' }}>{proposal.freelancer?.name}</h4>
                                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{proposal.freelancer?.title}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-sm font-semibold" style={{ color: 'var(--emerald)' }}>
                                                        Bid: ${proposal.bidAmount}
                                                    </span>
                                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                        Applied {new Date(proposal.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Link to={`/freelancers/${proposal.freelancer?.id || proposal.freelancer?._id}`}
                                                className="px-3 py-1.5 text-xs font-medium rounded-lg btn-secondary">
                                                View Profile
                                            </Link>
                                            {/* FIX 23 — single action */}
                                            {proposal.status === 'pending' && project.status === 'open' ? (
                                                <motion.button
                                                    onClick={() => handleAcceptProposal(proposal._id)}
                                                    className="px-3 py-1.5 text-xs font-bold rounded-lg text-white btn-primary"
                                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                                    Accept &amp; Hire
                                                </motion.button>
                                            ) : proposal.status === 'accepted' ? (
                                                <span className="px-3 py-1.5 text-xs font-semibold badge-emerald">✓ Hired</span>
                                            ) : project.status === 'completed' ? (
                                                <span className="px-3 py-1.5 text-xs font-semibold badge-emerald">Completed</span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Cover Letter</p>
                                        <p className="text-sm whitespace-pre-line p-3 rounded-xl"
                                            style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}>
                                            {proposal.coverLetter}
                                        </p>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Skills</p>
                                            <div className="flex flex-wrap gap-1">
                                                {(proposal.freelancer?.skills || []).length > 0
                                                    ? proposal.freelancer.skills.map(s => <span key={s} className="badge-sky px-2 py-0.5 text-xs font-medium">{s}</span>)
                                                    : <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No skills listed</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Tools</p>
                                            <div className="flex flex-wrap gap-1">
                                                {(proposal.freelancer?.tools || []).length > 0
                                                    ? proposal.freelancer.tools.map(t => <span key={t} className="badge-emerald px-2 py-0.5 text-xs font-medium">{t}</span>)
                                                    : <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No tools listed</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isOwner && project.proposals?.length === 0 && (
                    <div className="mt-6 card p-10 text-center" style={{ border: '2px dashed var(--border-default)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No applicants yet for this project.</p>
                    </div>
                )}
            </div>

            <SubmitProposalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={id}
                onProposalSubmitted={(updated) => setProject(updated)}
            />

            {/* FIX 24 — ConfirmModal instead of window.confirm */}
            <ConfirmModal
                open={confirmDelete}
                title="Delete Project"
                message="This will permanently delete the project and all proposals. This cannot be undone."
                confirmLabel={deleting ? 'Deleting…' : 'Delete Project'}
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(false)}
            />
        </div>
    );
};

export default ProjectDetails;
