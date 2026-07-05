import React, { useState, useContext } from 'react';
import { X, Plus, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { createProject } from '../../api';
import { AuthContext } from '../../context/AuthContext';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({ title: '', description: '', budget: '', deadline: '' });
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    React.useEffect(() => {
        if (isOpen) {
            setFormData({ title: '', description: '', budget: '', deadline: '' });
            setSkills([]);
            setSkillInput('');
            setErrors({});
        }
    }, [isOpen]);

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !skills.includes(s)) { setSkills(prev => [...prev, s]); }
        setSkillInput('');
    };

    const handleSkillKey = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
    };

    const validate = () => {
        const e = {};
        if (!formData.title.trim()) e.title = 'Title is required';
        if (!formData.description.trim()) e.description = 'Description is required';
        if (!formData.budget || Number(formData.budget) <= 0) e.budget = 'Enter a valid budget';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const data = await createProject({
                ...formData,
                budget: Number(formData.budget),
                skillsRequired: skills,
            });
            toast.success('Project posted successfully!');
            onProjectCreated(data);
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = (field) => ({
        background: 'var(--bg-surface)',
        border: `1px solid ${errors[field] ? 'rgba(244,63,94,0.5)' : 'var(--border-default)'}`,
        color: 'var(--text-primary)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '0.875rem',
        width: '100%',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    });

    const onFocus = (e) => { e.target.style.borderColor = 'var(--sky)'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.18)'; };
    const onBlur  = (e) => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div
                        className="absolute inset-0"
                        style={{ background: 'rgba(5,10,14,0.85)', backdropFilter: 'blur(8px)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', borderRadius: '16px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.34,1.56,0.64,1] }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-default)' }}>
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                                    style={{ background: 'var(--grad-sky)', boxShadow: '0 0 12px var(--sky-glow)' }}>
                                    <Briefcase className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold" style={{ color: 'var(--text-loud)' }}>Post a New Job</h3>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fill in the details below</p>
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

                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                    placeholder="e.g. Build a React Dashboard"
                                    style={inputStyle('title')}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                />
                                {errors.title && <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                    Description *
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Describe the project requirements, deliverables, and expectations..."
                                    style={{ ...inputStyle('description'), resize: 'none' }}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                />
                                <p className="text-right text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formData.description.length} chars</p>
                                {errors.description && <p className="text-xs" style={{ color: 'var(--rose)' }}>{errors.description}</p>}
                            </div>

                            {/* Budget + Deadline */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                        Budget ($) *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>$</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.budget}
                                            onChange={e => setFormData(p => ({ ...p, budget: e.target.value }))}
                                            placeholder="500"
                                            style={{ ...inputStyle('budget'), paddingLeft: '24px' }}
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                        />
                                    </div>
                                    {errors.budget && <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{errors.budget}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                        Deadline
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={e => setFormData(p => ({ ...p, deadline: e.target.value }))}
                                        style={{ ...inputStyle('deadline'), colorScheme: 'dark' }}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    />
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                    Skills Required
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={e => setSkillInput(e.target.value)}
                                        onKeyDown={handleSkillKey}
                                        placeholder="e.g. React (press Enter)"
                                        style={{ ...inputStyle(''), flex: 1 }}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    />
                                    <motion.button
                                        type="button"
                                        onClick={addSkill}
                                        className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 btn-primary"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </motion.button>
                                </div>
                                {skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {skills.map(s => (
                                            <span key={s}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium badge-sky">
                                                {s}
                                                <button type="button" onClick={() => setSkills(prev => prev.filter(x => x !== s))}
                                                    className="ml-0.5 opacity-60 hover:opacity-100">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={onClose}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-medium btn-secondary">
                                    Cancel
                                </button>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-60 flex items-center justify-center gap-2"
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.97 }}
                                >
                                    {loading ? (
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : 'Post Project'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateProjectModal;
