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
                type: 'tween',
                duration: 0.8,
                delay,
                ease: 'easeOut',
            }}
            viewport={{ once: true, amount: 0.4 }}
            style={{ willChange: 'transform, filter' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
