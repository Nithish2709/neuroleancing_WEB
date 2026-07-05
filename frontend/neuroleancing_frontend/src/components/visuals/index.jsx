import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Shield, Zap, Rocket } from 'lucide-react';

const stat = (value, label, color, delay) => (
    <motion.div key={label}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="flex flex-col items-center p-4 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="text-2xl font-black" style={{ color }}>{value}</span>
        <span className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </motion.div>
);

export const WelcomeVisual = () => (
    <div className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
            {stat('24/7', 'Uptime', '#0ea5e9', 0.1)}
            {stat('SSL', 'Secure', '#10b981', 0.18)}
            {stat('Free', 'To start', '#8b5cf6', 0.26)}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <CheckCircle size={16} style={{ color: '#10b981' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>No credit card required to get started</span>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
            <Zap size={16} style={{ color: '#0ea5e9' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Hire or get hired in under 24 hours</span>
        </motion.div>
    </div>
);

const AnimatedField = ({ label, value, delay, color }) => (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
        className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}25` }}>
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-loud)' }}>{value}</p>
    </motion.div>
);

export const PostJobVisual = () => (
    <div className="p-6 space-y-3">
        <AnimatedField label="Job Title" value="Senior React Developer" delay={0.1} color="#0ea5e9" />
        <AnimatedField label="Budget" value="$2,500 fixed price" delay={0.18} color="#10b981" />
        <div className="flex gap-2 flex-wrap">
            {['React', 'TypeScript', 'Tailwind', 'Node.js'].map((s, i) => (
                <motion.span key={s} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.28 + i * 0.07 }}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.25)' }}>
                    {s}
                </motion.span>
            ))}
        </div>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="w-full py-2.5 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)', boxShadow: '0 4px 16px rgba(14,165,233,0.3)' }}>
            Post Job →
        </motion.button>
    </div>
);

export const BiddingVisual = () => (
    <div className="p-6 space-y-3">
        {[
            { name: 'Alex M.', bid: '$2,200', rating: '4.9★', tag: 'Top Rated', color: '#10b981' },
            { name: 'Sara K.', bid: '$2,400', rating: '4.8★', tag: 'Rising',    color: '#0ea5e9' },
            { name: 'Dev R.',  bid: '$2,100', rating: '5.0★', tag: 'Expert',    color: '#8b5cf6' },
        ].map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: p.color }}>
                        {p.name[0]}
                    </div>
                    <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-loud)' }}>{p.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.rating}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: p.color }}>{p.bid}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${p.color}18`, color: p.color }}>{p.tag}</span>
                </div>
            </motion.div>
        ))}
    </div>
);

export const MessagingVisual = () => (
    <div className="p-6 space-y-3">
        {[
            { from: 'Client', msg: 'Can you start Monday?', mine: false, delay: 0.1 },
            { from: 'You',    msg: 'Absolutely! I\'ll have the first draft ready by Wednesday.', mine: true, delay: 0.22 },
            { from: 'Client', msg: 'Perfect. Budget approved ✓', mine: false, delay: 0.34 },
        ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: m.delay }}
                className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm"
                    style={m.mine
                        ? { background: 'linear-gradient(135deg,#0284c7,#0ea5e9)', color: 'white', borderBottomRightRadius: 4 }
                        : { background: 'rgba(255,255,255,0.07)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', borderBottomLeftRadius: 4 }}>
                    {m.msg}
                </div>
            </motion.div>
        ))}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-2 p-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="flex-1 text-sm" style={{ color: 'var(--text-muted)' }}>Type a message…</span>
            <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--grad-sky)' }}>
                <Zap size={12} className="text-white" />
            </div>
        </motion.div>
    </div>
);

export const PaymentsVisual = () => (
    <div className="p-6 space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl"
            style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(6,182,212,0.1))', border: '1px solid rgba(16,185,129,0.25)' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Total Earnings</p>
            <p className="text-3xl font-black" style={{ color: '#10b981' }}>$12,480</p>
            <p className="text-xs mt-1 font-semibold" style={{ color: '#10b981' }}>↑ +18% this month</p>
        </motion.div>
        {[
            { label: 'Project: React Dashboard', amount: '+$2,500', color: '#10b981', delay: 0.2 },
            { label: 'Project: API Integration',  amount: '+$1,800', color: '#10b981', delay: 0.28 },
            { label: 'Project: Mobile App UI',    amount: '+$3,200', color: '#10b981', delay: 0.36 },
        ].map(t => (
            <motion.div key={t.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: t.delay }}
                className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>{t.label}</span>
                <span className="font-bold" style={{ color: t.color }}>{t.amount}</span>
            </motion.div>
        ))}
    </div>
);

export const FreelancerVisual = () => (
    <div className="p-6 grid grid-cols-2 gap-3">
        {[
            { name: 'Priya L.',  role: 'React Dev',    rate: '$65/hr', rating: '5.0', color: '#0ea5e9' },
            { name: 'James K.',  role: 'UI Designer',  rate: '$55/hr', rating: '4.9', color: '#8b5cf6' },
            { name: 'Amir S.',   role: 'ML Engineer',  rate: '$80/hr', rating: '4.8', color: '#10b981' },
            { name: 'Lena M.',   role: 'Copywriter',   rate: '$45/hr', rating: '5.0', color: '#f59e0b' },
        ].map((f, i) => (
            <motion.div key={f.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="p-3 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${f.color}20` }}>
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white mx-auto mb-2"
                    style={{ background: f.color }}>
                    {f.name[0]}
                </div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-loud)' }}>{f.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.role}</p>
                <p className="text-xs font-bold mt-1" style={{ color: f.color }}>{f.rate}</p>
            </motion.div>
        ))}
    </div>
);

export const DashboardVisual = () => (
    <div className="p-6 grid grid-cols-2 gap-3">
        {[
            { label: 'Total Earnings', value: '$12,480', trend: '+18%', color: '#10b981' },
            { label: 'Jobs Completed', value: '34',      trend: '+3',   color: '#0ea5e9' },
            { label: 'Active Jobs',    value: '2',       trend: 'Live', color: '#f59e0b' },
            { label: 'Rating',         value: '4.9★',    trend: 'Top',  color: '#8b5cf6' },
        ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                <p className="text-xl font-black" style={{ color: 'var(--text-loud)' }}>{s.value}</p>
                <p className="text-xs font-semibold mt-1" style={{ color: s.color }}>↑ {s.trend}</p>
            </motion.div>
        ))}
    </div>
);

export const HowItWorksVisual = () => (
    <div className="p-6 space-y-4">
        {[
            { step: '01', title: 'Sign Up Free',       desc: 'Create your account in 60 seconds.',    color: '#0ea5e9' },
            { step: '02', title: 'Post or Browse',     desc: 'List a job or find your next project.',  color: '#10b981' },
            { step: '03', title: 'Hire or Get Hired',  desc: 'Accept proposals and start working.',    color: '#8b5cf6' },
        ].map((s, i) => (
            <motion.div key={s.step} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.12 }}
                className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-white flex-shrink-0"
                    style={{ background: s.color, boxShadow: `0 0 16px ${s.color}40` }}>
                    {s.step}
                </div>
                <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-loud)' }}>{s.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                </div>
                {i < 2 && <div className="ml-auto w-px h-8 opacity-20" style={{ background: s.color }} />}
            </motion.div>
        ))}
    </div>
);

// ── About visuals ─────────────────────────────────────────────────────────────

export const MissionVisual = () => (
    <div className="p-6 space-y-3">
        {['Zero hidden fees', 'Instant payouts', 'Verified profiles', 'Dedicated support'].map((item, i) => (
            <motion.div key={item} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.09 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)' }}>
                <CheckCircle size={16} style={{ color: '#10b981' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item}</span>
            </motion.div>
        ))}
    </div>
);

export const TechStackVisual = () => (
    <div className="p-6 space-y-3">
        {[
            { layer: 'Frontend',  tech: 'React 19 + Vite 7 + Tailwind v4',    color: '#0ea5e9' },
            { layer: 'Animation', tech: 'Framer Motion + Three.js',            color: '#8b5cf6' },
            { layer: 'Backend',   tech: 'Node.js + Express 5',                 color: '#10b981' },
            { layer: 'Database',  tech: 'PostgreSQL + Sequelize ORM',          color: '#f59e0b' },
            { layer: 'Auth',      tech: 'JWT + httpOnly cookies',              color: '#06b6d4' },
        ].map((t, i) => (
            <motion.div key={t.layer} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.08 }}
                className="flex items-center gap-3">
                <span className="text-xs font-bold w-20 flex-shrink-0" style={{ color: t.color }}>{t.layer}</span>
                <div className="flex-1 h-px" style={{ background: `${t.color}30` }} />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.tech}</span>
            </motion.div>
        ))}
    </div>
);

export const StackGridVisual = () => (
    <div className="p-6 grid grid-cols-3 gap-3">
        {[
            { name: 'React 19',      color: '#0ea5e9' },
            { name: 'Node.js',       color: '#10b981' },
            { name: 'PostgreSQL',    color: '#06b6d4' },
            { name: 'Tailwind v4',   color: '#8b5cf6' },
            { name: 'Framer Motion', color: '#f59e0b' },
            { name: 'Three.js',      color: '#0ea5e9' },
        ].map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 + i * 0.07 }}
                className="p-3 rounded-xl text-center text-xs font-bold"
                style={{ background: `${t.color}12`, border: `1px solid ${t.color}25`, color: t.color }}>
                {t.name}
            </motion.div>
        ))}
    </div>
);

export const RoadmapVisual = () => (
    <div className="p-6 space-y-3">
        {[
            { item: 'WebSocket real-time messaging', done: false, color: '#0ea5e9' },
            { item: 'Stripe payment integration',    done: false, color: '#10b981' },
            { item: 'AI-powered job matching',       done: false, color: '#8b5cf6' },
            { item: 'Mobile apps (iOS + Android)',   done: false, color: '#f59e0b' },
        ].map((r, i) => (
            <motion.div key={r.item} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: `${r.color}08`, border: `1px solid ${r.color}20` }}>
                <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{r.item}</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${r.color}15`, color: r.color }}>Soon</span>
            </motion.div>
        ))}
    </div>
);

export const JoinVisual = () => (
    <div className="p-6 grid grid-cols-2 gap-4">
        {[
            { role: 'Freelancer', desc: 'Find work & get paid', icon: Rocket, color: '#0ea5e9', grad: 'linear-gradient(135deg,#0284c7,#0ea5e9)' },
            { role: 'Client',     desc: 'Hire top talent',      icon: Shield, color: '#10b981', grad: 'linear-gradient(135deg,#059669,#10b981)' },
        ].map((r, i) => (
            <motion.div key={r.role} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.12 }}
                className="p-5 rounded-2xl text-center"
                style={{ background: `${r.color}10`, border: `1px solid ${r.color}25` }}>
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: r.grad }}>
                    <r.icon size={20} className="text-white" />
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-loud)' }}>{r.role}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{r.desc}</p>
            </motion.div>
        ))}
    </div>
);
