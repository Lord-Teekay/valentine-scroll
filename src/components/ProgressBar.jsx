import { motion, useScroll, useTransform } from 'framer-motion';

export default function ProgressBar() {
    const { scrollYProgress } = useScroll();
    const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
    const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.7, 1]);

    return (
        <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
            {/* Track */}
            <div className="relative w-[3px] h-[140px] md:h-[200px] rounded-full bg-white/10 overflow-hidden">
                {/* Fill */}
                <motion.div
                    style={{ height }}
                    className="absolute bottom-0 left-0 w-full rounded-full"
                >
                    <div className="w-full h-full bg-gradient-to-t from-[var(--color-rose-gold-dark)] via-[var(--color-rose-gold)] to-[var(--color-rose-gold-light)] rounded-full" />
                </motion.div>
            </div>

            {/* Dot indicator */}
            <motion.div
                style={{ opacity: glowOpacity }}
                className="w-2 h-2 rounded-full bg-[var(--color-rose-gold)]"
            >
                <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-full rounded-full bg-[var(--color-rose-gold)]"
                />
            </motion.div>
        </div>
    );
}
