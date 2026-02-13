import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import CinematicSection from './components/CinematicSection';
import ProgressBar from './components/ProgressBar';
import ScrollIndicator from './components/ScrollIndicator';
import FloatingText from './components/FloatingText';
import BlurRevealText from './components/BlurRevealText';
import BokehOverlay from './components/BokehOverlay';
import ConfettiCanvas from './components/ConfettiCanvas';
import HeartAnimation from './components/HeartAnimation';
import AudioToggle from './components/AudioToggle';

/* ─── Floating Hearts Background ──────────────────────── */
function FloatingHearts() {
  const hearts = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
    size: 8 + Math.random() * 14,
    opacity: 0.03 + Math.random() * 0.06,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, h.opacity, h.opacity, 0] }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute"
          style={{ left: h.left }}
        >
          <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="var(--color-rose-gold)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Decorative Divider ──────────────────────────────── */
function Divider({ className = '' }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: false }}
      className={`w-20 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-rose-gold)] to-transparent origin-center ${className}`}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 1 — THE HOOK
   ═══════════════════════════════════════════════════════ */
function SectionHook() {
  return (
    <CinematicSection id="hook" imageSrc="/vday-image-1.JPG" overlayOpacity={0.6} isFirst>
      <div className="text-center max-w-3xl mx-auto">
        {/* Overline */}
        <FloatingText delay={0.3}>
          <span className="text-xs md:text-sm tracking-[0.4em] uppercase text-[var(--color-muted)] font-body">
            A Love Letter In Motion
          </span>
        </FloatingText>

        {/* Main heading — floating elegant entrance */}
        <FloatingText delay={0.6} className="mt-6 md:mt-8">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.2] tracking-tight text-rose-gold glow-rose">
            To the one who makes
            <br />
            <span className="italic font-normal text-[var(--color-cream)]">every ordinary day</span>
            <br />
            feel like a highlight reel.
          </h1>
        </FloatingText>

        {/* Small heart */}
        <FloatingText delay={1.0} className="mt-8">
          <HeartAnimation size={40} />
        </FloatingText>
      </div>

      <ScrollIndicator />
    </CinematicSection>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 2 — THE JOURNEY
   ═══════════════════════════════════════════════════════ */
function SectionJourney() {
  return (
    <CinematicSection id="journey" imageSrc="/vday-image-2.jpeg" overlayOpacity={0.55}>
      <div className="max-w-4xl mx-auto text-center md:text-left">
        <FloatingText delay={0.1} direction="left">
          <span className="text-xs tracking-[0.4em] uppercase text-[var(--color-rose-gold-dark)] font-body block mb-4">
            Chapter One · The Journey
          </span>
        </FloatingText>

        <FloatingText delay={0.2} className="mb-4">
          <Divider />
        </FloatingText>

        {/* Narrative — slides in from the left */}
        <FloatingText delay={0.4} direction="left">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.2] text-[var(--color-cream)]">
            I look back at where we started,
          </h2>
        </FloatingText>

        <FloatingText delay={0.6} direction="left">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal italic leading-[1.2] text-rose-gold glow-rose mt-2">
            and I wouldn't change a single second
          </h2>
        </FloatingText>

        <FloatingText delay={0.8} direction="left">
          <p className="font-display text-xl md:text-2xl lg:text-3xl text-[var(--color-muted)] font-light mt-4 leading-relaxed">
            of the path that led me to you.
          </p>
        </FloatingText>
      </div>
    </CinematicSection>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 3 — THE ESSENCE
   ═══════════════════════════════════════════════════════ */
function SectionEssence() {
  return (
    <CinematicSection id="essence" imageSrc="/vday-image-3.jpeg" overlayOpacity={0.6}>
      <div className="max-w-3xl mx-auto text-center">
        <FloatingText delay={0.1}>
          <span className="text-xs tracking-[0.4em] uppercase text-[var(--color-rose-gold-dark)] font-body block mb-4">
            Chapter Two · The Essence
          </span>
        </FloatingText>

        <FloatingText delay={0.2} className="flex justify-center mb-6">
          <Divider />
        </FloatingText>

        {/* Text that expands / grows slightly */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: false, amount: 0.4 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.3] text-[var(--color-cream)]">
            It's the small things—
          </h2>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal italic leading-[1.3] text-rose-gold glow-rose mt-2">
            your laugh, your light,
          </h2>
          <p className="font-display text-xl md:text-2xl text-[var(--color-muted)] font-light mt-4 leading-relaxed max-w-xl mx-auto">
            and the way you make the world feel a little bit quieter.
          </p>
        </motion.div>

        {/* Expanding accent circle */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.06 }}
          transition={{ duration: 1.8, delay: 0.3, ease: 'easeOut' }}
          viewport={{ once: false }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-[var(--color-rose-gold)] pointer-events-none"
        />
      </div>
    </CinematicSection>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 4 — THE AFFIRMATION
   ═══════════════════════════════════════════════════════ */
function SectionAffirmation() {
  return (
    <CinematicSection id="affirmation" imageSrc="/vday-image-4.jpeg" overlayOpacity={0.6}>
      <div className="max-w-3xl mx-auto text-center">
        <BlurRevealText delay={0}>
          <span className="text-xs tracking-[0.4em] uppercase text-[var(--color-rose-gold-dark)] font-body block mb-4">
            Chapter Three · The Affirmation
          </span>
        </BlurRevealText>

        <BlurRevealText delay={0.15} className="flex justify-center mb-6">
          <Divider />
        </BlurRevealText>

        {/* Blur-to-focus text reveal */}
        <BlurRevealText delay={0.3}>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.3] text-[var(--color-cream)]">
            I don't need a day to tell you
            <br />
            how amazing you are,
          </h2>
        </BlurRevealText>

        <BlurRevealText delay={0.5}>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal italic leading-[1.3] text-rose-gold glow-rose mt-4">
            but I'm going to use this one
          </h2>
        </BlurRevealText>

        <BlurRevealText delay={0.7}>
          <p className="font-display text-xl md:text-2xl text-[var(--color-muted)] font-light mt-4 leading-relaxed">
            to remind you anyway.
          </p>
        </BlurRevealText>
      </div>
    </CinematicSection>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 5 — THE FINALE
   ═══════════════════════════════════════════════════════ */
function SectionFinale() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  return (
    <CinematicSection id="finale" imageSrc="/vday-image-5.jpeg" overlayOpacity={0.65} isLast>
      <div ref={ref} className="max-w-3xl mx-auto text-center relative z-10 h-full flex flex-col items-center justify-center">
        {/* Confetti fires when in view */}
        {isInView && <ConfettiCanvas />}

        <FloatingText delay={0.2}>
          <span className="text-xs tracking-[0.4em] uppercase text-[var(--color-rose-gold-dark)] font-body block mb-4">
            The Finale
          </span>
        </FloatingText>

        <FloatingText delay={0.3} className="flex justify-center mb-6">
          <Divider />
        </FloatingText>

        <FloatingText delay={0.5}>
          <HeartAnimation size={90} />
        </FloatingText>

        <FloatingText delay={0.7} className="mt-6">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-rose-gold glow-rose">
            Happy Valentine's Day.
          </h2>
        </FloatingText>

        <FloatingText delay={0.9} className="mt-4">
          <p className="font-display text-xl md:text-2xl lg:text-3xl text-[var(--color-cream)] italic leading-relaxed font-light">
            I love you, and I am so lucky
            <br />
            to be your person.
          </p>
        </FloatingText>

        {/* Footer — pinned to bottom of viewport */}
        <FloatingText delay={1.1} className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <p className="text-xs text-[var(--color-muted)] tracking-widest uppercase">
            Made with ♡ for Valentine's Day 2026
          </p>
        </FloatingText>
      </div>
    </CinematicSection>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <FloatingHearts />
      <BokehOverlay count={14} />
      <ProgressBar />
      <AudioToggle />
      <main>
        <SectionHook />
        <SectionJourney />
        <SectionEssence />
        <SectionAffirmation />
        <SectionFinale />
      </main>
    </>
  );
}
