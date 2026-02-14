import { motion } from 'framer-motion';

export default function ScrollIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        >
            <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-xs tracking-[0.3em] uppercase text-[var(--color-muted)] font-body"
            >
                Scroll
            </motion.span>

            {/* Animated line + chevron */}
            <div className="relative w-6 h-14 flex flex-col items-center">
                {/* Vertical line */}
                <motion.div
                    animate={{ scaleY: [0, 1, 0], originY: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-[1px] h-8 bg-gradient-to-b from-transparent via-[var(--color-rose-gold)] to-transparent"
                />
                {/* Chevron */}
                <motion.svg
                    animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="none"
                    className="mt-1"
                >
                    <path
                        d="M1 1L8 8L15 1"
                        stroke="var(--color-rose-gold)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </motion.svg>
            </div>
        </motion.div>
    );
}
