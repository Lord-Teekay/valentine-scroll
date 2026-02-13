import { motion } from 'framer-motion';

/**
 * BlurRevealText — text that transitions from blurred to focused.
 * Used for Section 4 "The Affirmation".
 */
export default function BlurRevealText({ children, className = '', delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(16px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{
                duration: 1.4,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            viewport={{ once: false, amount: 0.4 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
