"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatasetItem {
  url: string;
  type: "genuine" | "forged";
  filename: string;
  label: string;
}

interface DatasetBrowserProps {
  onSelectSignature: (file: File, preview: string, type: "genuine" | "forged") => void;
  selectedFilename?: string | null;
}

export function DatasetBrowser({ onSelectSignature, selectedFilename }: DatasetBrowserProps) {
  const [items, setItems] = useState<DatasetItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "genuine" | "forged">("all");
  const [loading, setLoading] = useState(true);
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const [genuineCount, setGenuineCount] = useState(0);
  const [forgedCount, setForgedCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dataset?type=${filter}&page=${page}&per_page=16`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setGenuineCount(data.genuineCount || 0);
        setForgedCount(data.forgedCount || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter, page]);

  const handleSelect = async (item: DatasetItem) => {
    setLoadingItem(item.filename);
    try {
      const res = await fetch(item.url);
      const blob = await res.blob();
      const file = new File([blob], item.filename, { type: "image/png" });
      const reader = new FileReader();
      reader.onload = () => {
        onSelectSignature(file, reader.result as string, item.type as "genuine" | "forged");
        setLoadingItem(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Failed to load dataset item:", err);
      setLoadingItem(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-bold text-white/60">
          Total: <span className="text-white">{genuineCount + forgedCount}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
          <CheckCircle2 size={11} /> Genuine: {genuineCount}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400">
          <AlertTriangle size={11} /> Forged: {forgedCount}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/10 w-fit">
        {(["all", "genuine", "forged"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => { setFilter(f); setPage(1); }}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
              filter === f
                ? f === "genuine"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : f === "forged"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {f === "all" ? `All (${genuineCount + forgedCount})` : f === "genuine" ? `Genuine (${genuineCount})` : `Forged (${forgedCount})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm font-medium">Loading dataset...</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
          {items.map((item) => {
            const isSelected = selectedFilename === item.filename;
            const isLoading = loadingItem === item.filename;
            return (
              <button
                key={item.filename}
                type="button"
                onClick={() => handleSelect(item)}
                disabled={!!loadingItem}
                className={cn(
                  "relative flex flex-col items-center rounded-xl overflow-hidden border-2 transition-all active:scale-95 group",
                  isSelected
                    ? item.type === "genuine"
                      ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                      : "border-rose-500 shadow-lg shadow-rose-500/20"
                    : item.type === "genuine"
                    ? "border-emerald-500/20 hover:border-emerald-500/60"
                    : "border-rose-500/20 hover:border-rose-500/60",
                  "bg-white/[0.02] hover:bg-white/[0.06]"
                )}
              >
                {isLoading ? (
                  <div className="w-full aspect-square flex items-center justify-center bg-white/[0.03]">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.label}
                    className="w-full aspect-square object-contain p-1 bg-white/5"
                    loading="lazy"
                  />
                )}
                <div className={cn(
                  "w-full px-1 py-0.5 text-center",
                  item.type === "genuine" ? "bg-emerald-500/10" : "bg-rose-500/10"
                )}>
                  <span className={cn(
                    "text-[9px] font-bold truncate block",
                    item.type === "genuine" ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {item.type === "genuine" ? "✓ G" : "✗ F"} {item.filename.replace(".png","").split("_").slice(-2).join("-")}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-8 gap-1 text-xs font-bold border-white/10"
          >
            <ChevronLeft size={14} /> Prev
          </Button>
          <span className="text-xs text-muted-foreground font-medium">
            Page {page} / {totalPages} &nbsp;·&nbsp; {total} signatures
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 gap-1 text-xs font-bold border-white/10"
          >
            Next <ChevronRight size={14} />
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center pt-1 border-t border-white/5">
        Tap any signature to load it as the verification target
      </p>
    </div>
  );
}
