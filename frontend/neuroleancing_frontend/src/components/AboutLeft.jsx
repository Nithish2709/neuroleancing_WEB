import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Heart, Globe, Zap } from 'lucide-react';

const VALUES = [
    { icon: Target, label: 'Mission',  color: '#0ea5e9' },
    { icon: Heart,  label: 'Vision',   color: '#8b5cf6' },
    { icon: Globe,  label: 'Reach',    color: '#10b981' },
    { icon: Zap,    label: 'Promise',  color: '#f59e0b' },
];

const AboutLeft = memo(({ activeFrame, totalFrames, frames, onDotClick }) => {
    const navigate = useNavigate();

    return (
        <div className="split-left flex flex-col justify-center px-8 lg:px-12 xl:px-16">
            {/* Brand */}
            <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-lg"
                    style={{ background: 'linear-gradient(135deg,#0284c7,#10b981)', boxShadow: '0 0 16px rgba(14,165,233,0.35)' }}>
                    N
                </div>
                <span className="text-xl font-black tracking-tight text-grad-premium">Neurolance</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
                className="text-3xl xl:text-4xl font-black leading-tight mb-4"
                style={{ color: 'var(--text-loud)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
            >
                About<br />
                <span className="text-grad-sky">Neurolance</span>
            </motion.h1>

            <motion.p
                className="text-sm leading-relaxed mb-8 max-w-xs"
                style={{ color: 'var(--text-secondary)' }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Built to eliminate friction between talented freelancers and the clients who need them.
                No middlemen. No bloat. Just work.
            </motion.p>

            {/* Core values mini-grid */}
            <motion.div
                className="grid grid-cols-2 gap-2 mb-8"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {VALUES.map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex items-center gap-2 p-2.5 rounded-xl"
                        style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                        <Icon size={14} style={{ color }} />
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    </div>
                ))}
            </motion.div>

            {/* CTA */}
            <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')}
                className="btn-primary w-fit px-6 py-2.5 text-sm font-bold rounded-xl mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Join Neurolance →
            </motion.button>

            {/* Dot nav */}
            <motion.div
                className="flex flex-col gap-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {frames.map((frame, i) => (
                    <button
                        key={i}
                        onClick={() => onDotClick(i)}
                        className="flex items-center gap-3"
                        aria-label={`Go to ${frame.label}`}
                    >
                        <motion.div
                            animate={{
                                width: activeFrame === i ? 28 : 8,
                                backgroundColor: activeFrame === i ? frame.color : 'rgba(255,255,255,0.18)',
                            }}
                            transition={{ duration: 0.3 }}
                            style={{ height: 7, borderRadius: 9999 }}
                        />
                        <motion.span
                            animate={{ opacity: activeFrame === i ? 1 : 0, x: activeFrame === i ? 0 : -8 }}
                            transition={{ duration: 0.25 }}
                            className="text-xs font-semibold"
                            style={{ color: frame.color }}
                        >
                            {frame.label}
                        </motion.span>
                    </button>
                ))}
            </motion.div>

            {/* Progress bar */}
            <div className="mt-5 w-36 rounded-full overflow-hidden" style={{ height: 2, background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#0ea5e9,#10b981)' }}
                    animate={{ width: `${((activeFrame + 1) / totalFrames) * 100}%` }}
                    transition={{ duration: 0.4 }}
                />
            </div>
        </div>
    );
});

AboutLeft.displayName = 'AboutLeft';
export default AboutLeft;
