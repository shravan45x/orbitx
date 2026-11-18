import { useRef, type ReactNode, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

interface ScrollScrubProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    yFrom?: number;
    yTo?: number;
    opacityFrom?: number;
    opacityTo?: number;
    startRange?: string; // e.g. "start 95%"
    endRange?: string;   // e.g. "start 45%"
    stiffness?: number;
    damping?: number;
}

export default function ScrollScrub({
    children,
    className = '',
    style = {},
    yFrom = 50,
    yTo = 0,
    opacityFrom = 0.1,
    opacityTo = 1,
    startRange = 'start 95%',
    endRange = 'start 45%',
    stiffness = 140,
    damping = 30
}: ScrollScrubProps) {
    const ref = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: [startRange as any, endRange as any]
    });

    // Spring interpolation gives smooth momentum directly bound to user's scroll wheel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness,
        damping,
        restDelta: 0.001
    });

    const y = useTransform(smoothProgress, [0, 1], [yFrom, yTo]);
    const opacity = useTransform(smoothProgress, [0, 1], [opacityFrom, opacityTo]);

    if (shouldReduceMotion) {
        return (
            <div ref={ref} className={className} style={style}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                ...style,
                y,
                opacity,
                willChange: 'transform, opacity'
            }}
        >
            {children}
        </motion.div>
    );
}
