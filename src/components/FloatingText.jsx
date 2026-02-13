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
                duration: 0.9,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            viewport={{ once: false, amount: 0.3 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
