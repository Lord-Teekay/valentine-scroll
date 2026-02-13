import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AudioToggle — plays an .mp3 file from /public using the Web Audio API.
 * Auto-plays on first user interaction (click anywhere) with a smooth fade-in.
 * Toggle button mutes/unmutes with a smooth gain ramp.
 */

const AUDIO_SRC = '/Elvis Presley - Can\'t Help Falling In Love (Official Audio).mp3';
const FADE_DURATION = 1.8; // seconds

export default function AudioToggle() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [hovered, setHovered] = useState(false);

    const ctxRef = useRef(null);
    const gainRef = useRef(null);
    const sourceRef = useRef(null);
    const bufferRef = useRef(null);
    const hasInitRef = useRef(false);

    // ── Initialise AudioContext, fetch & decode the mp3 ──
    const initAudio = useCallback(async () => {
        if (hasInitRef.current) return;
        hasInitRef.current = true;

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioCtx();
            ctxRef.current = ctx;

            // Gain node for smooth fade
            const gain = ctx.createGain();
            gain.gain.value = 0; // start silent
            gain.connect(ctx.destination);
            gainRef.current = gain;

            // Fetch and decode
            const response = await fetch(AUDIO_SRC);
            if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${AUDIO_SRC}`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            bufferRef.current = audioBuffer;

            setIsReady(true);

            // Auto-play with fade-in
            playAudio(ctx, gain, audioBuffer);
        } catch (err) {
            console.error('[AudioToggle] Failed to init audio:', err);
        }
    }, []);

    // ── Play the buffer (looped) with a fade-in ──
    const playAudio = useCallback((ctx, gain, buffer) => {
        // Stop any existing source
        if (sourceRef.current) {
            try { sourceRef.current.stop(); } catch { }
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(gain);
        source.start(0);
        sourceRef.current = source;

        // Resume context if suspended (autoplay policy)
        if (ctx.state === 'suspended') ctx.resume();

        // Smooth fade-in
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(1.0, now + FADE_DURATION);

        setIsPlaying(true);
    }, []);

    // ── Auto-play on first user gesture (click anywhere) ──
    useEffect(() => {
        const handleFirstInteraction = () => {
            initAudio();
            // Remove all listeners after first trigger
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
            window.removeEventListener('scroll', handleFirstInteraction);
        };

        window.addEventListener('click', handleFirstInteraction, { once: true });
        window.addEventListener('touchstart', handleFirstInteraction, { once: true });
        window.addEventListener('scroll', handleFirstInteraction, { once: true });

        return () => {
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
            window.removeEventListener('scroll', handleFirstInteraction);
        };
    }, [initAudio]);

    // ── Cleanup on unmount ──
    useEffect(() => {
        return () => {
            if (sourceRef.current) try { sourceRef.current.stop(); } catch { }
            if (ctxRef.current) ctxRef.current.close();
        };
    }, []);

    // ── Toggle mute / unmute ──
    const toggle = useCallback(() => {
        const ctx = ctxRef.current;
        const gain = gainRef.current;

        if (!ctx || !gain) {
            // If not initialized yet, init on button click
            initAudio();
            return;
        }

        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;

        if (isPlaying) {
            // Fade out
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(gain.gain.value, now);
            gain.gain.linearRampToValueAtTime(0.0, now + FADE_DURATION);
            setIsPlaying(false);
        } else {
            // If source was stopped, re-create it
            if (!sourceRef.current || sourceRef.current.playbackState === 0) {
                if (bufferRef.current) {
                    playAudio(ctx, gain, bufferRef.current);
                    return;
                }
            }
            // Fade in
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(gain.gain.value, now);
            gain.gain.linearRampToValueAtTime(1.0, now + FADE_DURATION);
            setIsPlaying(true);
        }
    }, [isPlaying, initAudio, playAudio]);

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
            {/* Sound wave bars */}
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
                                ? {
                                    duration: 0.8 + i * 0.15,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: i * 0.1,
                                }
                                : { duration: 0.4 }
                        }
                        className="w-[2.5px] rounded-full bg-[var(--color-rose-gold)]"
                        style={{ minHeight: '30%' }}
                    />
                ))}
            </div>

            {/* Label on hover */}
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
