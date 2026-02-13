import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * CinematicSection — full-screen scroll-snap section with:
 *  - Full-bleed background <img> (object-cover, w-full, h-full)
 *  - Scale 1.05 → 1.0 reveal on scroll
 *  - Grayscale → full color transition
 *  - Dark overlay for text readability
 *  - onError logging for failed image loads
 */
export default function CinematicSection({
    children,
    imageSrc,
    id,
    className = '',
    overlayOpacity = 0.55,
    isFirst = false,
    isLast = false,
    debugBorder = '',
}) {
    const ref = useRef(null);

    // Adjust offsets so the first/last sections are fully visible when in viewport
    const offset = isFirst
        ? ['start start', 'end start']
        : isLast
            ? ['start end', 'end end']
            : ['start end', 'end start'];

    const { scrollYProgress } = useScroll({
        target: ref,
        offset,
    });

    // Image reveal transforms
    const imgScale = useTransform(
        scrollYProgress,
        isFirst ? [0, 0.8, 1] : isLast ? [0, 0.3, 1] : [0, 0.35, 0.65, 1],
        isFirst ? [1.0, 1.0, 1.05] : isLast ? [1.05, 1.0, 1.0] : [1.08, 1.0, 1.0, 1.05],
    );

    const grayscale = useTransform(
        scrollYProgress,
        isFirst ? [0, 0.5, 1] : isLast ? [0, 0.3, 1] : [0, 0.3, 0.7, 1],
        isFirst ? [0, 0, 0.6] : isLast ? [0.6, 0, 0] : [1, 0, 0, 0.6],
    );
    const grayscaleFilter = useTransform(grayscale, (v) => `grayscale(${v})`);

    // Content fade — first/last stay visible
    const contentOpacity = useTransform(
        scrollYProgress,
        isFirst ? [0, 0.8, 1] : isLast ? [0, 0.25, 1] : [0, 0.25, 0.75, 1],
        isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0],
    );

    const contentY = useTransform(
        scrollYProgress,
        isFirst ? [0, 0.8, 1] : isLast ? [0, 0.25, 1] : [0, 0.25, 0.75, 1],
        isFirst ? [0, 0, -20] : isLast ? [30, 0, 0] : [30, 0, 0, -20],
    );

    return (
        <section
            ref={ref}
            id={id}
            style={{ scrollSnapAlign: 'start' }}
            className={`relative h-screen w-full snap-start snap-always overflow-hidden ${debugBorder} ${className}`}
        >
            {/* Background image layer — uses <img> for reliable sizing */}
            <motion.div
                style={{ scale: imgScale, filter: grayscaleFilter }}
                className="absolute inset-0 z-0"
            >
                <img
                    src={imageSrc}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        console.error(`[CinematicSection] Image failed to load: "${imageSrc}"`, e);
                    }}
                />
            </motion.div>

            {/* Dark overlay */}
            <div
                className="absolute inset-0 z-[1]"
                style={{ background: `rgba(18, 18, 18, ${overlayOpacity})` }}
            />

            {/* Content */}
            <motion.div
                style={{ opacity: contentOpacity, y: contentY }}
                className="relative z-10 w-full h-full flex items-center justify-center px-6 md:px-12 lg:px-24"
            >
                {children}
            </motion.div>
        </section>
    );
}
