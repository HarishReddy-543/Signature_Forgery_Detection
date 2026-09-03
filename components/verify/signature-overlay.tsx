"use client";

import { useState } from "react";
import { Layers, Maximize2, Move, SlidersHorizontal, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SignatureOverlayProps {
    referenceUrl: string | null;
    suspectUrl: string | null;
}

export function SignatureOverlay({ referenceUrl, suspectUrl }: SignatureOverlayProps) {
    const [opacity, setOpacity] = useState(50);
    const [isGhostMode, setIsGhostMode] = useState(true);
    const [showReference, setShowReference] = useState(true);
    const [showSuspect, setShowSuspect] = useState(true);

    if (!referenceUrl || !suspectUrl) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0a0c10]/40 backdrop-blur-sm text-center p-6">
                <div className="bg-white/5 p-4 rounded-full mb-4">
                    <Maximize2 className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-sm font-bold text-white/40 uppercase tracking-widest">
                    Upload Both Signatures
                </p>
                <p className="text-[10px] text-white/20 mt-1 uppercase tracking-tighter">
                    To Initialize Ghost Overlay Audit
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Control Bar */}
            <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-2 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsGhostMode(true)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            isGhostMode ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-white/40 hover:text-white/60"
                        )}
                    >
                        <Layers className="w-3.5 h-3.5" />
                        Ghost Overlay
                    </button>
                    <button
                        onClick={() => setIsGhostMode(false)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            !isGhostMode ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-white/40 hover:text-white/60"
                        )}
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                        Detail Zoom
                    </button>
                </div>

                <div className="flex items-center gap-4 px-3 border-l border-white/5">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowReference(!showReference)}
                            className={cn("p-1.5 rounded-md transition-all", showReference ? "text-blue-500 bg-blue-500/10" : "text-white/20")}
                            title="Toggle Reference"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShowSuspect(!showSuspect)}
                            className={cn("p-1.5 rounded-md transition-all", showSuspect ? "text-red-500 bg-red-500/10" : "text-white/20")}
                            title="Toggle Suspect"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Viewport */}
            <div className="relative aspect-video w-full rounded-2xl border border-white/5 bg-[#0a0c10] overflow-hidden shadow-2xl group">
                <AnimatePresence mode="wait">
                    {isGhostMode ? (
                        <motion.div
                            key="ghost"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full h-full flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"
                        >
                            {/* Grid Lines */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div className="absolute top-1/2 w-full h-px bg-blue-500/50" />
                                <div className="absolute left-1/2 h-full w-px bg-blue-500/50" />
                            </div>

                            {/* Reference Signature (Bottom Layer) */}
                            <div
                                className={cn(
                                    "absolute transition-opacity duration-300 pointer-events-none filter brightness-110",
                                    showReference ? "opacity-100" : "opacity-0"
                                )}
                                style={{ filter: "invert(1) grayscale(1) contrast(1.5)" }}
                            >
                                <img
                                    src={referenceUrl}
                                    alt="Reference"
                                    className="max-h-[300px] max-w-full mix-blend-screen opacity-60"
                                />
                            </div>

                            {/* Suspect Signature (Top Layer with Opacity Control) */}
                            <div
                                className={cn(
                                    "absolute transition-opacity duration-300 pointer-events-none",
                                    showSuspect ? "opacity-100" : "opacity-0"
                                )}
                                style={{
                                    opacity: opacity / 100,
                                    filter: "invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.2)"
                                }}
                            >
                                <img
                                    src={suspectUrl}
                                    alt="Suspect"
                                    className="max-h-[300px] max-w-full mix-blend-screen"
                                />
                            </div>

                            <div className="absolute top-4 left-6 flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Master Reference</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Suspect Target</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full grid grid-cols-2 gap-[1px] bg-white/5"
                        >
                            <div className="relative bg-[#0a0c10] flex items-center justify-center p-6 group/ref overflow-hidden">
                                <div className="absolute top-4 left-4 z-10 text-[9px] font-black text-white/30 uppercase tracking-[0.2em] bg-black/40 px-2 py-1 rounded">Reference</div>
                                <img
                                    src={referenceUrl}
                                    alt="REF Detail"
                                    className="max-h-full max-w-full filter invert brightness-125 transition-transform duration-500 group-hover/ref:scale-125 cursor-zoom-in"
                                />
                            </div>
                            <div className="relative bg-[#0a0c10] flex items-center justify-center p-6 group/sus overflow-hidden">
                                <div className="absolute top-4 left-4 z-10 text-[9px] font-black text-red-500/50 uppercase tracking-[0.2em] bg-black/40 px-2 py-1 rounded">Suspect</div>
                                <img
                                    src={suspectUrl}
                                    alt="SUS Detail"
                                    className="max-h-full max-w-full filter invert brightness-125 transition-transform duration-500 group-hover/sus:scale-125 cursor-zoom-in"
                                />
                            </div>
                        </motion.div>
                    )
                    }
                </AnimatePresence>

                {/* Floating Indicator */}
                <div className="absolute bottom-4 right-6 flex items-center gap-2 text-white/30">
                    <Move className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Forensic Alignment Active</span>
                </div>
            </div>

            {/* Opacity Slider (Only in Ghost Mode) */}
            <AnimatePresence>
                {isGhostMode && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white/[0.03] border border-white/5 p-4 rounded-xl space-y-3"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-3 h-3 text-blue-400" />
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Ghost Density Control</span>
                            </div>
                            <span className="text-[11px] font-black text-blue-500">{opacity}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={opacity}
                            onChange={(e) => setOpacity(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-tighter">
                            <span>Pure Reference</span>
                            <span>Perfect Alignment Audit</span>
                            <span>Pure Suspect</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
