"use client";

import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";

export function Logo3D() {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const baseRotation = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseY, [-50, 50], [25, -25]);
    const rotateY = useTransform([mouseX, baseRotation], ([mX, bR]) => (mX as number) / 2 + (bR as number));
    const shineX = useTransform(mouseX, [-50, 50], [-100, 100]);

    useEffect(() => {
        const controls = animate(baseRotation, [0, 15, 0, -15, 0], {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
        });
        return () => controls.stop();
    }, [baseRotation]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <Link href="/">
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative flex items-center justify-center p-2 cursor-pointer group"
                style={{ perspective: "1500px" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Background Glow Effect */}
                <div className="absolute inset-x-0 inset-y-0 bg-blue-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <motion.div
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d"
                    }}
                    className="relative flex items-center gap-3"
                >
                    <div className="relative w-48 h-12" style={{ transform: "translateZ(80px)" }}>
                        <Image
                            src="/app-logo.png"
                            alt="ForgeryDetect Logo"
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />

                        {/* 3D Reflection Shine Line */}
                        <motion.div
                            style={{ x: shineX, transform: "translateZ(31px)" }}
                            className="absolute inset-y-0 w-12 bg-white/10 blur-xl skew-x-12 pointer-events-none"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </Link>
    );
}
