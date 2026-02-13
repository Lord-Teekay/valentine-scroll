import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollSection({ children, className = '', id }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.92]);

    return (
        <section
            ref={ref}
            id={id}
            className={`relative h-screen w-full snap-start snap-always overflow-hidden flex items-center justify-center ${className}`}
        >
            <motion.div
                style={{ opacity, scale }}
                className="relative z-10 w-full h-full flex items-center justify-center px-6 md:px-12 lg:px-24"
            >
                {children}
            </motion.div>
        </section>
    );
}
