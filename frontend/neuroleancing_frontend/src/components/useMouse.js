// Shared mouse ref — single global listener, zero re-renders
const mouseRef = { x: 0, y: 0 };

if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
        mouseRef.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
        mouseRef.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
}

export const useMouse = () => mouseRef;
