import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, X, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { createProject } from '../api';

const CATEGORIES = ['Development', 'Design', 'Marketing', 'Writing', 'Other'];

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: '', category: '', description: '', budget: '', deadline: '' });
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [errors, setErrors] = useState({});

    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !skills.includes(s)) setSkills(p => [...p, s]);
        setSkillInput('');
    };

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Title is required';
        if (!form.description.trim() || form.description.length < 50) e.description = 'Description must be at least 50 characters';
        if (!form.budget || Number(form.budget) <= 0) e.budget = 'Enter a valid budget';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await createProject({ ...form, budget: Number(form.budget), skillsRequired: skills });
            toast.success('Job posted successfully!');
            navigate('/projects/mine');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputCls = (field) =>
        `w-full py-2.5 px-3 text-sm rounded-xl transition-all input-base${errors[field] ? ' border-rose-500/50' : ''}`;

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-black" style={{ color: 'var(--text-loud)' }}>Post a Job</h1>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Fill in the details to attract the best freelancers.
                    </p>
                </motion.div>

                <motion.form onSubmit={handleSubmit} className="card p-6 space-y-5"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                            style={{ color: 'var(--text-secondary)' }}>Job Title *</label>
                        <input type="text" value={form.title} onChange={set('title')}
                            placeholder="e.g. Build a React Dashboard" className={inputCls('title')} />
                        {errors.title && <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{errors.title}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: 'var(--text-secondary)' }}>Category</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button key={cat} type="button"
                                    onClick={() => setForm(p => ({ ...p, category: cat }))}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.category === cat ? 'badge-sky' : 'filter-pill'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                            style={{ color: 'var(--text-secondary)' }}>Description * (min 50 chars)</label>
                        <textarea value={form.description} onChange={set('description')} rows={5}
                            placeholder="Describe the project requirements, deliverables, and expectations..."
                            className={inputCls('description')} style={{ resize: 'none' }} />
                        <div className="flex justify-between mt-1">
                            {errors.description
                                ? <p className="text-xs" style={{ color: 'var(--rose)' }}>{errors.description}</p>
                                : <span />}
                            <p className="text-xs" style={{ color: form.description.length >= 50 ? 'var(--emerald)' : 'var(--text-muted)' }}>
                                {form.description.length} chars
                            </p>
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                            style={{ color: 'var(--text-secondary)' }}>Skills Required</label>
                        <div className="flex gap-2">
                            <input type="text" value={skillInput}
                                onChange={e => setSkillInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                                placeholder="e.g. React (press Enter)"
                                className="input-base flex-1 py-2.5 px-3 text-sm" />
                            <motion.button type="button" onClick={addSkill}
                                className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 btn-primary"
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Plus className="h-4 w-4" />
                            </motion.button>
                        </div>
                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {skills.map(s => (
                                    <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium badge-sky">
                                        {s}
                                        <button type="button" onClick={() => setSkills(p => p.filter(x => x !== s))}
                                            className="opacity-60 hover:opacity-100">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Budget + Deadline */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                                style={{ color: 'var(--text-secondary)' }}>Budget ($) *</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                                    style={{ color: 'var(--text-muted)' }} />
                                <input type="number" min="1" value={form.budget} onChange={set('budget')}
                                    placeholder="500" className={`${inputCls('budget')} pl-9`} />
                            </div>
                            {errors.budget && <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{errors.budget}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                                style={{ color: 'var(--text-secondary)' }}>Deadline</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                                    style={{ color: 'var(--text-muted)' }} />
                                <input type="date" value={form.deadline} onChange={set('deadline')}
                                    className="input-base py-2.5 pl-9 pr-3 text-sm w-full"
                                    style={{ colorScheme: 'dark' }} />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <motion.button type="submit" disabled={loading}
                        className="w-full py-3.5 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-60 flex items-center justify-center gap-2"
                        whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}>
                        {loading
                            ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <><Briefcase className="h-4 w-4" />Post Job</>
                        }
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
};

export default PostJob;
