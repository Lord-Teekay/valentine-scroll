import { motion } from 'framer-motion';

export default function HeartAnimation({ size = 120, className = '' }) {
    return (
        <motion.div
            className={`inline-block ${className}`}
            animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="heartGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="var(--color-rose-gold-dark)" />
                        <stop offset="50%" stopColor="var(--color-rose-gold)" />
                        <stop offset="100%" stopColor="var(--color-rose-gold-light)" />
                    </linearGradient>
                    <filter id="heartGlow">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <path
                    d="M60 100C60 100 15 70 15 40C15 25 27 15 40 15C50 15 57 22 60 28C63 22 70 15 80 15C93 15 105 25 105 40C105 70 60 100 60 100Z"
                    fill="url(#heartGradient)"
                    filter="url(#heartGlow)"
                />
            </svg>
        </motion.div>
    );
}
