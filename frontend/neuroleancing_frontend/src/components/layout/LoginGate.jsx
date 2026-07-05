import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ease = [0.76, 0, 0.24, 1];

const gridLines = {
    position: 'absolute', inset: 0, opacity: 0.05,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(14,165,233,0.5) 39px, rgba(14,165,233,0.5) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(14,165,233,0.5) 39px, rgba(14,165,233,0.5) 40px)',
};

const LoginGate = ({ trigger, onComplete }) => {
    useEffect(() => {
        if (trigger) {
            const t = setTimeout(onComplete, 1650);
            return () => clearTimeout(t);
        }
    }, [trigger, onComplete]);

    return (
        <AnimatePresence>
            {trigger && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}>
                    {/* Left panel */}
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: '-55%' }}
                        transition={{ duration: 0.7, delay: 0.3, ease }}
                        style={{
                            position: 'absolute', top: 0, left: 0,
                            width: '50%', height: '100%',
                            background: 'linear-gradient(180deg, #0a1628, #050a0e)',
                            borderRight: '2px solid rgba(14,165,233,0.5)',
                            zIndex: 2,
                        }}
                    >
                        <div style={gridLines} />
                    </motion.div>

                    {/* Right panel */}
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: '55%' }}
                        transition={{ duration: 0.7, delay: 0.3, ease }}
                        style={{
                            position: 'absolute', top: 0, right: 0,
                            width: '50%', height: '100%',
                            background: 'linear-gradient(180deg, #0a1628, #050a0e)',
                            borderLeft: '2px solid rgba(14,165,233,0.5)',
                            zIndex: 2,
                        }}
                    >
                        <div style={gridLines} />
                    </motion.div>

                    {/* Center energy burst */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 4, opacity: [0, 0.6, 0] }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: 200, height: 200, borderRadius: '50%',
                            background: 'radial-gradient(circle, #0ea5e9, #06b6d4, transparent)',
                            transform: 'translate(-50%,-50%)',
                            zIndex: 3,
                        }}
                    />

                    {/* N monogram */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 1] }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%,-50%)',
                            zIndex: 4, textAlign: 'center',
                        }}
                    >
                        <div style={{
                            width: 72, height: 72, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 40px rgba(14,165,233,0.8), 0 0 80px rgba(6,182,212,0.4)',
                            fontSize: '2rem', fontWeight: 900, color: 'white',
                        }}>N</div>
                    </motion.div>

                    {/* Flash */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0, 0.9, 0] }}
                        transition={{ duration: 0.6, delay: 0.9, times: [0, 0.3, 0.6, 1] }}
                        style={{
                            position: 'absolute', inset: 0, zIndex: 5,
                            background: 'linear-gradient(135deg, #0284c7, #06b6d4)',
                        }}
                    />
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginGate;
