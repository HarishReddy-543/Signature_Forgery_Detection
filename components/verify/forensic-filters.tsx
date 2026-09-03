"use client";

import { getApiUrl } from "@/lib/api-config";
import { useState } from "react";
import { Scissors, Wind, RefreshCcw, Loader2, Sparkles, Binary, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ForensicFiltersProps {
    imageUrl: string | null;
    onFilterApply: (filteredUrl: string) => void;
    onReset: () => void;
}

export function ForensicFilters({ imageUrl, onFilterApply, onReset }: ForensicFiltersProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const applyFilter = async (filterType: "contrast" | "noise_removal") => {
        if (!imageUrl) return;
        setLoading(filterType);

        try {
            // 1. Fetch the image blob from the preview URL (or data URL)
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            // 2. Prepare FormData
            const formData = new FormData();
            formData.append("image", blob, "signature.png");
            formData.append("filter_type", filterType);

            // 3. Call backend API
            const apiResponse = await fetch(getApiUrl("/api/filter"), {
                method: "POST",
                body: formData,
            });

            const data = await apiResponse.json();

            if (data.image) {
                onFilterApply(data.image);
            } else if (data.error) {
                console.error("Filter error:", data.error);
            }
        } catch (error) {
            console.error("Filter request failed:", error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-14 flex flex-col items-center justify-center gap-1 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group relative overflow-hidden",
                        loading === "noise_removal" && "opacity-50"
                    )}
                    onClick={() => applyFilter("noise_removal")}
                    disabled={!imageUrl || !!loading}
                >
                    {loading === "noise_removal" ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    ) : (
                        <Wind className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">Grain Removal</span>
                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Sparkles className="w-2 h-2 text-blue-400" />
                    </div>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-14 flex flex-col items-center justify-center gap-1 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group relative overflow-hidden",
                        loading === "contrast" && "opacity-50"
                    )}
                    onClick={() => applyFilter("contrast")}
                    disabled={!imageUrl || !!loading}
                >
                    {loading === "contrast" ? (
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                    ) : (
                        <Zap className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">Stroke Sharpness</span>
                    <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Binary className="w-2 h-2 text-indigo-400" />
                    </div>
                </Button>
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 text-[9px] font-bold text-white/20 hover:text-white/40 uppercase tracking-[0.2em]"
                onClick={onReset}
                disabled={!imageUrl || !!loading}
            >
                <RefreshCcw className="w-3 h-3 mr-2" />
                Restore Original Scan
            </Button>

            <div className="bg-blue-500/5 border border-blue-500/10 p-2 rounded-lg">
                <p className="text-[8px] font-bold text-blue-400/60 leading-relaxed text-center uppercase tracking-tight">
                    Advanced filters isolate stroke geometry without affecting AI core logic units.
                </p>
            </div>
        </div>
    );
}
