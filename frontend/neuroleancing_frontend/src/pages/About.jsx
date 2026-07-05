import React, { useState, useCallback } from 'react';
import AboutLeft from '../components/AboutLeft';
import AboutRight, { ABOUT_FRAMES } from '../components/AboutRight';

const About = () => {
    const [activeFrame, setActiveFrame] = useState(0);

    const handleFrameChange = useCallback((i) => setActiveFrame(i), []);

    return (
        <>
            {/* Mobile */}
            <div className="md:hidden flex flex-col min-h-screen">
                <div className="px-6 pt-8 pb-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white"
                            style={{ background: 'linear-gradient(135deg,#0284c7,#10b981)' }}>N</div>
                        <span className="text-lg font-black text-grad-premium">Neurolance</span>
                    </div>
                    <h1 className="text-3xl font-black leading-tight mb-3" style={{ color: 'var(--text-loud)' }}>
                        About <span className="text-grad-sky">Neurolance</span>
                    </h1>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                        Built to empower independent work — no middlemen, no bloat.
                    </p>
                </div>
                <div className="flex-1 px-4 pb-6">
                    <AboutRight onFrameChange={handleFrameChange} />
                </div>
                <div className="flex justify-center gap-2 pb-6">
                    {ABOUT_FRAMES.map((f, i) => (
                        <button key={i} onClick={() => setActiveFrame(i)}
                            className="rounded-full transition-all"
                            style={{
                                width: activeFrame === i ? 20 : 8,
                                height: 8,
                                background: activeFrame === i ? f.color : 'rgba(255,255,255,0.2)',
                            }}
                            aria-label={f.label}
                        />
                    ))}
                </div>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex h-screen overflow-hidden">
                {/* Left — 42% */}
                <div className="w-[42%] flex-shrink-0 relative z-10">
                    <AboutLeft
                        activeFrame={activeFrame}
                        totalFrames={ABOUT_FRAMES.length}
                        frames={ABOUT_FRAMES}
                        onDotClick={(i) => setActiveFrame(i)}
                    />
                </div>

                <div className="w-px flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />

                {/* Right — 58% */}
                <div className="flex-1 relative z-10">
                    <AboutRight onFrameChange={handleFrameChange} />
                </div>
            </div>
        </>
    );
};

export default About;
