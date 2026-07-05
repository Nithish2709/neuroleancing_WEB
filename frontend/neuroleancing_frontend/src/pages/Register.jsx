import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../api';
import LoginGate from '../components/layout/LoginGate';

// FIX 5 — autofill-aware floating label
const FloatingInput = ({ id, label, type, icon: Icon, value, onChange, showToggle, onToggle, showPwd }) => {
    const [isFilled, setIsFilled] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const el = inputRef.current;
        if (!el) return;
        const onAnim = (e) => { if (e.animationName === 'onAutoFillStart') setIsFilled(true); };
        el.addEventListener('animationstart', onAnim);
        return () => el.removeEventListener('animationstart', onAnim);
    }, []);

    const filled = isFilled || value.length > 0;

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ zIndex: 1 }}>
                <Icon className="h-4 w-4" style={{ color: filled ? 'var(--sky)' : 'var(--text-muted)' }} />
            </div>
            <input
                ref={inputRef}
                id={id}
                type={showToggle ? (showPwd ? 'text' : 'password') : type}
                required
                value={value}
                onChange={(e) => { onChange(e); setIsFilled(e.target.value.length > 0); }}
                placeholder=" "
                className="block w-full pl-10 pr-10 pt-5 pb-2 text-sm rounded-xl transition-all"
                style={{
                    background: 'var(--bg-surface)',
                    border: `1px solid ${filled ? 'var(--border-sky)' : 'var(--border-default)'}`,
                    color: 'var(--text-primary)',
                    outline: 'none',
                }}
                onFocus={e => { e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.18)'; e.target.style.borderColor = 'var(--sky)'; }}
                onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.borderColor = filled ? 'var(--border-sky)' : 'var(--border-default)'; }}
            />
            <label htmlFor={id}
                className="absolute left-10 transition-all pointer-events-none"
                style={{
                    top: filled ? '6px' : '50%',
                    transform: filled ? 'translateY(0)' : 'translateY(-50%)',
                    fontSize: filled ? '0.7rem' : '0.875rem',
                    color: filled ? 'var(--sky)' : 'var(--text-muted)',
                }}>
                {label}
            </label>
            {showToggle && (
                <button type="button" onClick={onToggle}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                    style={{ color: 'var(--text-muted)' }}>
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            )}
        </div>
    );
};

const Register = () => {
    const [userType, setUserType] = useState('freelancer');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gateOpen, setGateOpen] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const set = (field) => (e) => setFormData(p => ({ ...p, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
        setLoading(true);
        try {
            const data = await registerUser({ name: formData.name, email: formData.email, password: formData.password, role: userType });
            login(data);
            toast.success('Account created! 🎉');
            setGateOpen(true);
        } catch (err) {
            toast.error(err.message || 'Registration failed');
            setLoading(false);
        }
    };

    const handleGateComplete = useCallback(() => navigate('/complete-profile'), [navigate]);

    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
    const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { ease: [0.22,1,0.36,1], duration: 0.45 } } };

    const ROLES = [
        { value: 'freelancer', label: "I'm a Freelancer", icon: Briefcase, desc: 'Find work & get paid' },
        { value: 'client',     label: "I'm a Client",     icon: Users,    desc: 'Hire top talent' },
    ];

    return (
        <>
            <LoginGate trigger={gateOpen} onComplete={handleGateComplete} />
            <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>

                {/* Left panel */}
                <div className="hidden lg:flex lg:w-2/5 flex-col justify-center px-14 relative overflow-hidden"
                    style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)' }}>
                    <div className="absolute inset-0 pointer-events-none">
                        <div style={{ position: 'absolute', top: '30%', left: '5%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08), transparent)', filter: 'blur(60px)' }} />
                    </div>
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-white"
                                style={{ background: 'var(--grad-sky)', boxShadow: '0 0 20px var(--sky-glow)' }}>N</div>
                            {/* FIX 1 */}
                            <span className="text-2xl font-bold text-grad-sky">Neurolance</span>
                        </div>
                        <h2 className="text-3xl font-black mb-4 leading-tight" style={{ color: 'var(--text-loud)' }}>
                            Join thousands of<br />
                            <span className="text-grad-emerald">professionals</span><br />
                            today.
                        </h2>
                        <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            Whether you're a freelancer looking for work or a client seeking talent — Neurolance has you covered.
                        </p>
                    </motion.div>
                </div>

                {/* Right panel */}
                <div className="flex-1 flex items-center justify-center px-6 py-10">
                    <motion.div className="w-full max-w-md" variants={stagger} initial="hidden" animate="show">
                        <motion.div variants={item} className="mb-6">
                            <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-loud)' }}>Create account</h1>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Already have an account?{' '}
                                <Link to="/login" className="font-semibold" style={{ color: 'var(--sky)' }}>Sign in</Link>
                            </p>
                        </motion.div>

                        {/* Role toggle */}
                        <motion.div variants={item} className="grid grid-cols-2 gap-3 mb-5">
                            {ROLES.map(({ value, label, icon: Icon, desc }) => (
                                <motion.button key={value} type="button" onClick={() => setUserType(value)}
                                    className="relative p-3.5 rounded-xl text-left transition-all"
                                    style={{
                                        background: userType === value ? 'rgba(14,165,233,0.10)' : 'var(--bg-surface)',
                                        border: `1.5px solid ${userType === value ? 'var(--border-sky)' : 'var(--border-default)'}`,
                                        boxShadow: userType === value ? '0 0 16px var(--sky-glow)' : 'none',
                                    }}
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Icon className="h-5 w-5 mb-1.5" style={{ color: userType === value ? 'var(--sky)' : 'var(--text-muted)' }} />
                                    <p className="text-xs font-semibold" style={{ color: userType === value ? 'var(--text-loud)' : 'var(--text-secondary)' }}>{label}</p>
                                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                                    {userType === value && (
                                        <motion.div className="absolute top-2 right-2 h-4 w-4 rounded-full flex items-center justify-center"
                                            style={{ background: 'var(--sky)' }}
                                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>

                        <motion.form variants={stagger} onSubmit={handleSubmit} className="space-y-3.5">
                            <motion.div variants={item}>
                                <FloatingInput id="name" label="Full Name" type="text" icon={User}
                                    value={formData.name} onChange={set('name')} />
                            </motion.div>
                            <motion.div variants={item}>
                                <FloatingInput id="email" label="Email address" type="email" icon={Mail}
                                    value={formData.email} onChange={set('email')} />
                            </motion.div>
                            <motion.div variants={item}>
                                <FloatingInput id="password" label="Password" type="password" icon={Lock}
                                    value={formData.password} onChange={set('password')}
                                    showToggle onToggle={() => setShowPwd(s => !s)} showPwd={showPwd} />
                            </motion.div>
                            <motion.div variants={item}>
                                <FloatingInput id="confirmPassword" label="Confirm Password" type="password" icon={Lock}
                                    value={formData.confirmPassword} onChange={set('confirmPassword')}
                                    showToggle onToggle={() => setShowConfirm(s => !s)} showPwd={showConfirm} />
                            </motion.div>
                            <motion.div variants={item}>
                                <motion.button type="submit" disabled={loading}
                                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                                    whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}>
                                    {loading
                                        ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        : <>Join as {userType === 'freelancer' ? 'Freelancer' : 'Client'} <ArrowRight className="h-4 w-4" /></>
                                    }
                                </motion.button>
                            </motion.div>
                        </motion.form>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Register;
