import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 2,
    duration: Math.random() * 8 + 5,
    delay: Math.random() * 4,
    color: ['#0ea5e9', '#06b6d4', '#8b5cf6', '#10b981'][Math.floor(Math.random() * 4)],
}));

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
            {/* Particles */}
            {PARTICLES.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color, boxShadow: `0 0 8px ${p.color}` }}
                    animate={{ y: [0, -40, 0], x: [0, (Math.random() - 0.5) * 30, 0], opacity: [0.4, 0.8, 0.4], scale: [1, 1.3, 1] }}
                    transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}

            {/* Glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(14,165,233,0.08)' }} />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(6,182,212,0.06)' }} />

            {/* 3D 404 */}
            <motion.div
                className="relative mb-6"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
                <h1
                    className="font-black leading-none select-none"
                    style={{
                        fontSize: 'clamp(6rem, 20vw, 10rem)',
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 30px var(--sky-glow)) drop-shadow(0 0 60px rgba(6,182,212,0.2))',
                    }}
                >
                    404
                </h1>
                {/* Shadow layer */}
                <h1
                    className="font-black leading-none select-none absolute inset-0 -z-10"
                    style={{
                        fontSize: 'clamp(6rem, 20vw, 10rem)',
                        background: 'linear-gradient(135deg, #0284c7, #0f2044)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        transform: 'translate(5px, 7px)',
                        opacity: 0.35,
                    }}
                >
                    404
                </h1>
            </motion.div>

            {/* Card */}
            <motion.div
                className="card px-8 py-7 max-w-sm w-full"
                initial={{ opacity: 0, y: 28, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.34,1.56,0.64,1] }}
            >
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-loud)' }}>Page Not Found</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-3 justify-center">
                    <motion.button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl btn-secondary"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <ArrowLeft className="h-4 w-4" />Go Back
                    </motion.button>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Link to="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white btn-primary">
                            <Home className="h-4 w-4" />Home
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
