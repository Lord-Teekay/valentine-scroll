import { motion } from 'framer-motion';

export default function FloatingText({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    as: Tag = 'div',
}) {
    const yOffset = direction === 'up' ? 40 : direction === 'down' ? -40 : 0;
    const xOffset = direction === 'left' ? 40 : direction === 'right' ? -40 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset, x: xOffset }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            transition={{
                type: 'tween',
                duration: 0.8,
                delay,
                ease: 'easeOut',
            }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ willChange: 'transform' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
