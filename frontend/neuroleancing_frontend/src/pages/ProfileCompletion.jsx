import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Circle, User, Briefcase, BookOpen, Globe, Image, ChevronRight, ChevronLeft, Plus, X } from 'lucide-react';
import { updateProfile } from '../api';

const FREELANCER_SECTIONS = [
    { id: 'personal',   label: 'Personal Info',  icon: User,      weight: 25 },
    { id: 'skills',     label: 'Skills',         icon: Briefcase, weight: 25 },
    { id: 'experience', label: 'Experience',     icon: BookOpen,  weight: 25 },
    { id: 'portfolio',  label: 'Portfolio',      icon: Globe,     weight: 15 },
    { id: 'photo',      label: 'Profile Photo',  icon: Image,     weight: 10 },
];

const CLIENT_SECTIONS = [
    { id: 'personal',  label: 'Personal Info',   icon: User,      weight: 40 },
    { id: 'company',   label: 'Company Details', icon: Briefcase, weight: 40 },
    { id: 'photo',     label: 'Profile Photo',   icon: Image,     weight: 20 },
];

function calcProgress(role, form) {
    const sections = role === 'freelancer' ? FREELANCER_SECTIONS : CLIENT_SECTIONS;
    let earned = 0;
    sections.forEach(({ id, weight }) => {
        if (isSectionComplete(id, role, form)) earned += weight;
    });
    return earned;
}

function isSectionComplete(id, role, form) {
    switch (id) {
        case 'personal':
            return !!(form.name?.trim() && form.bio?.trim() && form.phoneNumber?.trim() && form.location?.trim() &&
                (role === 'freelancer' ? form.title?.trim() : true));
        case 'skills':     return form.skills?.length >= 1;
        case 'experience': return !!(form.experience?.trim());
        case 'portfolio':  return !!(form.portfolio?.trim());
        case 'company':    return !!(form.companyName?.trim() && form.projectInterests?.trim());
        case 'photo':      return !!(form.profileImage?.trim());
        default:           return false;
    }
}

const inputCls = () => 'mt-1 block w-full rounded-xl py-2.5 px-3 text-sm focus:outline-none transition-all input-base';

const Field = ({ label, children, error, hint }) => (
    <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</label>
        {hint && <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
        {children}
        {error && <p className="mt-1 text-xs" style={{ color: 'var(--rose)' }}>{error}</p>}
    </div>
);

const TagInput = ({ tags, onAdd, onRemove, placeholder, colorClass }) => {
    const [val, setVal] = useState('');
    const add = (e) => {
        e.preventDefault();
        const trimmed = val.trim();
        if (trimmed && !tags.includes(trimmed)) { onAdd(trimmed); setVal(''); }
    };
    return (
        <div>
            <div className="flex gap-2 mt-1">
                <input
                    type="text" value={val} onChange={e => setVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && add(e)}
                    placeholder={placeholder}
                    className="input-base flex-1 py-2.5 px-3 text-sm"
                />
                <button type="button" onClick={add}
                    className="px-3 py-2 rounded-xl text-white btn-primary text-sm font-semibold">
                    <Plus className="h-4 w-4" />
                </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                {tags.map(t => (
                    <span key={t} className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                        {t}
                        <button type="button" onClick={() => onRemove(t)}><X className="h-3 w-3" /></button>
                    </span>
                ))}
            </div>
        </div>
    );
};

const ProfileCompletion = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const role = user?.role || 'freelancer';
    const sections = role === 'freelancer' ? FREELANCER_SECTIONS : CLIENT_SECTIONS;

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        title: '', bio: '', phoneNumber: '', location: '',
        skills: [], tools: [],
        experience: '', portfolio: '',
        companyName: '', projectInterests: '',
        profileImage: '',
    });

    const progress = calcProgress(role, form);
    const currentSection = sections[step];

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = await updateProfile(form);
            updateUser(data);
            if (data.profileComplete) {
                toast.success('🎉 Profile completed successfully!');
                navigate('/dashboard');
            } else {
                toast.success('Progress saved!');
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderSection = () => {
        switch (currentSection.id) {
            case 'personal':
                return (
                    <div className="space-y-4">
                        <Field label="Full Name *" error={!form.name.trim() && 'Required'}>
                            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                                className={inputCls()} placeholder="John Doe" />
                        </Field>
                        {role === 'freelancer' && (
                            <Field label="Professional Title *" error={!form.title.trim() && 'Required'}>
                                <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                                    className={inputCls()} placeholder="e.g. Full Stack Developer" />
                            </Field>
                        )}
                        <Field label="Bio *" error={!form.bio.trim() && 'Required'}>
                            <textarea value={form.bio} onChange={e => set('bio', e.target.value)}
                                rows={4} className={inputCls()} placeholder="Tell clients about yourself..." />
                        </Field>
                        <Field label="Phone Number *" error={!form.phoneNumber.trim() && 'Required'}>
                            <input type="text" value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)}
                                className={inputCls()} placeholder="+1 (555) 000-0000" />
                        </Field>
                        <Field label="Location *" error={!form.location.trim() && 'Required'}>
                            <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
                                className={inputCls()} placeholder="City, Country" />
                        </Field>
                    </div>
                );

            case 'skills':
                return (
                    <div className="space-y-5">
                        <Field label="Skills * (at least 1)" error={form.skills.length === 0 && 'Add at least one skill'}>
                            <TagInput tags={form.skills} onAdd={v => set('skills', [...form.skills, v])}
                                onRemove={v => set('skills', form.skills.filter(s => s !== v))}
                                placeholder="e.g. React, Node.js" colorClass="badge-sky" />
                        </Field>
                        <Field label="Tools (optional)">
                            <TagInput tags={form.tools} onAdd={v => set('tools', [...form.tools, v])}
                                onRemove={v => set('tools', form.tools.filter(t => t !== v))}
                                placeholder="e.g. Figma, VS Code" colorClass="badge-emerald" />
                        </Field>
                        <Field label="Hourly Rate (optional)">
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-3 flex items-center text-sm" style={{ color: 'var(--text-muted)' }}>$</span>
                                <input type="number" value={form.hourlyRate || ''} onChange={e => set('hourlyRate', e.target.value)}
                                    className={inputCls() + ' pl-7'} placeholder="50" min="0" />
                            </div>
                        </Field>
                    </div>
                );

            case 'experience':
                return (
                    <div className="space-y-4">
                        <Field label="Work Experience *" error={!form.experience.trim() && 'Required'}>
                            <textarea value={form.experience} onChange={e => set('experience', e.target.value)}
                                rows={5} className={inputCls()}
                                placeholder="Describe your work experience, roles, companies, and duration..." />
                        </Field>
                    </div>
                );

            case 'portfolio':
                return (
                    <div className="space-y-4">
                        <Field label="Portfolio URL" hint="Link to your portfolio website or GitHub">
                            <input type="url" value={form.portfolio} onChange={e => set('portfolio', e.target.value)}
                                className={inputCls()} placeholder="https://yourportfolio.com" />
                        </Field>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>This section is optional but recommended (+15% completion)</p>
                    </div>
                );

            case 'company':
                return (
                    <div className="space-y-4">
                        <Field label="Company Name *" error={!form.companyName.trim() && 'Required'}>
                            <input type="text" value={form.companyName} onChange={e => set('companyName', e.target.value)}
                                className={inputCls()} placeholder="ACME Inc." />
                        </Field>
                        <Field label="Project Interests *" error={!form.projectInterests.trim() && 'Required'}>
                            <textarea value={form.projectInterests} onChange={e => set('projectInterests', e.target.value)}
                                rows={4} className={inputCls()} placeholder="What kind of projects are you looking to post?" />
                        </Field>
                    </div>
                );

            case 'photo':
                return (
                    <div className="space-y-4">
                        <Field label="Profile Image URL" hint="Paste a direct image URL (e.g. from Imgur or Cloudinary)">
                            <input type="url" value={form.profileImage} onChange={e => set('profileImage', e.target.value)}
                                className={inputCls()} placeholder="https://example.com/photo.jpg" />
                        </Field>
                        {form.profileImage && (
                            <div className="flex justify-center">
                                <img src={form.profileImage} alt="Preview"
                                    className="h-24 w-24 rounded-full object-cover"
                                    style={{ boxShadow: '0 0 0 4px var(--border-sky)' }}
                                    onError={e => { e.target.style.display = 'none'; }} />
                            </div>
                        )}
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>This section is optional but recommended (+10% completion)</p>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="min-h-screen py-10 px-4" style={{ background: 'var(--bg-base)' }}>
            <div className="max-w-2xl mx-auto">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black" style={{ color: 'var(--text-loud)' }}>Complete Your Profile</h1>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>You need 100% to access the dashboard</p>
                </div>

                <div className="card p-5 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-loud)' }}>Profile Completion</span>
                        <span className="text-sm font-bold" style={{ color: progress === 100 ? 'var(--emerald)' : 'var(--sky)' }}>{progress}%</span>
                    </div>
                    <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div
                            className="h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%`, background: progress === 100 ? 'var(--grad-emerald)' : 'var(--grad-sky)' }}
                        />
                    </div>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {sections.map((s, i) => {
                            const done = isSectionComplete(s.id, role, form);
                            return (
                                <button key={s.id} onClick={() => setStep(i)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left"
                                    style={{
                                        background: i === step ? 'rgba(14,165,233,0.12)' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${i === step ? 'var(--border-sky)' : 'var(--border-subtle)'}`,
                                        color: i === step ? 'var(--text-loud)' : 'var(--text-secondary)',
                                    }}>
                                    {done
                                        ? <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--emerald)' }} />
                                        : <Circle className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />}
                                    <span>{s.label}</span>
                                    <span className="ml-auto" style={{ color: 'var(--text-muted)' }}>{s.weight}%</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid var(--border-sky)' }}>
                            <currentSection.icon className="h-5 w-5" style={{ color: 'var(--sky)' }} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold" style={{ color: 'var(--text-loud)' }}>{currentSection.label}</h2>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Step {step + 1} of {sections.length}</p>
                        </div>
                        {isSectionComplete(currentSection.id, role, form) && (
                            <span className="ml-auto flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--emerald)' }}>
                                <CheckCircle className="h-4 w-4" /> Complete
                            </span>
                        )}
                    </div>

                    {renderSection()}

                    <div className="mt-8 flex justify-between items-center">
                        <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
                            className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg btn-secondary disabled:opacity-40 disabled:cursor-not-allowed">
                            <ChevronLeft className="h-4 w-4" /> Back
                        </button>

                        <div className="flex gap-3">
                            <button onClick={handleSave} disabled={loading}
                                className="px-4 py-2 text-sm rounded-lg btn-secondary disabled:opacity-50">
                                {loading ? 'Saving...' : 'Save Progress'}
                            </button>

                            {step < sections.length - 1 ? (
                                <button onClick={() => setStep(s => s + 1)}
                                    className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white rounded-lg btn-primary">
                                    Next <ChevronRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <button onClick={handleSave} disabled={loading || progress < 100}
                                    className="px-5 py-2 text-sm font-bold text-white rounded-lg btn-success disabled:opacity-50 disabled:cursor-not-allowed">
                                    {progress < 100 ? `${100 - progress}% remaining` : '🎉 Complete Profile'}
                                </button>
                            )}
                        </div>
                    </div>

                    {progress < 100 && (
                        <p className="mt-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                            Complete all required sections to unlock the dashboard
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletion;
