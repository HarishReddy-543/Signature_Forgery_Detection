"use client";

import { HistoryTable } from "@/components/dashboard/history-table";
import { TrainingPanel } from "@/components/dashboard/training-panel";

import { useState, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { SignatureUpload } from "@/components/verify/signature-upload";
import { AnalysisResult } from "@/components/verify/analysis-result";
import { SignatureHeatmap } from "@/components/verify/signature-heatmap";
import { SignatureOverlay } from "@/components/verify/signature-overlay";
import { ForensicFilters } from "@/components/verify/forensic-filters";
import { BiometricCanvas } from "@/components/verify/biometric-canvas";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, RotateCcw, Download, Share2, Loader2, Zap, Fingerprint, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { getApiUrl } from "@/lib/api-config";

export default function VerifyPage() {
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [filteredSignaturePreview, setFilteredSignaturePreview] = useState<string | null>(null);
  const [filteredReferencePreview, setFilteredReferencePreview] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<"genuine" | "forged" | "inconclusive" | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [heatmapRegions, setHeatmapRegions] = useState<any[]>([]);
  const [details, setDetails] = useState<any>(null);

  const handleSignatureSelect = (file: File | null, preview: string | null) => {
    setSignatureFile(file);
    setSignaturePreview(preview);
    setFilteredSignaturePreview(preview);
    setResult(null);
    setConfidence(0);
    setHeatmapRegions([]);
    setDetails(null);
  };

  const handleReferenceSelect = (file: File | null, preview: string | null) => {
    setReferenceFile(file);
    setReferencePreview(preview);
    setFilteredReferencePreview(preview);
    setResult(null);
    setConfidence(0);
    setHeatmapRegions([]);
    setDetails(null);
  };

  const loadSampleSignature = async (type: "genuine" | "forged") => {
    const samplePath = type === "genuine" ? "/samples/genuine-sample-1.png" : "/samples/forged-sample-1.png";
    const filename = type === "genuine" ? "original_1_1.png" : "forgeries_1_1.png";
    try {
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "image/png" });
      handleSignatureSelect(file, samplePath);
      toast.success(`Loaded ${type === "genuine" ? "Genuine" : "Forged"} Test Signature`, {
        description: "Click 'Initialize Analysis' below to run verification."
      });
    } catch (err) {
      console.error("Failed to load sample signature:", err);
      toast.error("Could not load sample signature");
    }
  };

  const loadSampleReference = async () => {
    const samplePath = "/samples/reference-sample.png";
    try {
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const file = new File([blob], "original_1_3.png", { type: "image/png" });
      handleReferenceSelect(file, samplePath);
      toast.success("Loaded Genuine Reference Signature");
    } catch (err) {
      console.error("Failed to load reference signature:", err);
    }
  };

  const handleAnalyze = async () => {
    if (!signatureFile) return;
    if (isCompareMode && !referenceFile) {
      toast.error("Missing Reference", {
        description: "Please upload a genuine reference signature to compare against."
      });
      return;
    }

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("signature", signatureFile);
    if (isCompareMode && referenceFile) {
      formData.append("reference", referenceFile);
    }

    try {
      // Retry logic: try up to 3 times with 1 second delay
      let lastError;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await fetch(getApiUrl("/api/verify"), {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Analysis failed");
          }

          const data = await response.json();

          if (data.error) {
            setResult(null);
            setDetails(null);
            setHeatmapRegions([]);

            if (data.error_type === "validation_failed") {
              toast.error("Signature Validation Failed", {
                description: data.error,
              });
            } else {
              toast.error(data.error);
            }
            setIsAnalyzing(false);
            return;
          }

          setResult(data.result.toLowerCase() as "genuine" | "forged" | "inconclusive");
          setConfidence(data.confidence);
          setHeatmapRegions(data.heatmap || []);
          setDetails(data.details);
          toast.success("Analysis Complete", {
            description: isCompareMode
              ? `Compare Result: ${data.result}`
              : `The signature appears to be ${data.result}.`,
          });
          setIsAnalyzing(false);
          return; // Success!

        } catch (error) {
          lastError = error;
          console.error(`Attempt ${attempt}/3 failed:`, error);

          if (attempt < 3) {
            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      // All retries failed
      throw lastError;

    } catch (error) {
      console.error("Error analyzing signature:", error);
      toast.error("Analysis Failed", {
        description: "Please check if the backend server is running and try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSignatureFile(null);
    setSignaturePreview(null);
    setReferenceFile(null);
    setReferencePreview(null);
    setResult(null);
    setConfidence(0);
    setHeatmapRegions([]);
    setDetails(null);
  };

  const handleDownloadReport = () => {
    if (!result) return;

    const reportContent = `
=========================================
VERISIGN AI - FORENSIC ANALYSIS REPORT
=========================================
Date: ${new Date().toLocaleString()}
Mode: ${isCompareMode ? "1-TO-1 COMPARISON" : "GENERAL VERIFICATION"}
Status: ${result.toUpperCase()}
Confidence: ${confidence}%
Forensic Hash: ${details.forensic_hash}
=========================================
FEATURE METRICS:
- Stroke Consistency: ${details?.stroke_consistency || details?.strokeConsistency || 0}%
- Pressure Pattern: ${details?.pressure_pattern || details?.pressurePattern || 0}%
- Geometry Match: ${details?.geometry_match || details?.geometryMatch || 0}%
- Spatial Relation: ${details?.spatial_relation || details?.spatialRelation || 0}%
-----------------------------------------
TECHNICAL ANALYSIS:
Method: Neural Siamese + Hybrid Verification
Version: v7.2.4-PRO
-----------------------------------------
This report is generated for forensic audit purposes.
=========================================
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Forensic_Report_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Forensic Report Exported", {
      description: "A text-based forensic audit has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-0 lg:pl-64">
        <Header
          title="Verify Signature"
          description="Upload and analyze signatures for authenticity"
        />
        <main className="p-6 space-y-8">

          {/* Main Verification Section */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column (2/3 width for density) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-md p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                    <div className="w-2 h-6 bg-blue-500 rounded-full" />
                    Upload Verification Target
                  </h2>
                  <div className="flex items-center gap-2 bg-secondary/20 p-1.5 rounded-lg border border-border/50">
                    <Button
                      variant={!isCompareMode ? "default" : "ghost"}
                      size="sm"
                      className="h-8 font-bold"
                      onClick={() => setIsCompareMode(false)}
                    >
                      Single Mode
                    </Button>
                    <Button
                      variant={isCompareMode ? "default" : "ghost"}
                      size="sm"
                      className="h-8 font-bold"
                      onClick={() => setIsCompareMode(true)}
                    >
                      Compare Mode
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="bg-secondary/20 h-10 mb-4 p-1">
                    <TabsTrigger value="upload" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                      <Play className="w-3 h-3" />
                      Document Upload
                    </TabsTrigger>
                    <TabsTrigger value="biometric" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                      <Fingerprint className="w-3 h-3" />
                      Biometric Capture
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-0">
                    <div className="grid gap-6 md:grid-cols-2">
                      <SignatureUpload
                        label="Verification Target (Suspect)"
                        description="Drop, browse or tap a dataset sample below"
                        onImageSelect={handleSignatureSelect}
                        preview={signaturePreview}
                        sampleUrls={[
                          { label: "Genuine Sample", url: "/samples/genuine-sample-1.png", filename: "original_1_1.png", color: "emerald" },
                          { label: "Genuine Sample 2", url: "/samples/genuine-sample-2.png", filename: "original_1_2.png", color: "emerald" },
                          { label: "Forged Sample", url: "/samples/forged-sample-1.png", filename: "forgeries_1_1.png", color: "rose" },
                          { label: "Forged Sample 2", url: "/samples/forged-sample-2.png", filename: "forgeries_1_2.png", color: "rose" },
                        ]}
                      />
                      {isCompareMode && (
                        <SignatureUpload
                          label="Master Reference (Genuine)"
                          description="Gold-standard identity anchor — or tap a sample"
                          onImageSelect={handleReferenceSelect}
                          preview={referencePreview}
                          sampleUrls={[
                            { label: "Reference Anchor", url: "/samples/reference-sample.png", filename: "original_1_3.png", color: "blue" },
                            { label: "Genuine Ref 2", url: "/samples/genuine-sample-2.png", filename: "original_1_2.png", color: "emerald" },
                          ]}
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="biometric" className="mt-0">
                    <BiometricCanvas onCapture={handleSignatureSelect} />
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col justify-end gap-3">
                  <div className="rounded-xl border border-dashed border-border/60 p-6 flex flex-col items-center justify-center text-center bg-secondary/10">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Analysis Strategy</p>
                    <p className="text-sm font-medium text-foreground/80">
                      {isCompareMode
                        ? "Neural 1-to-1 + Forensic Differential Analysis"
                        : "Neural Siamese + Legacy Harris/SURF Hybrid Verification"}
                    </p>
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!signatureFile || (isCompareMode && !referenceFile) || isAnalyzing}
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-black rounded-xl shadow-lg shadow-blue-500/20"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Play className="mr-2 h-5 w-5 fill-current" /> {isCompareMode ? "Begin Comparison" : "Initialize Analysis"}</>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="h-12 font-bold rounded-xl border-border/50 text-muted-foreground">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Clear Workspace
                  </Button>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <TrainingPanel />
                <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-md p-6 shadow-xl">
                  <Tabs defaultValue="heatmap" className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                        Forensic Viewport
                      </h3>
                      <TabsList className="bg-secondary/20 h-8">
                        <TabsTrigger value="heatmap" className="text-[9px] font-black uppercase tracking-tighter">Neural Heatmap</TabsTrigger>
                        {isCompareMode && (
                          <TabsTrigger value="overlay" className="text-[9px] font-black uppercase tracking-tighter">Ghost Overlay</TabsTrigger>
                        )}
                      </TabsList>
                    </div>

                    <TabsContent value="heatmap" className="mt-0">
                      {result ? (
                        <SignatureHeatmap
                          imageUrl={filteredSignaturePreview}
                          regions={heatmapRegions}
                        />
                      ) : (
                        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0a0c10]/40 backdrop-blur-sm text-center p-6">
                          <div className="bg-indigo-500/10 p-4 rounded-full mb-4">
                            <Zap className="w-8 h-8 text-indigo-500/40" />
                          </div>
                          <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Awaiting Analysis</p>
                          <p className="text-[10px] text-white/20 mt-1 uppercase tracking-tighter italic">Initialize analysis to generate neural saliency map</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="overlay" className="mt-0">
                      <SignatureOverlay
                        referenceUrl={filteredReferencePreview}
                        suspectUrl={filteredSignaturePreview}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* Forensic Laboratory Controls (v43.0) */}
              <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card/10 backdrop-blur-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-foreground tracking-widest flex items-center gap-2 uppercase">
                    <Fingerprint className="w-4 h-4 text-blue-500" />
                    Forensic Laboratory
                  </h3>
                  <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Enhanced Tools</span>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-1">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                      Initialize advanced filters to isolate stroke geometry or enhance ink legibility for suspect targets.
                    </p>
                    <ForensicFilters
                      imageUrl={signaturePreview}
                      onFilterApply={(url) => setFilteredSignaturePreview(url)}
                      onReset={() => setFilteredSignaturePreview(signaturePreview)}
                    />
                  </div>
                </div>
              </div>
            </div>


            {/* Right Column (1/3 width for Result) */}

            {/* Right Column (1/3 width for Result) */}
            <div className="space-y-8">
              <AnalysisResult
                result={result}
                confidence={confidence}
                isAnalyzing={isAnalyzing}
                details={details ?? undefined}
              />

              {result && (
                <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-md p-6 shadow-xl">
                  <h3 className="mb-6 text-sm font-black text-muted-foreground uppercase tracking-widest">
                    Verification Reports
                  </h3>
                  <div className="grid gap-4">
                    <Button
                      variant="outline"
                      onClick={handleDownloadReport}
                      className="w-full h-12 justify-start font-bold rounded-xl border-border/40 bg-transparent hover:bg-white/5"
                    >
                      <Download className="mr-3 h-4 w-4 text-blue-500" />
                      Export Forensic PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* History Section at bottom */}
          <HistoryTable />
        </main>
      </div >
    </div >
  );
}
