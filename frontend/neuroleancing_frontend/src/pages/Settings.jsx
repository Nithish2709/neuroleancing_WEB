import React, { useState, useContext } from 'react';
import { User, Bell, Lock, Palette, Save, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { toast } from 'react-hot-toast';
import { updateProfile } from '../api';

const Section = ({ title, icon: Icon, children, delay = 0 }) => (
    <motion.div className="card overflow-hidden"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
        <div className="px-6 py-4 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid var(--border-sky)' }}>
                <Icon className="h-4 w-4" style={{ color: 'var(--sky)' }} />
            </div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-loud)' }}>{title}</h2>
        </div>
        <div className="px-6 py-5">{children}</div>
    </motion.div>
);

const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
            {label}
        </label>
        {children}
    </div>
);

const Toggle = ({ checked, onChange }) => (
    <motion.button onClick={onChange}
        className="relative inline-flex h-6 w-11 items-center rounded-full flex-shrink-0 transition-all"
        style={{
            background: checked ? 'var(--grad-sky)' : 'rgba(255,255,255,0.1)',
            border: `1px solid ${checked ? 'var(--border-sky)' : 'var(--border-default)'}`,
            boxShadow: checked ? '0 0 10px var(--sky-glow)' : 'none',
        }}
        role="switch" aria-checked={checked} whileTap={{ scale: 0.95 }}>
        <motion.span className="inline-block h-4 w-4 rounded-full bg-white shadow"
            animate={{ x: checked ? 24 : 4 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </motion.button>
);

const Settings = () => {
    const { user: authUser, updateUser } = useContext(AuthContext);
    const { dark, toggle } = useDarkMode();

    const [profile, setProfile] = useState({
        name:  authUser?.name  || '',
        email: authUser?.email || '',
        title: authUser?.title || '',
        bio:   authUser?.bio   || '',
    });
    const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' });
    const [showPwd, setShowPwd] = useState({ current: false, newPwd: false, confirm: false });
    const [notifications, setNotifications] = useState({ emailMessages: true, emailProposals: true, emailHires: true, browserPush: false });
    const [savingProfile,  setSavingProfile]  = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    // FIX 29 — full replacement updateUser, not shallow merge
    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const data = await updateProfile(profile);
            updateUser(data); // full replacement
            toast.success('Profile updated successfully!');
            if (data.profileComplete) toast.success('Profile is now complete! 🎉');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        if (passwords.newPwd !== passwords.confirm) { toast.error('New passwords do not match'); return; }
        if (passwords.newPwd.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setSavingPassword(true);
        try {
            await updateProfile({ password: passwords.newPwd });
            setPasswords({ current: '', newPwd: '', confirm: '' });
            toast.success('Password updated successfully!');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingPassword(false);
        }
    };

    const inputStyle = {
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-primary)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '0.875rem',
        width: '100%',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };
    const onFocus = (e) => { e.target.style.borderColor = 'var(--sky)'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.18)'; };
    const onBlur  = (e) => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };

    return (
        <div className="py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-black" style={{ color: 'var(--text-loud)' }}>Settings</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your account preferences and profile</p>
                </motion.div>

                <Section title="Profile Information" icon={User} delay={0.1}>
                    <form onSubmit={handleProfileSave} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Full Name">
                                <input type="text" value={profile.name} required style={inputStyle}
                                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                    onFocus={onFocus} onBlur={onBlur} />
                            </Field>
                            <Field label="Email Address">
                                <input type="email" value={profile.email} required style={inputStyle}
                                    onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                                    onFocus={onFocus} onBlur={onBlur} />
                            </Field>
                        </div>
                        <Field label="Professional Title">
                            <input type="text" value={profile.title} placeholder="e.g. Full Stack Developer"
                                style={inputStyle} onChange={e => setProfile(p => ({ ...p, title: e.target.value }))}
                                onFocus={onFocus} onBlur={onBlur} />
                        </Field>
                        <Field label="Bio">
                            <textarea value={profile.bio} rows={3} placeholder="Tell clients about yourself..."
                                style={{ ...inputStyle, resize: 'none' }}
                                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                                onFocus={onFocus} onBlur={onBlur} />
                        </Field>
                        <div className="flex justify-end">
                            <motion.button type="submit" disabled={savingProfile}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white btn-primary disabled:opacity-60"
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                {savingProfile
                                    ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                                    : <><Save className="h-4 w-4" />Save Profile</>
                                }
                            </motion.button>
                        </div>
                    </form>
                </Section>

                <Section title="Change Password" icon={Lock} delay={0.2}>
                    <form onSubmit={handlePasswordSave} className="space-y-4">
                        {[
                            { key: 'current', label: 'Current Password' },
                            { key: 'newPwd',  label: 'New Password' },
                            { key: 'confirm', label: 'Confirm New Password' },
                        ].map(({ key, label }) => (
                            <Field key={key} label={label}>
                                <div className="relative">
                                    <input type={showPwd[key] ? 'text' : 'password'} value={passwords[key]}
                                        onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                                        style={{ ...inputStyle, paddingRight: '40px' }} placeholder="••••••••"
                                        onFocus={onFocus} onBlur={onBlur} />
                                    <button type="button" onClick={() => setShowPwd(s => ({ ...s, [key]: !s[key] }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                                        style={{ color: 'var(--text-muted)' }}>
                                        {showPwd[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </Field>
                        ))}
                        <div className="flex justify-end">
                            <motion.button type="submit" disabled={savingPassword}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white btn-primary disabled:opacity-60"
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                {savingPassword
                                    ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Updating…</>
                                    : <><Lock className="h-4 w-4" />Update Password</>
                                }
                            </motion.button>
                        </div>
                    </form>
                </Section>

                <Section title="Notifications" icon={Bell} delay={0.3}>
                    <div className="space-y-4">
                        {[
                            { key: 'emailMessages',  label: 'New messages',         desc: 'Get notified when you receive a message' },
                            { key: 'emailProposals', label: 'Proposal updates',      desc: 'Get notified when a proposal is submitted or accepted' },
                            { key: 'emailHires',     label: 'Hire notifications',    desc: 'Get notified when you are hired for a project' },
                            { key: 'browserPush',    label: 'Browser notifications', desc: 'Receive push notifications in your browser' },
                        ].map(({ key, label, desc }) => (
                            <div key={key} className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-loud)' }}>{label}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                                </div>
                                <Toggle checked={notifications[key]} onChange={() => setNotifications(n => ({ ...n, [key]: !n[key] }))} />
                            </div>
                        ))}
                    </div>
                </Section>

                {/* FIX 6 — appearance toggle actually works now */}
                <Section title="Appearance" icon={Palette} delay={0.4}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-loud)' }}>{dark ? 'Dark Mode' : 'Light Mode'}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Switch between light and dark theme</p>
                        </div>
                        <motion.button onClick={toggle}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all btn-secondary"
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            {dark
                                ? <><Sun className="h-4 w-4 text-yellow-400" />Light Mode</>
                                : <><Moon className="h-4 w-4" style={{ color: 'var(--sky)' }} />Dark Mode</>
                            }
                        </motion.button>
                    </div>
                </Section>

                <motion.div className="rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)' }}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
                    <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(244,63,94,0.15)' }}>
                        <h2 className="text-sm font-bold" style={{ color: 'var(--rose)' }}>Danger Zone</h2>
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium" style={{ color: '#fca5a5' }}>Delete Account</p>
                            <p className="text-xs mt-0.5" style={{ color: 'rgba(244,63,94,0.6)' }}>
                                Permanently delete your account and all data. This cannot be undone.
                            </p>
                        </div>
                        <motion.button onClick={() => toast.error('Please contact support to delete your account.')}
                            className="px-4 py-2 text-sm font-bold rounded-xl btn-danger flex-shrink-0"
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            Delete Account
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
