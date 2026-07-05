import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const FrameCard = ({ frame }) => (
    <div className="relative w-full">
        {/* Label pill */}
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-sm font-semibold"
            style={{
                background: `${frame.color}18`,
                color: frame.color,
                border: `1px solid ${frame.color}30`,
            }}
        >
            <frame.icon size={13} />
            {frame.label}
        </motion.div>

        {/* Title */}
        <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="text-2xl xl:text-3xl font-black leading-tight mb-3"
            style={{ color: 'var(--text-loud)' }}
        >
            {frame.title}
        </motion.h2>

        {/* Description */}
        {frame.description && (
            <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base leading-relaxed mb-6 max-w-lg"
                style={{ color: 'var(--text-secondary)' }}
            >
                {frame.description}
            </motion.p>
        )}

        {/* Visual mockup */}
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.24, duration: 0.45 }}
            className="rounded-2xl overflow-hidden"
            style={{
                background: 'rgba(10,21,32,0.75)',
                border: `1px solid ${frame.color}22`,
                boxShadow: `0 20px 56px ${frame.color}10`,
                backdropFilter: 'blur(10px)',
            }}
        >
            {frame.visual}
        </motion.div>

        {/* Highlight chip */}
        {frame.highlight && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42 }}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: frame.color }}
            >
                <CheckCircle size={14} />
                {frame.highlight}
            </motion.div>
        )}
    </div>
);

export default FrameCard;
