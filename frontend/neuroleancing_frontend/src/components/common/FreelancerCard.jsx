import React from 'react';
import { Star, MapPin, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FreelancerCard = ({ freelancer, index = 0 }) => {
    const id = freelancer.id || freelancer._id;

    return (
        <motion.div
            className="card p-5 flex flex-col"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: [0.34,1.56,0.64,1] }}
        >
            <div className="flex items-start gap-3 mb-4">
                <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
                    {freelancer.profileImage ? (
                        <img
                            className="h-14 w-14 rounded-2xl object-cover"
                            style={{ boxShadow: '0 0 14px var(--sky-glow), 0 0 0 2px rgba(14,165,233,0.2)' }}
                            src={freelancer.profileImage}
                            alt={freelancer.name}
                        />
                    ) : (
                        <div
                            className="h-14 w-14 rounded-2xl flex items-center justify-center"
                            style={{ background: 'var(--grad-sky)', boxShadow: '0 0 14px var(--sky-glow)' }}
                        >
                            <span className="text-xl font-bold text-white">{freelancer.name?.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </motion.div>

                <div className="min-w-0 flex-1">
                    <Link to={`/freelancers/${id}`}>
                        <h3 className="text-sm font-bold truncate transition-colors hover:text-sky-400"
                            style={{ color: 'var(--text-loud)' }}>
                            {freelancer.name}
                        </h3>
                    </Link>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {freelancer.title || 'Freelancer'}
                    </p>
                    {freelancer.location && (
                        <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <MapPin className="h-3 w-3 flex-shrink-0" />{freelancer.location}
                        </div>
                    )}
                </div>

                {freelancer.hourlyRate && (
                    <div className="flex-shrink-0 text-right">
                        <div className="flex items-center gap-0.5 text-sm font-bold px-2 py-1 rounded-lg badge-emerald">
                            <DollarSign className="h-3 w-3" />{freelancer.hourlyRate}
                        </div>
                        <p className="text-[10px] mt-0.5 text-center" style={{ color: 'var(--text-muted)' }}>/hr</p>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1.5 mb-3">
                {freelancer.rating > 0 ? (
                    <>
                        <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => (
                                <Star key={i} className="h-3.5 w-3.5"
                                    style={{ color: i <= Math.round(freelancer.rating) ? '#fbbf24' : 'rgba(255,255,255,0.12)', fill: i <= Math.round(freelancer.rating) ? '#fbbf24' : 'rgba(255,255,255,0.12)' }} />
                            ))}
                        </div>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-loud)' }}>{Number(freelancer.rating).toFixed(1)}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({freelancer.jobsCompleted || 0} jobs)</span>
                    </>
                ) : (
                    <span className="text-xs px-2 py-0.5 badge-neutral">New freelancer</span>
                )}
            </div>

            {(freelancer.skills || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {freelancer.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 text-xs font-medium badge-blue">{skill}</span>
                    ))}
                    {freelancer.skills.length > 3 && (
                        <span className="px-2 py-0.5 text-xs font-medium badge-neutral">+{freelancer.skills.length - 3}</span>
                    )}
                </div>
            )}

            <div className="mt-auto flex gap-2">
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to={`/freelancers/${id}`}
                        className="block text-center py-2 px-3 rounded-xl text-xs font-semibold transition-all btn-secondary">
                        View Profile
                    </Link>
                </motion.div>
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to={`/freelancers/${id}`}
                        className="block text-center py-2 px-3 rounded-xl text-xs font-bold text-white btn-primary">
                        Hire Now
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default FreelancerCard;
