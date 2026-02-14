import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AudioToggle — mobile-first audio component.
 *
 * • Unlocks audio on the first user gesture (click / touch / scroll).
 * • Fades volume from 0 → 0.5 over 2 seconds so it doesn't startle.
 * • Shows a pulsing ring animation until audio is active.
 * • Displays a "Sound On" label that auto-fades after 3 seconds.
 */

const AUDIO_SRC = '/Elvis Presley - Can\'t Help Falling In Love (Official Audio).mp3';
const TARGET_VOLUME = 0.5;
const FADE_IN_MS = 2000;
const FADE_OUT_MS = 600;

export default function AudioToggle() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    const [showLabel, setShowLabel] = useState(false);
    const audioRef = useRef(null);
    const fadeRef = useRef(null);

    // ── Create audio element once ────────────────────────
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

    // ── Smooth volume fade helper ────────────────────────
    const fadeTo = useCallback((target, durationMs) => {
        const audio = audioRef.current;
        if (!audio) return;
        if (fadeRef.current) clearInterval(fadeRef.current);

        const steps = 40; // more steps = smoother fade
        const stepMs = durationMs / steps;
        const delta = (target - audio.volume) / steps;

        fadeRef.current = setInterval(() => {
            const next = audio.volume + delta;
            if ((delta > 0 && next >= target) || (delta < 0 && next <= target)) {
                audio.volume = Math.max(0, Math.min(1, target));
                clearInterval(fadeRef.current);
                fadeRef.current = null;
                if (target === 0) audio.pause();
            } else {
                audio.volume = Math.max(0, Math.min(1, next));
            }
        }, stepMs);
    }, []);

    // ── Unlock & play on first gesture ───────────────────
    const unlock = useCallback(() => {
        const audio = audioRef.current;
        if (!audio || unlocked) return;

        audio.volume = 0;
        audio.play().then(() => {
            setUnlocked(true);
            setIsPlaying(true);
            setShowLabel(true);
            fadeTo(TARGET_VOLUME, FADE_IN_MS);
        }).catch((err) => {
            console.warn('[AudioToggle] Playback blocked:', err);
        });
    }, [unlocked, fadeTo]);

    // ── Global gesture listeners ─────────────────────────
    useEffect(() => {
        if (unlocked) return;

        const handler = () => unlock();

        window.addEventListener('click', handler, { once: true, passive: true });
        window.addEventListener('touchstart', handler, { once: true, passive: true });
        window.addEventListener('scroll', handler, { once: true, passive: true });

        return () => {
            window.removeEventListener('click', handler);
            window.removeEventListener('touchstart', handler);
            window.removeEventListener('scroll', handler);
        };
    }, [unlock, unlocked]);

    // ── Auto-hide "Sound On" label after 3 seconds ───────
    useEffect(() => {
        if (!showLabel) return;
        const id = setTimeout(() => setShowLabel(false), 3000);
        return () => clearTimeout(id);
    }, [showLabel]);

    // ── Toggle mute / unmute ─────────────────────────────
    const toggle = useCallback(() => {
        if (!unlocked) {
            unlock();
            return;
        }

        if (isPlaying) {
            fadeTo(0, FADE_OUT_MS);
            setIsPlaying(false);
        } else {
            const audio = audioRef.current;
            if (audio && audio.paused) {
                audio.play().catch(() => { });
            }
            fadeTo(TARGET_VOLUME, FADE_IN_MS);
            setIsPlaying(true);
        }
    }, [isPlaying, unlocked, unlock, fadeTo]);

    return (
        <div
            className="fixed top-6 right-6 z-50"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
            {/* ── Toggle button ──────────────────────────── */}
            <div className="relative flex items-center gap-3">
                <motion.button
                    onClick={toggle}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
                    className="relative flex items-center justify-center w-12 h-12 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-md cursor-pointer group hover:border-[var(--color-rose-gold)]/30 transition-colors duration-500"
                >
                    {/* Pulsing ring — visible until audio is playing */}
                    <AnimatePresence>
                        {!isPlaying && (
                            <motion.span
                                key="pulse-ring"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 rounded-full"
                            >
                                <motion.span
                                    animate={{
                                        scale: [1, 1.45, 1],
                                        opacity: [0.35, 0, 0.35],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="absolute inset-0 rounded-full border border-[var(--color-rose-gold)]/40"
                                />
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* Equalizer bars */}
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
                </motion.button>

                {/* ── "Sound On" label — auto-fades after 3s ─── */}
                <AnimatePresence>
                    {showLabel && (
                        <motion.span
                            initial={{ opacity: 0, x: 6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 6 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="text-[11px] tracking-widest uppercase text-[var(--color-rose-gold)] font-body whitespace-nowrap pointer-events-none select-none"
                        >
                            Sound On
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
