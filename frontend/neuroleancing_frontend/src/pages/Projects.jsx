import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProjectCard from '../components/common/ProjectCard';
import { getProjects } from '../api';
import { toast } from 'react-hot-toast';

const CATEGORIES = ['All', 'Development', 'Design', 'Writing', 'Marketing'];
const BUDGETS = [
    { label: 'Any Budget', min: 0, max: Infinity },
    { label: 'Under $500', min: 0, max: 500 },
    { label: '$500–$2K', min: 500, max: 2000 },
    { label: '$2K–$5K', min: 2000, max: 5000 },
    { label: '$5K+', min: 5000, max: Infinity },
];
const PAGE_SIZE = 12;

const SkeletonCard = ({ i }) => (
    <motion.div className="card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
        <div className="flex justify-between mb-3">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-4 w-20 rounded" />
        </div>
        <div className="skeleton h-5 w-3/4 rounded mb-2" />
        <div className="skeleton h-4 w-full rounded mb-1" />
        <div className="skeleton h-4 w-5/6 rounded mb-4" />
        <div className="flex gap-1.5 mb-4">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="flex justify-between">
            <div className="skeleton h-7 w-20 rounded-lg" />
            <div className="skeleton h-4 w-20 rounded" />
        </div>
    </motion.div>
);

const Projects = () => {
    const [searchParams] = useSearchParams();
    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeBudget, setActiveBudget] = useState(0);
    const [page, setPage] = useState(1);

    // FIX 13 — read URL search param on mount
    useEffect(() => {
        const q = searchParams.get('q') || '';
        if (q) setSearch(q);
    }, [searchParams]);

    useEffect(() => {
        getProjects()
            .then(data => setAllProjects(Array.isArray(data) ? data : []))
            .catch(() => toast.error('Failed to load projects'))
            .finally(() => setLoading(false));
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => { setPage(1); }, [search, activeCategory, activeBudget]);

    const budget = BUDGETS[activeBudget];
    const filtered = allProjects.filter(p => {
        if (p.status !== 'open') return false;
        const matchesSearch = !search ||
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase()) ||
            (p.skillsRequired || []).some(s => s.toLowerCase().includes(search.toLowerCase()));
        const matchesBudget = p.budget >= budget.min && p.budget <= budget.max;
        return matchesSearch && matchesBudget;
    });

    // FIX 22 — client-side pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--text-loud)' }}>Browse Projects</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Find the perfect project that matches your skills.</p>
                </motion.div>

                <motion.div className="card p-4 mb-8 space-y-4"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                        <input type="text" className="input-base py-2.5 pl-10 pr-3 text-sm"
                            placeholder="Search projects by title, keyword, or skill…"
                            value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <SlidersHorizontal className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                            {CATEGORIES.map(cat => (
                                <button key={cat} onClick={() => setActiveCategory(cat)}
                                    className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}>{cat}</button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
                            {BUDGETS.map((b, i) => (
                                <button key={b.label} onClick={() => setActiveBudget(i)}
                                    className={`filter-pill ${activeBudget === i ? 'active' : ''}`}>{b.label}</button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {!loading && (
                    <motion.p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Showing <span className="font-semibold" style={{ color: 'var(--text-loud)' }}>{filtered.length}</span> open project{filtered.length !== 1 ? 's' : ''}
                    </motion.p>
                )}

                {loading ? (
                    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} i={i} />)}
                    </div>
                ) : paginated.length > 0 ? (
                    <>
                        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                            <AnimatePresence>
                                {paginated.map((p, i) => <ProjectCard key={p._id || p.id} project={p} index={i} />)}
                            </AnimatePresence>
                        </div>
                        {/* FIX 22 — Pagination bar */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-8">
                                <motion.button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium btn-secondary disabled:opacity-40"
                                    whileHover={{ scale: page === 1 ? 1 : 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <ChevronLeft className="h-4 w-4" />Prev
                                </motion.button>
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    Page <span style={{ color: 'var(--text-loud)', fontWeight: 700 }}>{page}</span> of {totalPages}
                                </span>
                                <motion.button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium btn-secondary disabled:opacity-40"
                                    whileHover={{ scale: page === totalPages ? 1 : 1.03 }} whileTap={{ scale: 0.97 }}>
                                    Next<ChevronRight className="h-4 w-4" />
                                </motion.button>
                            </div>
                        )}
                    </>
                ) : (
                    <motion.div className="empty-state" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="text-5xl mb-4">🔍</div>
                        <p className="font-bold text-lg" style={{ color: 'var(--text-loud)' }}>No projects found</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Projects;
