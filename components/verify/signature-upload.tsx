"use client";

import { useState, useCallback } from "react";
import { Upload, X, ImageIcon, CheckCircle2, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface SignatureUploadProps {
  label: string;
  description: string;
  onImageSelect: (file: File | null, preview: string | null) => void;
  preview: string | null;
}

export function SignatureUpload({
  label,
  description,
  onImageSelect,
  preview,
}: SignatureUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

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
  }, [onImageSelect]);

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
            {/* Header matching reference image */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.03] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-1.5 rounded-lg border border-green-500/20">
                  <CheckCircle2 size={16} className="text-green-500" />
                </div>
                <span className="text-sm font-black text-white/90 tracking-tight">{label} (Ready)</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 gap-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-all"
                onClick={handleRemove}
              >
                <X size={14} />
                Clear
              </Button>
            </div>

            {/* Image Preview Area */}
            <div className="p-8 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.02] to-transparent">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative group"
              >
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Signature forensic target"
                  className="max-h-64 rounded-xl object-contain shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/5 transition-transform duration-500 group-hover:scale-[1.02]"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 rounded-xl shadow-inner pointer-events-none" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed p-12 transition-all duration-300",
              isDragging
                ? "border-blue-500 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                : "border-white/10 bg-white/[0.02] hover:border-blue-500/50 hover:bg-white/[0.04] shadow-inner"
            )}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 shadow-xl mb-6">
              {isDragging ? (
                <FileImage className="h-8 w-8 text-blue-500 animate-bounce" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground transition-transform group-hover:-translate-y-1" />
              )}
            </div>
            <p className="text-lg font-black text-white/90 tracking-tight">
              {isDragging ? "Drop to Analyze" : label}
            </p>
            <p className="mt-2 text-xs text-muted-foreground font-medium bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">
              {description}
            </p>
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  );
}
