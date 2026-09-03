"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  User,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DatasetItem {
  filename: string;
  type: "genuine" | "forged";
  person: number;
  sample: number;
  label: string;
  url: string;
  fallbackUrl: string;
}

interface DatasetStats {
  total: number;
  genuineCount: number;
  forgedCount: number;
  totalSigners: number;
  samplesPerSigner: number;
}

interface DatasetBrowserProps {
  onSelectTarget: (file: File, preview: string) => void;
  onSelectReference?: (file: File, preview: string) => void;
  selectedTargetName?: string | null;
  selectedReferenceName?: string | null;
  isCompareMode?: boolean;
}

export function DatasetBrowser({
  onSelectTarget,
  onSelectReference,
  selectedTargetName,
  selectedReferenceName,
  isCompareMode = false,
}: DatasetBrowserProps) {
  const [items, setItems] = useState<DatasetItem[]>([]);
  const [stats, setStats] = useState<DatasetStats>({
    total: 2640,
    genuineCount: 1320,
    forgedCount: 1320,
    totalSigners: 55,
    samplesPerSigner: 24,
  });
  const [total, setTotal] = useState(2640);
  const [totalPages, setTotalPages] = useState(110);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "genuine" | "forged">("all");
  const [selectedPerson, setSelectedPerson] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingItem, setLoadingItem] = useState<string | null>(null);

  // Generate list of 55 signers
  const signers = useMemo(() => {
    return Array.from({ length: 55 }, (_, i) => i + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    params.set("type", filter);
    params.set("page", page.toString());
    params.set("per_page", "24");
    if (selectedPerson !== "all") {
      params.set("person", selectedPerson);
    }
    if (search.trim()) {
      params.set("search", search.trim());
    }

    fetch(`/api/dataset?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (!isCancelled) {
          setItems(data.items || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
          if (data.datasetStats) {
            setStats(data.datasetStats);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load dataset items:", err);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [filter, page, selectedPerson, search]);

  const loadSignatureFile = async (
    item: DatasetItem,
    target: "target" | "reference"
  ) => {
    setLoadingItem(`${item.filename}-${target}`);
    try {
      // Try primary CDN first, fallback to raw GitHub if needed
      let res = await fetch(item.url);
      if (!res.ok) {
        res = await fetch(item.fallbackUrl);
      }
      const blob = await res.blob();
      const file = new File([blob], item.filename, { type: "image/png" });

      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result as string;
        if (target === "target") {
          onSelectTarget(file, preview);
        } else if (onSelectReference) {
          onSelectReference(file, preview);
        }
        setLoadingItem(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Failed to fetch signature image:", err);
      setLoadingItem(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Overview Stats Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-blue-950/40 border border-blue-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-black uppercase tracking-wider text-white">
            Full Forensic Dataset:
          </span>
          <span className="text-xs font-bold text-blue-300">
            {stats.total.toLocaleString()} Signatures
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
            <CheckCircle2 size={12} /> {stats.genuineCount.toLocaleString()} Genuine
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-1">
            <AlertTriangle size={12} /> {stats.forgedCount.toLocaleString()} Forged
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 flex items-center gap-1">
            <User size={12} /> 55 Signers (24 each)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Type Filter Buttons */}
        <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/10 shrink-0">
          {(["all", "genuine", "forged"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                filter === f
                  ? f === "genuine"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : f === "forged"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              {f === "all"
                ? `All (${stats.total})`
                : f === "genuine"
                ? `Genuine (${stats.genuineCount})`
                : `Forged (${stats.forgedCount})`}
            </button>
          ))}
        </div>

        {/* Signer Dropdown */}
        <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 rounded-xl px-2.5 py-1">
          <User className="w-3.5 h-3.5 text-white/40" />
          <select
            value={selectedPerson}
            onChange={(e) => {
              setSelectedPerson(e.target.value);
              setPage(1);
            }}
            className="bg-transparent text-xs font-bold text-white/80 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#0f1117] text-white">
              All Signers (1-55)
            </option>
            {signers.map((num) => (
              <option key={num} value={num.toString()} className="bg-[#0f1117] text-white">
                Person {num}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by filename or person..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-9 pl-9 text-xs bg-white/[0.03] border-white/10 rounded-xl text-white placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Signatures Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <span className="text-sm font-medium">Loading dataset signatures...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
          <p className="text-sm">No signatures matched your filter criteria.</p>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setFilter("all");
              setSelectedPerson("all");
              setSearch("");
              setPage(1);
            }}
            className="text-xs text-blue-400 mt-2"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((item) => {
            const isSelectedTarget = selectedTargetName === item.filename;
            const isSelectedRef = selectedReferenceName === item.filename;
            const isBusyTarget = loadingItem === `${item.filename}-target`;
            const isBusyRef = loadingItem === `${item.filename}-reference`;

            return (
              <div
                key={item.filename}
                className={cn(
                  "relative flex flex-col rounded-2xl overflow-hidden border-2 bg-[#0c0e14] transition-all",
                  isSelectedTarget
                    ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    : isSelectedRef
                    ? "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    : item.type === "genuine"
                    ? "border-emerald-500/20 hover:border-emerald-500/50"
                    : "border-rose-500/20 hover:border-rose-500/50"
                )}
              >
                {/* Badge Tag */}
                <div
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1 text-[10px] font-black tracking-wider uppercase",
                    item.type === "genuine"
                      ? "bg-emerald-500/15 text-emerald-400 border-b border-emerald-500/20"
                      : "bg-rose-500/15 text-rose-400 border-b border-rose-500/20"
                  )}
                >
                  <span>{item.type === "genuine" ? "✓ Genuine" : "✗ Forged"}</span>
                  <span className="text-white/40">P{item.person}#{item.sample}</span>
                </div>

                {/* Signature Preview Thumbnail */}
                <div className="relative aspect-[16/10] p-2 flex items-center justify-center bg-white/[0.02]">
                  {isBusyTarget || isBusyRef ? (
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.label}
                      className="w-full h-full object-contain filter invert opacity-90 contrast-125"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to raw github CDN if jsdelivr is slow
                        const target = e.currentTarget;
                        if (target.src !== item.fallbackUrl) {
                          target.src = item.fallbackUrl;
                        }
                      }}
                    />
                  )}

                  {isSelectedTarget && (
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-blue-500 text-[9px] font-black text-white shadow">
                      TARGET
                    </div>
                  )}
                  {isSelectedRef && (
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-purple-500 text-[9px] font-black text-white shadow">
                      REF
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-1.5 bg-white/[0.01] border-t border-white/5 flex flex-col gap-1">
                  <button
                    type="button"
                    disabled={!!loadingItem}
                    onClick={() => loadSignatureFile(item, "target")}
                    className={cn(
                      "w-full py-1 px-2 rounded-lg text-[11px] font-bold text-center transition-all active:scale-95",
                      isSelectedTarget
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border border-blue-500/30"
                    )}
                  >
                    {isBusyTarget ? "Loading..." : isSelectedTarget ? "Selected Target" : "Select Target"}
                  </button>

                  {isCompareMode && (
                    <button
                      type="button"
                      disabled={!!loadingItem}
                      onClick={() => loadSignatureFile(item, "reference")}
                      className={cn(
                        "w-full py-1 px-2 rounded-lg text-[11px] font-bold text-center transition-all active:scale-95",
                        isSelectedRef
                          ? "bg-purple-600 text-white"
                          : "bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30"
                      )}
                    >
                      {isBusyRef ? "Loading..." : isSelectedRef ? "Selected Reference" : "Set as Reference"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 gap-1 text-xs font-bold border-white/10"
            >
              <ChevronLeft size={14} /> Previous
            </Button>
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

          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
            <span>
              Page <strong className="text-white">{page}</strong> of{" "}
              <strong className="text-white">{totalPages}</strong>
            </span>
            <span className="text-white/30">•</span>
            <span>
              Showing {(page - 1) * 24 + 1} -{" "}
              {Math.min(page * 24, total)} of {total.toLocaleString()} signatures
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
