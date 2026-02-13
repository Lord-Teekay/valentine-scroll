import { useEffect, useRef, useCallback } from 'react';

/**
 * ConfettiCanvas — canvas-based heart confetti effect
 * that fires when the component mounts (Section 5 finale).
 */
export default function ConfettiCanvas() {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animFrameRef = useRef(null);

    const createParticle = useCallback((canvas) => {
        const colors = [
            '#D4A373', '#E8C9A0', '#B8875A', '#D47373',
            '#F5F0EB', '#D4A373', '#E8C9A0',
        ];
        return {
            x: Math.random() * canvas.width,
            y: -20 - Math.random() * canvas.height * 0.5,
            vx: (Math.random() - 0.5) * 2,
            vy: 1.2 + Math.random() * 2.5,
            size: 6 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            opacity: 0.6 + Math.random() * 0.4,
            life: 1,
            decay: 0.001 + Math.random() * 0.003,
            isHeart: Math.random() > 0.4,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.02 + Math.random() * 0.03,
        };
    }, []);

    const drawHeart = useCallback((ctx, x, y, size, rotation, color, opacity) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        const s = size / 2;
        ctx.moveTo(0, s * 0.4);
        ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.6, -s, 0, -s * 0.4);
        ctx.bezierCurveTo(s * 0.6, -s, s, -s * 0.3, 0, s * 0.4);
        ctx.fill();
        ctx.restore();
    }, []);

    const drawSparkle = useCallback((ctx, x, y, size, rotation, color, opacity) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        const s = size / 3;
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle - 0.15) * s, Math.sin(angle - 0.15) * s);
            ctx.lineTo(Math.cos(angle) * s * 2, Math.sin(angle) * s * 2);
            ctx.lineTo(Math.cos(angle + 0.15) * s, Math.sin(angle + 0.15) * s);
        }
        ctx.fill();
        ctx.restore();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Initial burst
        for (let i = 0; i < 60; i++) {
            particlesRef.current.push(createParticle(canvas));
        }

        let spawnTimer = 0;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Continuously spawn
            spawnTimer++;
            if (spawnTimer % 8 === 0 && particlesRef.current.length < 100) {
                particlesRef.current.push(createParticle(canvas));
            }

            particlesRef.current = particlesRef.current.filter((p) => {
                p.wobble += p.wobbleSpeed;
                p.x += p.vx + Math.sin(p.wobble) * 0.5;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.life -= p.decay;
                p.vy *= 0.999;

                if (p.life <= 0 || p.y > canvas.height + 30) return false;

                const currentOpacity = p.opacity * p.life;
                if (p.isHeart) {
                    drawHeart(ctx, p.x, p.y, p.size, p.rotation, p.color, currentOpacity);
                } else {
                    drawSparkle(ctx, p.x, p.y, p.size, p.rotation, p.color, currentOpacity);
                }
                return true;
            });

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [createParticle, drawHeart, drawSparkle]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-[5] pointer-events-none"
        />
    );
}
