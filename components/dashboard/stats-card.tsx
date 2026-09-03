import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
  hoverColor?: "emerald" | "blue" | "red" | "amber";
}

const colorConfig = {
  emerald: "group-hover:border-emerald-400 group-hover:bg-emerald-400/10",
  blue: "group-hover:border-blue-400 group-hover:bg-blue-400/10",
  red: "group-hover:border-red-400 group-hover:bg-red-400/10",
  amber: "group-hover:border-amber-400 group-hover:bg-amber-400/10",
};

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  hoverColor = "blue",
}: StatsCardProps) {
  const glowColors = {
    emerald: {
      primary: "rgb(16,185,129)",
      faint: "rgba(16,185,129,0.5)",
      atmosphere: "rgba(16,185,129,0.15)"
    },
    blue: {
      primary: "rgb(59,130,246)",
      faint: "rgba(59,130,246,0.5)",
      atmosphere: "rgba(59,130,246,0.15)"
    },
    red: {
      primary: "rgb(239,68,68)",
      faint: "rgba(239,68,68,0.5)",
      atmosphere: "rgba(239,68,68,0.15)"
    },
    amber: {
      primary: "rgb(245,158,11)",
      faint: "rgba(245,158,11,0.5)",
      atmosphere: "rgba(245,158,11,0.15)"
    },
  };

  const colors = glowColors[hoverColor];

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={{
        initial: { y: 0, scale: 1, boxShadow: "0 0 0px transparent" },
        hover: {
          y: -10,
          scale: 1.025,
          boxShadow: `0 15px 80px ${colors.atmosphere}`,
        },
        tap: {
          scale: 0.94,
          boxShadow: `0 0 50px ${colors.primary}, 0 0 110px ${colors.faint}, 0 0 250px ${colors.atmosphere}`,
          borderColor: colors.primary,
          transition: { type: "spring", stiffness: 600, damping: 15 }
        }
      }}
      className={cn(
        "rounded-2xl border border-white/5 bg-[#010101] p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden",
        "border-white/10 active:border-white/100"
      )}
    >
      {/* Infinite Glow - Ultra Atmospheric Background */}
      <motion.div
        variants={{
          initial: { opacity: 0, scale: 0.5 },
          hover: { opacity: 0.45, scale: 1.8 },
          tap: { opacity: 1, scale: 4.0 }
        }}
        className={cn(
          "absolute -right-12 -top-12 w-64 h-64 blur-[100px] transition-all duration-700 rounded-full z-0 pointer-events-none",
          hoverColor === "emerald" && "bg-emerald-500/40",
          hoverColor === "blue" && "bg-blue-500/40",
          hoverColor === "red" && "bg-red-500/40",
          hoverColor === "amber" && "bg-amber-500/40",
        )}
      />

      <div className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-[0.2] transition-all duration-700 rotate-[20deg]">
        <Icon className="h-32 w-32" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 group-hover:text-white/100 transition-all duration-300">
          {title}
        </span>
        <motion.div
          variants={{
            initial: { rotate: 0, scale: 1 },
            hover: { rotate: 12, scale: 1.2 },
            tap: { scale: 0.75, rotate: -20 }
          }}
          className={cn(
            "p-2.5 rounded-xl bg-white/5 transition-all duration-300 border border-white/5",
            "text-white/10 group-hover:bg-white/10 group-hover:border-white/20",
            hoverColor === "emerald" && "group-hover:text-emerald-400 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.7)]",
            hoverColor === "blue" && "group-hover:text-blue-400 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]",
            hoverColor === "red" && "group-hover:text-red-400 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.7)]",
            hoverColor === "amber" && "group-hover:text-amber-400 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.7)]",
          )}
        >
          <Icon className="h-4 w-4" />
        </motion.div>
      </div>

      <div className="mt-6 relative z-10 flex items-baseline gap-3">
        <motion.span
          className="text-4xl font-black text-white tracking-tight transition-all duration-300"
        >
          {value}
        </motion.span>
        {change && (
          <motion.span
            variants={{
              hover: { x: 5, scale: 1.1 }
            }}
            className={cn(
              "text-[10px] font-black px-2 py-0.5 rounded-full border border-white/10 shadow-lg",
              changeType === "positive" && "text-emerald-400 bg-emerald-400/20",
              changeType === "negative" && "text-red-400 bg-red-400/20",
              changeType === "neutral" && "text-white/30 bg-white/10"
            )}
          >
            {change}
          </motion.span>
        )}
      </div>

      {description && (
        <p className="mt-4 text-[10px] font-black text-white/40 group-hover:text-white/90 transition-all duration-700 tracking-[0.2em] uppercase">
          {description}
        </p>
      )}

      {/* Extreme Energy Pulse Line */}
      <motion.div
        variants={{
          initial: { width: "0%", height: "3px", opacity: 0.1 },
          hover: { width: "100%", height: "3.5px", opacity: 0.8 },
          tap: { width: "100%", height: "5px", opacity: 1 }
        }}
        className={cn(
          "absolute bottom-0 left-0 transition-all duration-700",
          hoverColor === "emerald" && "bg-emerald-400 shadow-[0_0_30px_#10b981]",
          hoverColor === "blue" && "bg-blue-400 shadow-[0_0_30px_#3b82f6]",
          hoverColor === "red" && "bg-red-400 shadow-[0_0_30px_#ef4444]",
          hoverColor === "amber" && "bg-amber-400 shadow-[0_0_30px_#f59e0b]",
        )}
      />

      {/* Surface Gloss Rim Light */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
    </motion.div>
  );
}
