import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Target, Code2, Layers, Map, Users } from 'lucide-react';
import FrameCard from './FrameCard';
import {
    MissionVisual, TechStackVisual, StackGridVisual,
    RoadmapVisual, JoinVisual
} from './visuals/index.jsx';

export const ABOUT_FRAMES = [
    {
        id: 'mission',
        label: 'Our Mission',
        color: '#0ea5e9',
        icon: Target,
        title: 'Built to Empower Independent Work',
        description: 'Neurolance was created to eliminate the friction between talented freelancers and the clients who need them. No middlemen. No bloat. Just work.',
        visual: <MissionVisual />,
    },
    {
        id: 'built',
        label: 'How We Built It',
        color: '#10b981',
        icon: Code2,
        title: 'Full Stack. Modern. Open.',
        description: 'React 19 frontend, Node.js + Express backend, PostgreSQL with Sequelize ORM, JWT auth, real-time messaging, and a component library built from scratch.',
        visual: <TechStackVisual />,
    },
    {
        id: 'stack',
        label: 'Tech Stack',
        color: '#8b5cf6',
        icon: Layers,
        title: 'Production-Grade Technology',
        description: 'Every tool chosen for performance, developer experience, and long-term maintainability.',
        visual: <StackGridVisual />,
    },
    {
        id: 'roadmap',
        label: 'Roadmap',
        color: '#f59e0b',
        icon: Map,
        title: "What's Coming Next",
        description: 'WebSocket real-time messaging, Stripe payment integration, AI-powered job matching, mobile apps, and team workspaces.',
        visual: <RoadmapVisual />,
    },
    {
        id: 'join',
        label: 'Join Us',
        color: '#10b981',
        icon: Users,
        title: 'Start Your Journey Today',
        description: "Whether you're a client with a vision or a freelancer with a skill — Neurolance is your platform.",
        visual: <JoinVisual />,
    },
];

const INTERVAL = 4000;

const AboutRight = ({ onFrameChange }) => {
    const [activeFrame, setActiveFrame] = useState(0);
    const timerRef = useRef(null);
    const touchStart = useRef(null);

    const goTo = useCallback((i) => {
        setActiveFrame(i);
        onFrameChange?.(i);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setActiveFrame(prev => {
                const next = (prev + 1) % ABOUT_FRAMES.length;
                onFrameChange?.(next);
                return next;
            });
        }, INTERVAL);
    }, [onFrameChange]);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setActiveFrame(prev => {
                const next = (prev + 1) % ABOUT_FRAMES.length;
                onFrameChange?.(next);
                return next;
            });
        }, INTERVAL);
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight') goTo((activeFrame + 1) % ABOUT_FRAMES.length);
            if (e.key === 'ArrowLeft')  goTo((activeFrame - 1 + ABOUT_FRAMES.length) % ABOUT_FRAMES.length);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [activeFrame, goTo]);

    const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
    const onTouchEnd   = (e) => {
        if (touchStart.current === null) return;
        const delta = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 50) {
            delta > 0
                ? goTo((activeFrame + 1) % ABOUT_FRAMES.length)
                : goTo((activeFrame - 1 + ABOUT_FRAMES.length) % ABOUT_FRAMES.length);
        }
        touchStart.current = null;
    };

    return (
        <div
            className="split-right flex items-center px-6 lg:px-10 xl:px-12 overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeFrame}
                    initial={{ opacity: 0, x: 60, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, x: 0,  filter: 'blur(0px)' }}
                    exit={{    opacity: 0, x: -60, filter: 'blur(8px)' }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                >
                    <FrameCard frame={ABOUT_FRAMES[activeFrame]} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AboutRight;
