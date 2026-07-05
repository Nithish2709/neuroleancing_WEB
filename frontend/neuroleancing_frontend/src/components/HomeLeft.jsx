import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomeLeft = memo(({ activeFrame, totalFrames, frames, onDotClick }) => {
    const navigate = useNavigate();

    return (
        <div className="split-left flex flex-col justify-center px-8 lg:px-12 xl:px-16">
            {/* Brand */}
            <motion.div
                className="flex items-center gap-3 mb-10"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-xl"
                    style={{ background: 'linear-gradient(135deg,#0284c7,#10b981)', boxShadow: '0 0 20px rgba(14,165,233,0.4)' }}>
                    N
                </div>
                <span className="text-2xl font-black tracking-tight text-grad-premium">Neurolance</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
                className="text-4xl xl:text-5xl font-black leading-[1.1] mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ color: 'var(--text-loud)' }}
            >
                Hire Smarter.<br />
                Build <span className="text-grad-sky">Faster.</span><br />
                Earn <span className="text-grad-emerald">More.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
                className="text-base leading-relaxed mb-8 max-w-sm"
                style={{ color: 'var(--text-secondary)' }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                Neurolance connects elite freelancers with forward-thinking clients.
                Post jobs, bid on projects, and collaborate — all in one platform.
            </motion.p>

            {/* CTAs */}
            <motion.div
                className="flex flex-col gap-3 mb-10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/register')}
                    className="btn-primary w-fit px-7 py-3 text-sm font-bold rounded-xl"
                >
                    Get Started Free →
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/projects')}
                    className="btn-ghost w-fit px-7 py-3 text-sm rounded-xl"
                >
                    Browse Jobs
                </motion.button>
            </motion.div>

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
                        className="flex items-center gap-3 group"
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
                            animate={{
                                opacity: activeFrame === i ? 1 : 0,
                                x: activeFrame === i ? 0 : -8,
                            }}
                            transition={{ duration: 0.25 }}
                            className="text-xs font-semibold tracking-wide"
                            style={{ color: frame.color }}
                        >
                            {frame.label}
                        </motion.span>
                    </button>
                ))}
            </motion.div>

            {/* Progress bar */}
            <motion.div
                className="mt-6 w-40 rounded-full overflow-hidden"
                style={{ height: 2, background: 'rgba(255,255,255,0.08)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#0ea5e9,#10b981)' }}
                    animate={{ width: `${((activeFrame + 1) / totalFrames) * 100}%` }}
                    transition={{ duration: 0.4 }}
                />
            </motion.div>
        </div>
    );
});

HomeLeft.displayName = 'HomeLeft';
export default HomeLeft;
