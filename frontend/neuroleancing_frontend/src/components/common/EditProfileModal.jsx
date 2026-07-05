import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { t } from '../../i18n';
import { updateProfile } from '../../api';

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdated }) => {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [tools, setTools] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [newTool, setNewTool] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [experience, setExperience] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [projectInterests, setProjectInterests] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (isOpen && user) {
            setName(user.name || '');
            setTitle(user.title || '');
            setBio(user.bio || '');
            setSkills(user.skills || []);
            setTools(user.tools || []);
            setPhoneNumber(user.phoneNumber || '');
            setExperience(user.experience || '');
            setPortfolio(user.portfolio || '');
            setCompanyName(user.companyName || '');
            setProjectInterests(user.projectInterests || '');
            setNewSkill('');
            setNewTool('');
        }
    }, [isOpen, user]);

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleAddTool = (e) => {
        e.preventDefault();
        if (newTool.trim() && !tools.includes(newTool.trim())) {
            setTools([...tools, newTool.trim()]);
            setNewTool('');
        }
    };

    // FIX 16 — no token, credentials:include handled by api.js
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await updateProfile({
                name, title, bio, skills, tools,
                phoneNumber, experience, portfolio,
                companyName, projectInterests,
            });
            toast.success('Profile updated successfully');
            onProfileUpdated(data);
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-primary)',
        borderRadius: '10px',
        padding: '8px 12px',
        fontSize: '0.875rem',
        width: '100%',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };
    const onFocus = (e) => { e.target.style.borderColor = 'var(--sky)'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.18)'; };
    const onBlur  = (e) => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };

    const Label = ({ children }) => (
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            {children}
        </label>
    );

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
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', borderRadius: '16px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.96 }}
                        transition={{ duration: 0.22, ease: [0.34,1.56,0.64,1] }}
                    >
                        {/* Header stripe */}
                        <div style={{ background: 'var(--grad-sky)', height: '3px' }} />

                        <div className="px-6 py-5">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-base font-bold" style={{ color: 'var(--text-loud)' }}>Edit Profile</h3>
                                <button onClick={onClose}
                                    className="h-8 w-8 rounded-lg flex items-center justify-center transition-all"
                                    style={{ color: 'var(--text-muted)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label>{t('label.name')}</Label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                                        style={inputStyle} required onFocus={onFocus} onBlur={onBlur} />
                                </div>

                                <div>
                                    <Label>{t('label.professionalTitle')}</Label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Full Stack Developer" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                </div>

                                <div>
                                    <Label>{t('label.bio')}</Label>
                                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                                        style={{ ...inputStyle, resize: 'none' }} onFocus={onFocus} onBlur={onBlur} />
                                </div>

                                <div>
                                    <Label>{t('label.phoneNumber')}</Label>
                                    <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                                        style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                </div>

                                {user?.role === 'freelancer' && (
                                    <>
                                        <div>
                                            <Label>{t('label.experience')}</Label>
                                            <input type="text" value={experience} onChange={e => setExperience(e.target.value)}
                                                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                        </div>
                                        <div>
                                            <Label>{t('label.portfolioUrl')}</Label>
                                            <input type="text" value={portfolio} onChange={e => setPortfolio(e.target.value)}
                                                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                        </div>
                                    </>
                                )}

                                {user?.role === 'client' && (
                                    <>
                                        <div>
                                            <Label>{t('label.companyName')}</Label>
                                            <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                                                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                                        </div>
                                        <div>
                                            <Label>{t('label.projectInterests')}</Label>
                                            <textarea value={projectInterests} onChange={e => setProjectInterests(e.target.value)}
                                                rows={2} style={{ ...inputStyle, resize: 'none' }} onFocus={onFocus} onBlur={onBlur} />
                                        </div>
                                    </>
                                )}

                                {/* Skills */}
                                <div>
                                    <Label>{t('label.skills')}</Label>
                                    <div className="flex gap-2">
                                        <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddSkill(e)}
                                            placeholder="Add a skill" style={{ ...inputStyle, flex: 1 }} onFocus={onFocus} onBlur={onBlur} />
                                        <button type="button" onClick={handleAddSkill}
                                            className="px-3 py-2 rounded-xl text-white btn-primary text-sm">
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {skills.map(skill => (
                                            <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium badge-sky">
                                                {skill}
                                                <button type="button" onClick={() => setSkills(skills.filter(s => s !== skill))}
                                                    className="opacity-60 hover:opacity-100">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Tools */}
                                <div>
                                    <Label>{t('label.toolsKnown')}</Label>
                                    <div className="flex gap-2">
                                        <input type="text" value={newTool} onChange={e => setNewTool(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddTool(e)}
                                            placeholder="Add a tool (e.g. Figma)" style={{ ...inputStyle, flex: 1 }} onFocus={onFocus} onBlur={onBlur} />
                                        <button type="button" onClick={handleAddTool}
                                            className="px-3 py-2 rounded-xl text-white btn-success text-sm">
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {tools.map(tool => (
                                            <span key={tool} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium badge-emerald">
                                                {tool}
                                                <button type="button" onClick={() => setTools(tools.filter(t => t !== tool))}
                                                    className="opacity-60 hover:opacity-100">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <motion.button type="submit" disabled={loading}
                                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                                    whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}>
                                    {loading
                                        ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                                        : 'Save Changes'
                                    }
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;
