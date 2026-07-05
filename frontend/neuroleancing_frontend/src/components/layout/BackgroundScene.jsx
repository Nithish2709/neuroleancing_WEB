import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { useLocation } from 'react-router-dom';
import { useMouse } from '../useMouse';
import * as THREE from 'three';

// ── Reduced motion check ──────────────────────────────────────────────────────
const noMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

// ── Shape config ──────────────────────────────────────────────────────────────
const SHAPES_DESKTOP = [
    { geo: 'torusKnot',   pos: [-4.5, 2.5, -3],  scale: 0.7,  color: '#0ea5e9', speed: 1.1, parallax: 0.6 },
    { geo: 'icosahedron', pos: [4.5, -1.5, -4],   scale: 1.0,  color: '#10b981', speed: 1.7, parallax: 0.4 },
    { geo: 'octahedron',  pos: [-3.5, -2.5, -2],  scale: 0.8,  color: '#8b5cf6', speed: 1.4, parallax: 0.8 },
    { geo: 'torus',       pos: [3.5, 3.0, -5],    scale: 1.3,  color: '#06b6d4', speed: 0.9, parallax: 0.3 },
    { geo: 'dodecahedron',pos: [0.5, -3.5, -3],   scale: 0.9,  color: '#0ea5e9', speed: 1.9, parallax: 0.7 },
    { geo: 'sphere',      pos: [-5.5, 0.5, -6],   scale: 1.6,  color: '#10b981', speed: 0.6, parallax: 0.2 },
    { geo: 'cone',        pos: [5.5, -2.5, -4],   scale: 0.65, color: '#f59e0b', speed: 1.5, parallax: 0.5 },
    { geo: 'tetrahedron', pos: [1.5, 4.5, -5],    scale: 0.85, color: '#8b5cf6', speed: 1.2, parallax: 0.9 },
];

const SHAPES_MOBILE = SHAPES_DESKTOP.slice(0, 4);
const SHAPES = isMobile ? SHAPES_MOBILE : SHAPES_DESKTOP;
const PARTICLE_COUNT = isMobile ? 100 : 250;

// ── Geometry factory ──────────────────────────────────────────────────────────
const GeoNode = ({ type }) => {
    switch (type) {
        case 'torusKnot':    return <torusKnotGeometry args={[0.6, 0.2, 80, 12]} />;
        case 'icosahedron':  return <icosahedronGeometry args={[1, 0]} />;
        case 'octahedron':   return <octahedronGeometry args={[1, 0]} />;
        case 'torus':        return <torusGeometry args={[0.8, 0.28, 16, 40]} />;
        case 'dodecahedron': return <dodecahedronGeometry args={[1, 0]} />;
        case 'sphere':       return <sphereGeometry args={[1, 12, 8]} />;
        case 'cone':         return <coneGeometry args={[0.8, 1.6, 6]} />;
        case 'tetrahedron':  return <tetrahedronGeometry args={[1, 0]} />;
        default:             return <boxGeometry args={[1, 1, 1]} />;
    }
};

// ── Single floating object ────────────────────────────────────────────────────
const FloatingObject = ({ geo, pos, scale, color, speed, parallax }) => {
    const mesh = useRef();
    const mouse = useMouse();
    const basePos = useMemo(() => [...pos], []);

    useFrame((state) => {
        if (noMotion || !mesh.current) return;
        const t = state.clock.elapsedTime;
        mesh.current.position.y = basePos[1] + Math.sin(t * speed * 0.5) * 0.3;
        mesh.current.position.x = basePos[0] + Math.cos(t * speed * 0.3) * 0.15;
        mesh.current.rotation.x += (mouse.y * parallax * 0.5 - mesh.current.rotation.x) * 0.04;
        mesh.current.rotation.y += (mouse.x * parallax * 0.5 - mesh.current.rotation.y) * 0.04;
    });

    return (
        <Float
            speed={noMotion ? 0 : speed}
            rotationIntensity={noMotion ? 0 : 0.5}
            floatIntensity={noMotion ? 0 : 0.7}
        >
            <mesh ref={mesh} position={pos} scale={scale}>
                <GeoNode type={geo} />
                <meshStandardMaterial
                    color={color}
                    wireframe
                    transparent
                    opacity={0.13}
                    emissive={color}
                    emissiveIntensity={0.4}
                />
            </mesh>
        </Float>
    );
};

// ── Particle field ────────────────────────────────────────────────────────────
const ParticleField = () => {
    const ref = useRef();
    const positions = useMemo(() => {
        const arr = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            arr[i * 3]     = (Math.random() - 0.5) * 24;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 24;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 18;
        }
        return arr;
    }, []);

    useFrame(() => {
        if (noMotion || !ref.current) return;
        const pos = ref.current.geometry.attributes.position.array;
        for (let i = 1; i < PARTICLE_COUNT * 3; i += 3) {
            pos[i] += 0.003;
            if (pos[i] > 12) pos[i] = -12;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={positions}
                    count={PARTICLE_COUNT}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.035}
                color="#0ea5e9"
                transparent
                opacity={0.55}
                sizeAttenuation
            />
        </points>
    );
};

// ── Camera rig — cursor magnetic ──────────────────────────────────────────────
const CameraRig = () => {
    const { camera } = useThree();
    const mouse = useMouse();
    const smooth = useRef({ x: 0, y: 0 });

    useFrame(() => {
        if (noMotion) return;
        smooth.current.x += (mouse.x * 0.6 - smooth.current.x) * 0.035;
        smooth.current.y += (mouse.y * 0.35 - smooth.current.y) * 0.035;
        camera.position.x = smooth.current.x;
        camera.position.y = smooth.current.y;
        camera.lookAt(0, 0, 0);
    });
    return null;
};

// ── Scene contents ────────────────────────────────────────────────────────────
const SceneContents = () => (
    <>
        <fogExp2 color="#020508" density={0.028} />
        <ambientLight intensity={0.12} />
        <pointLight position={[6, 6, 4]}   color="#0ea5e9" intensity={1.4} />
        <pointLight position={[-6, -4, 2]} color="#10b981" intensity={0.9} />
        <pointLight position={[0, 4, -6]}  color="#8b5cf6" intensity={0.7} />
        <Stars radius={80} depth={50} count={isMobile ? 1500 : 3000} factor={3} fade speed={noMotion ? 0 : 0.4} />
        <ParticleField />
        {SHAPES.map((s, i) => <FloatingObject key={i} {...s} />)}
        <CameraRig />
    </>
);

// ── Main export ───────────────────────────────────────────────────────────────
const BackgroundScene = () => {
    const location = useLocation();

    // Static pages — no animation needed
    const STATIC_PATHS = ['/settings', '/complete-profile', '/404'];
    const isStatic = STATIC_PATHS.includes(location.pathname);

    return (
        <>
            {/* CSS gradient void behind canvas */}
            <div className="bg-scene" />
            {/* Dot grid overlay */}
            <div className="bg-grid" />
            {/* Three.js canvas */}
            <Canvas
                dpr={isMobile ? [1, 1] : [1, 1.5]}
                gl={{ antialias: false, alpha: true }}
                camera={{ fov: 60, position: [0, 0, 8] }}
                style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
                frameloop={isStatic || noMotion ? 'never' : 'always'}
            >
                <SceneContents />
            </Canvas>
        </>
    );
};

export default BackgroundScene;
