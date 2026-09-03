"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

export function AnimatedLogo() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for the rotation
    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-250, 250], [15, -15]);
    const rotateY = useTransform(mouseX, [-250, 250], [-15, 15]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
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
        <div className="w-full flex items-center justify-center py-8" style={{ perspective: "1200px" }}>
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative h-72 w-full max-w-4xl rounded-2xl bg-card shadow-2xl border border-white/10 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Background Glow */}
                <div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"
                    style={{ transform: "translateZ(-20px)" }}
                />

                {/* Main Image Container */}
                <div
                    style={{ transform: "translateZ(20px)" }}
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-black/90"
                >
                    <Image
                        src="/logo-3d.jpg"
                        alt="3D Logo"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition duration-500 group-hover:scale-105"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>

                {/* Floating Text 3D Layer */}
                <div
                    style={{ transform: "translateZ(80px)" }}
                    className="absolute bottom-10 left-10 p-4"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                            Forg0
                        </h2>
                        <div className="h-2 w-24 bg-blue-500 rounded-full mt-2 mb-4" />
                        <p className="text-lg font-medium text-gray-200 bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm inline-block border border-white/10">
                            GenAI Powered Signature Analytics
                        </p>
                    </motion.div>
                </div>

                {/* Floating Verified Badge */}
                <motion.div
                    style={{ transform: "translateZ(120px)" }}
                    className="absolute top-10 right-10 bg-green-500/20 backdrop-blur-md border border-green-500/50 p-3 rounded-full shadow-lg"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                </motion.div>

            </motion.div>
        </div>
    );
}
