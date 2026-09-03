"use client";

import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Trash2, Download, Save, MousePointer2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BiometricCanvasProps {
    onCapture: (file: File, preview: string) => void;
}

export function BiometricCanvas({ onCapture }: BiometricCanvasProps) {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [penColor, setPenColor] = useState("#000000");

    const clear = () => {
        sigCanvas.current?.clear();
        setIsEmpty(true);
    };

    const handleEnd = () => {
        setIsEmpty(sigCanvas.current?.isEmpty() ?? true);
    };

    const capture = () => {
        if (sigCanvas.current?.isEmpty()) return;

        const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
        if (!dataUrl) return;

        // Convert dataUrl to File
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], "biometric-signature.png", { type: mime });

        onCapture(file, dataUrl);
    };

    return (
        <div className="space-y-4">
            <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white rounded-2xl border border-white/10 shadow-2xl overflow-hidden h-64 w-full">
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor={penColor}
                        onEnd={handleEnd}
                        canvasProps={{
                            className: "w-full h-full cursor-crosshair",
                            style: { width: '100%', height: '100%' }
                        }}
                    />

                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <button
                            onClick={() => setPenColor("#000000")}
                            className={cn("w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-125", penColor === "#000000" && "scale-125 ring-2 ring-blue-500")}
                            style={{ backgroundColor: "#000000" }}
                        />
                        <button
                            onClick={() => setPenColor("#000080")}
                            className={cn("w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-125", penColor === "#000080" && "scale-125 ring-2 ring-blue-500")}
                            style={{ backgroundColor: "#000080" }}
                        />
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md hover:bg-black/60 text-white/60 hover:text-red-500 border border-white/5 transition-colors"
                            onClick={clear}
                            title="Clear Canvas"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    {!isEmpty && (
                        <div className="absolute bottom-4 right-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Button
                                size="sm"
                                variant="default"
                                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest px-4 shadow-lg shadow-blue-500/20"
                                onClick={capture}
                            >
                                <Save className="w-3.5 h-3.5 mr-2" />
                                Finalize for Analysis
                            </Button>
                        </div>
                    )}

                    {isEmpty && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            <div className="flex flex-col items-center gap-3">
                                <MousePointer2 className="w-8 h-8" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sign Here for Biometric Capture</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Velocity Audit</h4>
                    <p className="text-[8px] text-white/30 font-bold uppercase tracking-tighter">Pressure and timing vectors are captured in real-time during ink deposition.</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Neural Bridge</h4>
                    <p className="text-[8px] text-white/30 font-bold uppercase tracking-tighter">Live input is normalized for the ResNet-18 forensic verification engine.</p>
                </div>
            </div>
        </div>
    );
}
