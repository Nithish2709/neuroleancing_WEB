import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { loginUser } from '../api';
import LoginGate from '../components/layout/LoginGate';

const FEATURES = [
    { icon: Shield, text: 'Secure escrow payments' },
    { icon: Zap,    text: 'Hire in under 24 hours' },
    { icon: Star,   text: 'Verified freelancers' },
];

// FIX 5 — floating label with autofill detection
const FloatingInput = ({ id, label, type, icon: Icon, value, onChange, showToggle, onToggle, showPwd }) => {
    const [isFilled, setIsFilled] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const el = inputRef.current;
        if (!el) return;
        // Detect browser autofill via CSS animation trick
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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [gateOpen, setGateOpen] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await loginUser({ email, password });
            login(data);
            toast.success('Welcome back!');
            setGateOpen(true);
        } catch (err) {
            toast.error(err.message || 'Failed to login');
            setLoading(false);
        }
    };

    const handleGateComplete = useCallback(() => navigate('/dashboard'), [navigate]);

    const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
    const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { ease: [0.22,1,0.36,1], duration: 0.5 } } };

    return (
        <>
            <LoginGate trigger={gateOpen} onComplete={handleGateComplete} />
            <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>

                {/* Left panel */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden"
                    style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)' }}>
                    <div className="absolute inset-0 pointer-events-none">
                        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08), transparent)', filter: 'blur(60px)' }} />
                        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent)', filter: 'blur(50px)' }} />
                    </div>
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-white"
                                style={{ background: 'var(--grad-sky)', boxShadow: '0 0 20px var(--sky-glow)' }}>N</div>
                            {/* FIX 1 */}
                            <span className="text-2xl font-bold text-grad-sky">Neurolance</span>
                        </div>
                        <h2 className="text-4xl font-black mb-4 leading-tight" style={{ color: 'var(--text-loud)' }}>
                            The future of<br />
                            <span className="text-grad-premium">freelancing</span><br />
                            is here.
                        </h2>
                        <p className="mb-10 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            Connect with world-class talent or find your next big project. Fast, secure, and beautifully simple.
                        </p>
                        <div className="space-y-4">
                            {FEATURES.map(({ icon: Icon, text }, i) => (
                                <motion.div key={text} className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                                    <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid var(--border-sky)' }}>
                                        <Icon className="h-4 w-4" style={{ color: 'var(--sky)' }} />
                                    </div>
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right panel */}
                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <motion.div className="w-full max-w-md" variants={stagger} initial="hidden" animate="show">
                        <motion.div variants={item} className="mb-8">
                            <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-loud)' }}>Sign in</h1>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Don't have an account?{' '}
                                <Link to="/register" className="font-semibold" style={{ color: 'var(--sky)' }}>Sign up free</Link>
                            </p>
                        </motion.div>

                        <motion.form variants={stagger} onSubmit={handleSubmit} className="space-y-4">
                            <motion.div variants={item}>
                                <FloatingInput id="email" label="Email address" type="email" icon={Mail}
                                    value={email} onChange={e => setEmail(e.target.value)} />
                            </motion.div>
                            <motion.div variants={item}>
                                <FloatingInput id="password" label="Password" type="password" icon={Lock}
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    showToggle onToggle={() => setShowPwd(s => !s)} showPwd={showPwd} />
                            </motion.div>
                            <motion.div variants={item} className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" style={{ accentColor: 'var(--sky)' }} />
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Remember me</span>
                                </label>
                                <a href="#" className="text-sm font-medium" style={{ color: 'var(--sky)' }}>Forgot password?</a>
                            </motion.div>
                            <motion.div variants={item}>
                                <motion.button type="submit" disabled={loading}
                                    className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.97 }}>
                                    {loading
                                        ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        : <>Sign in <ArrowRight className="h-4 w-4" /></>
                                    }
                                </motion.button>
                            </motion.div>
                        </motion.form>

                        <motion.div variants={item} className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full" style={{ borderTop: '1px solid var(--border-subtle)' }} />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3" style={{ background: 'var(--bg-base)', color: 'var(--text-muted)' }}>Or continue with</span>
                            </div>
                        </motion.div>

                        <motion.div variants={item} className="grid grid-cols-2 gap-3">
                            {['Google', 'GitHub'].map(provider => (
                                <motion.a key={provider} href="#"
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all btn-secondary"
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    {provider}
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Login;
