import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AudioToggle — plays an .mp3 via a streaming <audio> element
 * for near-instant playback. Auto-plays on first user gesture.
 */

const AUDIO_SRC = '/Elvis Presley - Can\'t Help Falling In Love (Official Audio).mp3';
const FADE_MS = 500; // half-second fade

export default function AudioToggle() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hovered, setHovered] = useState(false);
    const audioRef = useRef(null);
    const fadeRef = useRef(null);

    // Create the audio element once on mount
    useEffect(() => {
        const audio = new Audio(AUDIO_SRC);
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0;
        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    // Smooth volume fade helper
    const fadeTo = useCallback((target, durationMs) => {
        const audio = audioRef.current;
        if (!audio) return;
        if (fadeRef.current) clearInterval(fadeRef.current);

        const steps = 20;
        const stepMs = durationMs / steps;
        const delta = (target - audio.volume) / steps;

        fadeRef.current = setInterval(() => {
            const next = audio.volume + delta;
            if ((delta > 0 && next >= target) || (delta < 0 && next <= target)) {
                audio.volume = target;
                clearInterval(fadeRef.current);
                fadeRef.current = null;
                if (target === 0) audio.pause();
            } else {
                audio.volume = next;
            }
        }, stepMs);
    }, []);

    // Start playing with fade-in
    const play = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = 0;
        audio.play().then(() => {
            fadeTo(1, FADE_MS);
            setIsPlaying(true);
        }).catch((err) => {
            console.warn('[AudioToggle] Playback blocked:', err);
        });
    }, [fadeTo]);

    // Auto-play on first user gesture
    useEffect(() => {
        const trigger = () => {
            play();
            window.removeEventListener('click', trigger);
            window.removeEventListener('touchstart', trigger);
            window.removeEventListener('scroll', trigger);
        };
        window.addEventListener('click', trigger, { once: true });
        window.addEventListener('touchstart', trigger, { once: true });
        window.addEventListener('scroll', trigger, { once: true });
        return () => {
            window.removeEventListener('click', trigger);
            window.removeEventListener('touchstart', trigger);
            window.removeEventListener('scroll', trigger);
        };
    }, [play]);

    // Toggle mute / unmute
    const toggle = useCallback(() => {
        if (isPlaying) {
            fadeTo(0, FADE_MS);
            setIsPlaying(false);
        } else {
            const audio = audioRef.current;
            if (audio && audio.paused) {
                audio.play().catch(() => { });
            }
            fadeTo(1, FADE_MS);
            setIsPlaying(true);
        }
    }, [isPlaying, fadeTo]);

    return (
        <motion.button
            onClick={toggle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
            className="fixed top-5 right-16 md:right-20 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-md cursor-pointer group hover:border-[var(--color-rose-gold)]/30 transition-colors duration-500"
        >
            <div className="flex items-end gap-[3px] h-4 w-5">
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        animate={
                            isPlaying
                                ? { height: ['30%', '90%', '50%', '80%', '30%'] }
                                : { height: '30%' }
                        }
                        transition={
                            isPlaying
                                ? { duration: 0.8 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }
                                : { duration: 0.4 }
                        }
                        className="w-[2.5px] rounded-full bg-[var(--color-rose-gold)]"
                        style={{ minHeight: '30%' }}
                    />
                ))}
            </div>
            <AnimatePresence>
                {hovered && (
                    <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-[11px] tracking-widest uppercase text-[var(--color-muted)] font-body whitespace-nowrap overflow-hidden"
                    >
                        {isPlaying ? 'Mute' : 'Play'}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
