"use client";

import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Search } from "lucide-react";
import { Logo3D } from "@/components/ui/logo-3d";
import { useEffect } from "react";

export default function LandingPage() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Auto-rotation state
  const autoRotate = useMotionValue(0);

  useEffect(() => {
    const controls = animate(autoRotate, [0, 15, 0, -15, 0], {
      repeat: Infinity,
      duration: 10,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, []);

  // Smooth spring animation for the 3D rotation
  const mouseX = useSpring(x, { stiffness: 60, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 60, damping: 25 });

  const rotateX = useTransform(mouseY, [-300, 300], [25, -25]); // Increased from 10 to 25
  const rotateY = useTransform([mouseX, autoRotate], ([mX, aR]) => {
    const mouseRot = (mX as number) / 16; // Map +/-400 to +/-25
    return mouseRot + (aR as number);
  });

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
    <div className="min-h-screen bg-background overflow-hidden relative flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-background to-background">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none"
        style={{ backgroundImage: "linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <header className="absolute top-0 w-full p-4 sm:p-10 flex justify-between items-center z-20">
        <Logo3D />
      </header>

      <main className="max-w-7xl w-full relative z-10 pt-20 sm:pt-24 flex flex-col items-center">
        {/* Center Feature Section: Text Only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-center mb-16 sm:mb-32 group cursor-default gap-8 sm:gap-16 md:gap-24"
        >
          <div className="flex flex-col items-center md:items-start max-w-none text-center md:text-left">
            <motion.h2
              whileHover={{ scale: 1.02, letterSpacing: "0.01em" }}
              whileTap={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 drop-shadow-2xl select-none"
            >
              Signature Forgery Detection
            </motion.h2>
            <div className="h-1.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 transition-all duration-700 mt-3 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
          </div>

          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d"
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80"
          >
            <Image
              src="/forensic-lens-v2.jpg"
              alt="Forensic Lens"
              fill
              className="object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.5)] filter brightness-110"
              style={{ transform: "translateZ(80px)" }}
            />
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 sm:space-y-10 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-bold tracking-wide uppercase">
              <Zap className="h-4 w-4 animate-pulse" />
              AI-Powered Forensic Intel
            </div>
            <h1 className="text-4xl sm:text-7xl md:text-9xl font-black text-foreground leading-[0.95] tracking-tighter">
              Verify with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-purple-600">Pure Absolute</span> <br />
              Confidence.
            </h1>
            <p className="text-lg sm:text-2xl text-muted-foreground/80 max-w-xl leading-relaxed font-medium mx-auto lg:mx-0">
              Next-generation signature forgery detection. Harnessing ResNet-18 Siamese Networks for surgical precision in authentication.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 pt-4">
              <Link href="/dashboard">
                <button className="px-6 py-3.5 sm:px-10 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-base sm:text-xl flex items-center gap-3 transition-all transform hover:scale-105 hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)] group active:scale-95">
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <button className="px-6 py-3.5 sm:px-10 sm:py-5 bg-secondary/50 backdrop-blur-md hover:bg-secondary text-foreground rounded-2xl font-black text-base sm:text-xl border border-border/50 transition-all flex items-center gap-2">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-12 pt-8 sm:pt-12 border-t border-border/20">
              <div>
                <p className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter">98.2%</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">Accuracy</p>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter">1.2s</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">Latency</p>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter">5.0k+</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">Validated</p>
              </div>
            </div>
          </motion.div>

          {/* 3D Interactive Hero */}
          <div className="relative flex justify-center perspective-[2000px]" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <motion.div
              style={{
                rotateX,
                rotateY, // Now includes auto-rotation
                transformStyle: "preserve-3d",
              }}
              className="relative w-full aspect-[1.1/1] max-w-[650px]"
            >
              {/* Base Layer - The Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="absolute inset-0 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] border border-white/20 bg-black/40"
                style={{ transform: "translateZ(0px)" }}
              >
                <Image
                  src="/forensic-lens-v3.png"
                  alt="Forensic Deep Scan"
                  fill
                  className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Extra Feature: Holographic Scanline */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49%,rgba(59,130,246,0.3)_50%,transparent_51%)] bg-[length:100%_4px] animate-scanline pointer-events-none opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 via-transparent to-transparent" />
              </motion.div>

              {/* Parallax Floating UI - Top Right */}
              <div style={{ transform: "translateZ(100px)" }} className="absolute -top-4 -right-4 sm:-top-12 sm:-right-12 p-3 sm:p-8 bg-card/60 backdrop-blur-2xl rounded-2xl sm:rounded-[2rem] border border-white/10 shadow-2xl animate-float-slow">
                <div className="flex items-center gap-3 sm:gap-5">
                  <motion.div
                    className="p-2 sm:p-4 bg-green-500/20 rounded-xl sm:rounded-2xl"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <Shield className="h-4 w-4 sm:h-8 sm:w-8 text-green-500" />
                  </motion.div>
                  <div>
                    <p className="text-[9px] sm:text-sm font-bold text-muted-foreground uppercase tracking-widest">Trust Status</p>
                    <p className="text-sm sm:text-2xl font-black text-foreground tracking-tight">VERIFIED</p>
                  </div>
                </div>
              </div>

              {/* Parallax Floating UI - Bottom Left */}
              <div style={{ transform: "translateZ(150px)" }} className="absolute -bottom-4 -left-4 sm:-bottom-12 sm:-left-12 p-3 sm:p-8 bg-blue-600 rounded-2xl sm:rounded-[2rem] shadow-2xl border border-blue-400/40 animate-float-delayed">
                <div className="flex items-center gap-2 sm:gap-4">
                  <Search className="h-5 w-5 sm:h-10 sm:w-10 text-white animate-pulse" />
                  <p className="text-white font-black italic text-sm sm:text-3xl tracking-tighter">DEEP SCAN</p>
                </div>
              </div>

              {/* Atmospheric Glow */}
              <div className="absolute inset-0 blur-[150px] bg-blue-500/30 rounded-full z-[-1] translate-y-10" />
              <div className="absolute -inset-10 border-2 border-dashed border-blue-500/20 rounded-[3rem] z-[-1] animate-[spin_60s_linear_infinite]" />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
