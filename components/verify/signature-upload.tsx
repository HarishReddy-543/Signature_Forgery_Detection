"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, ImageIcon, CheckCircle2, FileImage, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface SignatureUploadProps {
  label: string;
  description: string;
  onImageSelect: (file: File | null, preview: string | null) => void;
  preview: string | null;
  sampleUrls?: { label: string; url: string; filename: string; color?: string }[];
}

export function SignatureUpload({
  label,
  description,
  onImageSelect,
  preview,
  sampleUrls,
}: SignatureUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageSelect(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageSelect(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const handleRemove = useCallback(() => {
    onImageSelect(null, null);
    if (inputRef.current) inputRef.current.value = "";
  }, [onImageSelect]);

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    inputRef.current?.click();
  };

  const handleLoadSample = async (
    e: React.MouseEvent,
    url: string,
    filename: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingSample(filename);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch sample");
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/png" });
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(file, reader.result as string);
        setLoadingSample(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Sample load error:", err);
      setLoadingSample(null);
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-[20px] border border-white/5 bg-[#0d0f14] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.03] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-1.5 rounded-lg border border-green-500/20">
                  <CheckCircle2 size={16} className="text-green-500" />
                </div>
                <span className="text-sm font-black text-white/90 tracking-tight">
                  {label} (Ready)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 px-3 gap-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-all"
                onClick={handleRemove}
              >
                <X size={14} />
                Clear
              </Button>
            </div>

            {/* Image Preview */}
            <div className="p-8 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.02] to-transparent">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative group"
              >
                <img
                  src={preview}
                  alt="Signature forensic target"
                  className="max-h-64 rounded-xl object-contain shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/5 transition-transform duration-500 group-hover:scale-[1.02]"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 rounded-xl shadow-inner pointer-events-none" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed p-8 transition-all duration-300",
              isDragging
                ? "border-blue-500 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                : "border-white/10 bg-white/[0.02] hover:border-blue-500/50 hover:bg-white/[0.04] shadow-inner"
            )}
          >
            {/* Hidden real file input */}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 shadow-xl mb-4">
              {isDragging ? (
                <FileImage className="h-7 w-7 text-blue-500 animate-bounce" />
              ) : (
                <Upload className="h-7 w-7 text-muted-foreground" />
              )}
            </div>

            <p className="text-base font-black text-white/90 tracking-tight text-center">
              {label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground font-medium bg-white/[0.03] px-3 py-1 rounded-full border border-white/5 text-center">
              {description}
            </p>

            {/* Dataset Sample Buttons (visible inside upload zone) */}
            {sampleUrls && sampleUrls.length > 0 && (
              <div className="mt-5 w-full space-y-2">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-center mb-3">
                  — Try a Dataset Sample —
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {sampleUrls.map((sample) => (
                    <button
                      key={sample.filename}
                      type="button"
                      disabled={!!loadingSample}
                      onClick={(e) =>
                        handleLoadSample(e, sample.url, sample.filename)
                      }
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                        sample.color === "emerald"
                          ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95"
                          : sample.color === "rose"
                          ? "border-rose-500/40 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 active:scale-95"
                          : "border-blue-500/40 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 active:scale-95",
                        loadingSample === sample.filename && "opacity-60 cursor-wait"
                      )}
                    >
                      <FlaskConical size={11} />
                      {loadingSample === sample.filename
                        ? "Loading…"
                        : sample.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload from gallery/files button */}
            <button
              type="button"
              onClick={handleBrowseClick}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white/50 border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:text-white/80 transition-all active:scale-95"
            >
              <ImageIcon size={12} />
              Or browse files / gallery
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
