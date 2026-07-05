import React from 'react';
import { DollarSign, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const STATUS = {
    open:      { cls: 'badge-blue',   label: 'Open' },
    assigned:  { cls: 'badge-orange', label: 'In Progress' },
    completed: { cls: 'badge-green',  label: 'Completed' },
};

const ProjectCard = ({ project, index = 0 }) => {
    const id = project.id || project._id;
    const status = project.status || 'open';
    const { cls, label } = STATUS[status] || STATUS.open;
    const postedAt = project.createdAt ? new Date(project.createdAt).toLocaleDateString() : null;

    return (
        <motion.div
            className="card flex flex-col"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: [0.34,1.56,0.64,1] }}
        >
            <div className="p-5 flex-1">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>
                    {postedAt && (
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                            <Clock className="h-3.5 w-3.5" />{postedAt}
                        </span>
                    )}
                </div>

                <Link to={`/projects/${id}`}>
                    <h3 className="text-base font-bold leading-snug mb-2 transition-colors line-clamp-2 hover:text-sky-400"
                        style={{ color: 'var(--text-loud)' }}>
                        {project.title}
                    </h3>
                </Link>

                <p className="text-sm line-clamp-2 mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {project.description}
                </p>

                {(project.skillsRequired || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.skillsRequired.slice(0, 4).map(skill => (
                            <span key={skill} className="px-2 py-0.5 text-xs font-medium badge-blue">{skill}</span>
                        ))}
                        {project.skillsRequired.length > 4 && (
                            <span className="px-2 py-0.5 text-xs font-medium badge-neutral">+{project.skillsRequired.length - 4}</span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg badge-emerald">
                        <DollarSign className="h-3.5 w-3.5" />{project.budget}
                    </div>
                    {project.deadline && (
                        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <Calendar className="h-3.5 w-3.5" />{project.deadline}
                        </div>
                    )}
                </div>
            </div>

            <div className="px-5 py-3 flex items-center justify-between rounded-b-2xl"
                style={{ borderTop: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.15)' }}>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <User className="h-3.5 w-3.5" />{project.client?.name || 'Client'}
                </div>
                <motion.div whileHover={{ x: 3 }}>
                    <Link to={`/projects/${id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
                        style={{ color: 'var(--sky)' }}>
                        Apply Now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
