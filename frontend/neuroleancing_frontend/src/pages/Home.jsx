import React, { useState, useCallback } from 'react';
import HomeLeft from '../components/HomeLeft';
import HomeRight, { HOME_FRAMES } from '../components/HomeRight';

const Home = () => {
    const [activeFrame, setActiveFrame] = useState(0);

    const handleFrameChange = useCallback((i) => setActiveFrame(i), []);

    return (
        <>
            {/* Mobile: stacked layout */}
            <div className="md:hidden flex flex-col min-h-screen">
                {/* Compact header */}
                <div className="px-6 pt-8 pb-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white"
                            style={{ background: 'linear-gradient(135deg,#0284c7,#10b981)' }}>N</div>
                        <span className="text-lg font-black text-grad-premium">Neurolance</span>
                    </div>
                    <h1 className="text-3xl font-black leading-tight mb-3" style={{ color: 'var(--text-loud)' }}>
                        Hire Smarter.<br />
                        Build <span className="text-grad-sky">Faster.</span>
                    </h1>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                        Connect with elite freelancers or find your next project.
                    </p>
                    <div className="flex gap-3">
                        <a href="/register" className="btn-primary px-5 py-2.5 text-sm font-bold rounded-xl">Get Started →</a>
                        <a href="/projects" className="btn-secondary px-5 py-2.5 text-sm rounded-xl">Browse Jobs</a>
                    </div>
                </div>

                {/* Mobile frame area */}
                <div className="flex-1 px-4 pb-6">
                    <HomeRight onFrameChange={handleFrameChange} />
                </div>

                {/* Mobile dot nav — horizontal */}
                <div className="flex justify-center gap-2 pb-6">
                    {HOME_FRAMES.map((f, i) => (
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

            {/* Desktop: split layout */}
            <div className="hidden md:flex h-screen overflow-hidden">
                {/* Left — 42% */}
                <div className="w-[42%] flex-shrink-0 relative z-10">
                    <HomeLeft
                        activeFrame={activeFrame}
                        totalFrames={HOME_FRAMES.length}
                        frames={HOME_FRAMES}
                        onDotClick={(i) => setActiveFrame(i)}
                    />
                </div>

                {/* Divider */}
                <div className="w-px flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />

                {/* Right — 58% */}
                <div className="flex-1 relative z-10">
                    <HomeRight onFrameChange={handleFrameChange} />
                </div>
            </div>
        </>
    );
};

export default Home;
