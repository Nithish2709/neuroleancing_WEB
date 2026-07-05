import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Mail, Globe, Award, Briefcase, ArrowLeft, Settings, PenTool, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import EditProfileModal from '../components/common/EditProfileModal';
import HireModal from '../components/common/HireModal';
import { getUserById } from '../api';

const FreelancerProfile = () => {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);

    useEffect(() => {
        const fetchFreelancer = async () => {
            try {
                const data = await getUserById(id);
                setFreelancer(data);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFreelancer();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-t-2 animate-spin" style={{ borderColor: 'transparent', borderTopColor: 'var(--sky)' }} />
                    <div className="absolute inset-2 rounded-full border-t-2 animate-spin" style={{ borderColor: 'transparent', borderTopColor: 'var(--emerald)', animationDuration: '1.5s', animationDirection: 'reverse' }} />
                </div>
            </div>
        );
    }

    if (!freelancer) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>Profile not found</p>
                <Link to="/freelancers" className="text-sm font-medium hover:underline" style={{ color: '#3b82f6' }}>
                    ← Back to Freelancers
                </Link>
            </div>
        );
    }

    const isOwner = currentUser && (
        currentUser?.id === freelancer.id ||
        currentUser?._id === freelancer.id ||
        String(currentUser?.id) === String(freelancer.id) ||
        String(currentUser?._id) === String(freelancer.id)
    );

    return (
        <div className="min-h-screen py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    to={freelancer.role === 'freelancer' ? '/freelancers' : '/dashboard'}
                    className="inline-flex items-center text-sm mb-6 transition-colors hover:text-blue-300"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />Back
                </Link>

                {/* Header Card */}
                <motion.div
                    className="card overflow-hidden mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="h-28 profile-banner" />
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div className="flex items-end gap-4">
                                {freelancer.profileImage ? (
                                    <img
                                        className="-mt-14 h-24 w-24 rounded-full object-cover"
                                        style={{ boxShadow: '0 0 20px var(--sky-glow), 0 0 0 3px var(--bg-elevated)' }}
                                        src={freelancer.profileImage}
                                        alt={freelancer.name}
                                    />
                                ) : (
                                    <div
                                        className="-mt-14 h-24 w-24 rounded-full flex items-center justify-center"
                                        style={{ background: 'var(--grad-sky)', boxShadow: '0 0 20px var(--sky-glow), 0 0 0 3px var(--bg-elevated)' }}
                                    >
                                        <span className="text-2xl font-black text-white">
                                            {freelancer.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="mb-1">
                                    <h1 className="text-2xl font-black" style={{ color: 'var(--text-loud)' }}>{freelancer.name}</h1>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        {freelancer.title || (freelancer.role === 'freelancer' ? 'Freelancer' : 'Client')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 sm:mb-1">
                                {isOwner ? (
                                    <motion.button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg btn-secondary"
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    >
                                        <Settings className="w-4 h-4 mr-2" />Edit Profile
                                    </motion.button>
                                ) : (
                                    <>
                                        <motion.button
                                            onClick={() => navigate(`/messages/${freelancer.id || freelancer._id}`)}
                                            className="px-4 py-2 text-sm font-semibold rounded-xl btn-secondary"
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        >
                                            Message
                                        </motion.button>
                                        {currentUser?.role === 'client' && (
                                            <motion.button
                                                onClick={() => setIsHireModalOpen(true)}
                                                className="px-4 py-2 text-sm font-bold rounded-xl text-white btn-primary"
                                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            >
                                                Hire Now
                                            </motion.button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {freelancer.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />{freelancer.location}
                                </span>
                            )}
                            {freelancer.rating > 0 && (
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                                    {Number(freelancer.rating).toFixed(1)} · {freelancer.jobsCompleted || 0} jobs completed
                                </span>
                            )}
                            {freelancer.hourlyRate && (
                                <span className="flex items-center gap-1">
                                    <Award className="w-4 h-4" />${freelancer.hourlyRate}/hr
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main */}
                    <div className="md:col-span-2 space-y-6">
                        {freelancer.bio && (
                            <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-loud)' }}>About</h2>
                                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>{freelancer.bio}</p>
                            </motion.div>
                        )}

                        {freelancer.role === 'freelancer' && freelancer.experience && (
                            <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                                <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-loud)' }}>
                                    <Briefcase className="w-4 h-4" style={{ color: 'var(--sky)' }} />Experience
                                </h2>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{freelancer.experience}</p>
                            </motion.div>
                        )}

                        {freelancer.role === 'freelancer' && freelancer.portfolio && (
                            <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-loud)' }}>Portfolio</h2>
                                <a
                                    href={freelancer.portfolio.startsWith('http') ? freelancer.portfolio : `https://${freelancer.portfolio}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm hover:underline break-all"
                                    style={{ color: 'var(--sky)' }}
                                >
                                    <Globe className="w-4 h-4 flex-shrink-0" />{freelancer.portfolio}
                                </a>
                            </motion.div>
                        )}

                        {freelancer.role === 'client' && (
                            <motion.div className="card p-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <h2 className="text-base font-bold mb-4" style={{ color: 'var(--text-loud)' }}>Company Info</h2>
                                <div className="space-y-3">
                                    {freelancer.companyName && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Company</p>
                                            <p className="text-sm mt-0.5" style={{ color: 'var(--text-loud)' }}>{freelancer.companyName}</p>
                                        </div>
                                    )}
                                    {freelancer.projectInterests && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Project Interests</p>
                                            <p className="text-sm mt-0.5" style={{ color: 'var(--text-loud)' }}>{freelancer.projectInterests}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {(freelancer.skills || []).length > 0 && (
                            <motion.div className="card p-6" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                                <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-loud)' }}>Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {freelancer.skills.map(skill => (
                                        <span key={skill} className="badge-blue px-3 py-1 text-sm font-medium">{skill}</span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {(freelancer.tools || []).length > 0 && (
                            <motion.div className="card p-6" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                                <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-loud)' }}>
                                    <PenTool className="w-4 h-4" style={{ color: 'var(--sky)' }} />Tools
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {freelancer.tools.map(tool => (
                                        <span key={tool} className="badge-green px-3 py-1 text-sm font-medium">{tool}</span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        <motion.div className="card p-6" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-loud)' }}>Contact</h2>
                            <div className="space-y-2.5">
                                <div className="flex items-center text-sm gap-2" style={{ color: 'var(--text-secondary)' }}>
                                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                                    {isOwner || currentUser ? (
                                        <span>{freelancer.email}</span>
                                    ) : (
                                        <span className="italic" style={{ color: 'var(--text-muted)' }}>Login to view email</span>
                                    )}
                                </div>
                                {freelancer.phoneNumber && (isOwner || currentUser) && (
                                    <div className="flex items-center text-sm gap-2" style={{ color: 'var(--text-secondary)' }}>
                                        <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                                        {freelancer.phoneNumber}
                                    </div>
                                )}
                                {freelancer.portfolio && (
                                    <div className="flex items-center text-sm gap-2">
                                        <Globe className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                                        <a
                                            href={freelancer.portfolio.startsWith('http') ? freelancer.portfolio : `https://${freelancer.portfolio}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="hover:underline truncate" style={{ color: 'var(--sky)' }}
                                        >
                                            Portfolio
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {freelancer.role === 'freelancer' && (
                            <motion.div className="card p-6" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                                <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-loud)' }}>Stats</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span style={{ color: 'var(--text-secondary)' }}>Jobs Completed</span>
                                        <span className="font-bold" style={{ color: 'var(--text-loud)' }}>{freelancer.jobsCompleted || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span style={{ color: 'var(--text-secondary)' }}>Total Earnings</span>
                                        <span className="font-bold" style={{ color: 'var(--emerald)' }}>${freelancer.totalEarnings || 0}</span>
                                    </div>
                                    {freelancer.rating > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: 'var(--text-secondary)' }}>Rating</span>
                                            <span className="font-bold flex items-center gap-1" style={{ color: 'var(--gold)' }}>
                                                <Star className="w-3.5 h-3.5" style={{ color: 'var(--gold)', fill: 'var(--gold)' }} />
                                                {Number(freelancer.rating).toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={freelancer}
                onProfileUpdated={(updated) => setFreelancer(updated)}
            />
            <HireModal
                isOpen={isHireModalOpen}
                onClose={() => setIsHireModalOpen(false)}
                freelancer={freelancer}
            />
        </div>
    );
};

export default FreelancerProfile;
