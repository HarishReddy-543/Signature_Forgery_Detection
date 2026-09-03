"use client";

import { useEffect, useRef } from "react";

import { Zap, ShieldAlert, Fingerprint } from "lucide-react";

interface SignatureHeatmapProps {
  imageUrl: string | null;
  regions?: { x: number; y: number; severity: number; type?: "focus" | "divergence" }[];
}

export function SignatureHeatmap({ imageUrl, regions }: SignatureHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (regions && regions.length > 0) {
        regions.forEach((region) => {
          // Convert percentage to absolute coordinates
          const absX = (region.x / 100) * canvas.width;
          const absY = (region.y / 100) * canvas.height;
          const intensity = region.severity || 0.5;
          const type = region.type || "focus";

          // Divergence (Red) | Focus (Blue/Indigo)
          const color = type === "divergence" ? "239, 68, 68" : "99, 102, 241";

          const radius = Math.min(canvas.width, canvas.height) * 0.12;
          const gradient = ctx.createRadialGradient(
            absX,
            absY,
            0,
            absX,
            absY,
            radius
          );

          // v31.1 VISUAL BOOST: Higher opacity ceiling (0.9) and richer core
          const alpha = Math.max(0, Math.min(0.95, intensity * 0.9));
          if (isNaN(alpha)) return;

          gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
          gradient.addColorStop(0.4, `rgba(${color}, ${alpha * 0.7})`); // Wider core for "Glow" effect
          gradient.addColorStop(1, `rgba(${color}, 0)`);

          ctx.fillStyle = gradient;
          ctx.fillRect(absX - radius, absY - radius, radius * 2, radius * 2);
        });
      }
    };
    img.src = imageUrl;
  }, [imageUrl, regions]);

  if (!imageUrl) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30">
        <p className="text-sm text-muted-foreground">
          Upload a signature to see heatmap analysis
        </p>
      </div>
    );
  }

  const hasDivergence = regions?.some(r => r.type === "divergence");

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0a0c10] p-4 relative group shadow-inner">
        <canvas
          ref={canvasRef}
          className="mx-auto max-h-72 max-w-full object-contain filter brightness-110 contrast-125"
        />

        {/* Absolute Legend Overlay */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 scale-90 origin-top-right">
          {(!hasDivergence || (regions && regions.some(r => r.type === "focus"))) && (
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-xl animate-in fade-in slide-in-from-right-2 duration-500">
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Neural Focus</span>
            </div>
          )}
          {hasDivergence && (
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-500/20 shadow-xl animate-in fade-in slide-in-from-right-2 duration-500">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Structural Divergence</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
          <Zap className="w-4 h-4 text-indigo-400" />
          <div className="text-[10px] font-bold text-white/40 leading-none">
            <span className="block text-white/80 mb-0.5">Saliency Map</span>
            AI Attention Zones
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
          <Fingerprint className="w-4 h-4 text-red-400" />
          <div className="text-[10px] font-bold text-white/40 leading-none">
            <span className="block text-white/80 mb-0.5">Forensic Audit</span>
            Shape Deviations
          </div>
        </div>
      </div>
    </div>
  );
}
