import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Sparkles, PlusCircle, Zap, MessageCircle, Shield,
    Users, BarChart2, Layers
} from 'lucide-react';
import FrameCard from './FrameCard';
import {
    WelcomeVisual, PostJobVisual, BiddingVisual, MessagingVisual,
    PaymentsVisual, FreelancerVisual, DashboardVisual, HowItWorksVisual
} from './visuals/index.jsx';

export const HOME_FRAMES = [
    {
        id: 'welcome',
        label: 'Welcome',
        color: '#0ea5e9',
        icon: Sparkles,
        title: 'The Freelance Platform Built for the Future',
        description: 'Post jobs in minutes. Receive proposals from verified professionals. Built with security, speed, and simplicity.',
        visual: <WelcomeVisual />,
    },
    {
        id: 'post-job',
        label: 'Post a Job',
        color: '#0ea5e9',
        icon: PlusCircle,
        title: 'Post a Job in Under 2 Minutes',
        description: 'Describe your project, set your budget, add required skills. Proposals start arriving immediately from qualified freelancers.',
        visual: <PostJobVisual />,
        highlight: 'Average 4+ proposals within hours',
    },
    {
        id: 'bidding',
        label: 'Smart Bidding',
        color: '#10b981',
        icon: Zap,
        title: 'Intelligent Proposal System',
        description: 'Freelancers submit tailored cover letters and bids. Compare proposals side by side. Accept the best fit with one click.',
        visual: <BiddingVisual />,
        highlight: 'One-click hire — no back-and-forth',
    },
    {
        id: 'messaging',
        label: 'Real-time Chat',
        color: '#06b6d4',
        icon: MessageCircle,
        title: 'Collaborate Without Leaving the Platform',
        description: 'Direct messaging between clients and freelancers. Share requirements, stay aligned — all in one place.',
        visual: <MessagingVisual />,
    },
    {
        id: 'payments',
        label: 'Secure Payments',
        color: '#8b5cf6',
        icon: Shield,
        title: 'Payments You Can Trust',
        description: 'Transparent earnings tracking for freelancers. Spend monitoring for clients. Every transaction is logged and secure.',
        visual: <PaymentsVisual />,
    },
    {
        id: 'freelancers',
        label: 'Find Talent',
        color: '#f59e0b',
        icon: Users,
        title: 'Browse Verified Freelancers',
        description: 'Explore profiles with skills, portfolios, ratings, and hourly rates. Filter by expertise. Hire directly from the directory.',
        visual: <FreelancerVisual />,
    },
    {
        id: 'analytics',
        label: 'Dashboard',
        color: '#10b981',
        icon: BarChart2,
        title: 'Your Work, Visualized',
        description: 'Clients track spending and active projects. Freelancers monitor earnings, jobs completed, and monthly growth — all in real time.',
        visual: <DashboardVisual />,
    },
    {
        id: 'how-it-works',
        label: 'How It Works',
        color: '#0ea5e9',
        icon: Layers,
        title: 'Three Steps to Get Started',
        description: "Sign up → Post or Browse → Hire or Apply. That's it. Neurolance handles the rest.",
        visual: <HowItWorksVisual />,
    },
];

const INTERVAL = 3500;

const HomeRight = ({ onFrameChange }) => {
    const [activeFrame, setActiveFrame] = useState(0);
    const timerRef = useRef(null);
    const touchStart = useRef(null);

    const goTo = useCallback((i) => {
        setActiveFrame(i);
        onFrameChange?.(i);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setActiveFrame(prev => {
                const next = (prev + 1) % HOME_FRAMES.length;
                onFrameChange?.(next);
                return next;
            });
        }, INTERVAL);
    }, [onFrameChange]);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setActiveFrame(prev => {
                const next = (prev + 1) % HOME_FRAMES.length;
                onFrameChange?.(next);
                return next;
            });
        }, INTERVAL);
        return () => clearInterval(timerRef.current);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight') goTo((activeFrame + 1) % HOME_FRAMES.length);
            if (e.key === 'ArrowLeft')  goTo((activeFrame - 1 + HOME_FRAMES.length) % HOME_FRAMES.length);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [activeFrame, goTo]);

    // Touch swipe
    const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
    const onTouchEnd   = (e) => {
        if (touchStart.current === null) return;
        const delta = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 50) {
            delta > 0
                ? goTo((activeFrame + 1) % HOME_FRAMES.length)
                : goTo((activeFrame - 1 + HOME_FRAMES.length) % HOME_FRAMES.length);
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
                    <FrameCard frame={HOME_FRAMES[activeFrame]} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default HomeRight;
