import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import FreelancerCard from '../components/common/FreelancerCard';
import { getFreelancers } from '../api';

const SKILL_FILTERS = ['All', 'React', 'Node.js', 'Python', 'Design', 'Writing', 'Marketing'];

const SkeletonCard = ({ i }) => (
    <motion.div
        className="card p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
    >
        <div className="flex items-start gap-3 mb-4">
            <div className="skeleton h-14 w-14 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
            </div>
        </div>
        <div className="skeleton h-3 w-full rounded mb-2" />
        <div className="flex gap-1.5 mb-4">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="flex gap-2">
            <div className="skeleton h-8 flex-1 rounded-xl" />
            <div className="skeleton h-8 flex-1 rounded-xl" />
        </div>
    </motion.div>
);

const Freelancers = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [activeSkill, setActiveSkill] = useState('All');

    useEffect(() => {
        getFreelancers()
            .then(data => setFreelancers(Array.isArray(data) ? data : []))
            .catch(err => {
                setError(err.message);
                toast.error('Failed to load freelancers');
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = freelancers.filter(f => {
        const matchesSearch = !search ||
            f.name?.toLowerCase().includes(search.toLowerCase()) ||
            f.title?.toLowerCase().includes(search.toLowerCase()) ||
            (f.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()));
        const matchesSkill = activeSkill === 'All' ||
            (f.skills || []).some(s => s.toLowerCase().includes(activeSkill.toLowerCase()));
        return matchesSearch && matchesSkill;
    });

    return (
        <div className="min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text-loud)' }}>Find Freelancers</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Connect with expert professionals for your next project.</p>
                </motion.div>

                {/* Search + Filters */}
                <motion.div className="card p-4 mb-8 space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                        <input type="text" className="input-base pl-10" placeholder="Search by name, title, or skill…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <SlidersHorizontal className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                        {SKILL_FILTERS.map(skill => (
                            <button key={skill} onClick={() => setActiveSkill(skill)}
                                className={`filter-pill ${activeSkill === skill ? 'active' : ''}`}>
                                {skill}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Results count */}
                {!loading && !error && (
                    <motion.p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Showing <span className="font-semibold" style={{ color: 'var(--text-loud)' }}>{filtered.length}</span> freelancer{filtered.length !== 1 ? 's' : ''}
                    </motion.p>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} i={i} />)}
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <div className="card px-6 py-4 text-sm font-medium" style={{ color: '#f87171' }}>{error}</div>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence>
                            {filtered.map((f, i) => (
                                <FreelancerCard key={f._id || f.id} freelancer={f} index={i} />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div className="empty-state" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="font-bold text-lg" style={{ color: 'var(--text-loud)' }}>No freelancers found</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Freelancers;
