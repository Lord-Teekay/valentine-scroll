import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * BokehOverlay — decorative soft bokeh / lens flare circles
 * that gently drift and pulse based on scroll position.
 */
export default function BokehOverlay({ count = 12 }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll();

    const baseOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.35, 0.15]);

    const particles = useMemo(
        () =>
            Array.from({ length: count }).map((_, i) => ({
                id: i,
                size: 60 + Math.random() * 200,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                delay: Math.random() * 4,
                duration: 6 + Math.random() * 8,
                blurAmount: 30 + Math.random() * 50,
                opacity: 0.03 + Math.random() * 0.07,
                color:
                    Math.random() > 0.5
                        ? 'rgba(212, 163, 115, VAR_OPACITY)'  // rose-gold
                        : 'rgba(232, 201, 160, VAR_OPACITY)',  // rose-gold-light
            })),
        [count]
    );

    return (
        <motion.div
            style={{ opacity: baseOpacity }}
            className="fixed inset-0 z-[2] pointer-events-none overflow-hidden"
        >
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    animate={{
                        x: [0, 20, -10, 15, 0],
                        y: [0, -15, 10, -20, 0],
                        scale: [1, 1.15, 0.95, 1.1, 1],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute rounded-full"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: p.left,
                        top: p.top,
                        background: p.color.replace('VAR_OPACITY', String(p.opacity)),
                        filter: `blur(${p.blurAmount}px)`,
                    }}
                />
            ))}

            {/* Lens flare highlight — subtle centered glow */}
            <motion.div
                animate={{
                    opacity: [0.02, 0.06, 0.02],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                style={{
                    background:
                        'radial-gradient(circle, rgba(212,163,115,0.08) 0%, rgba(212,163,115,0.02) 40%, transparent 70%)',
                }}
            />
        </motion.div>
    );
}
