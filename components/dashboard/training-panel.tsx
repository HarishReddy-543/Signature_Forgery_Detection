"use client";

import { getApiUrl } from "@/lib/api-config";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Play, Loader2, LineChart as ChartIcon, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export function TrainingPanel() {
    const [loading, setLoading] = useState(false);
    const [epochs, setEpochs] = useState(5);
    const [batchSize, setBatchSize] = useState(8);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<{ epoch: number; loss: number }[]>([]);

    useEffect(() => {
        // Initial check: is training already running in background?
        const checkInitialStatus = async () => {
            try {
                const res = await fetch(getApiUrl("/api/train/status"));
                if (res.ok) {
                    const data = await res.json();
                    if (data.is_training) {
                        setLoading(true);
                        setProgress(data.progress || 1);
                    }
                }
            } catch (e) { }
        };
        checkInitialStatus();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(getApiUrl("/api/train/status"));
                    if (!res.ok) return;
                    const data = await res.json();

                    setProgress(data.progress);
                    if (data.history) setLogs(data.history);

                    if (data.error) {
                        setLoading(false);
                        toast.error("Training failed: " + data.error);
                        clearInterval(interval);
                    }

                    if (data.complete) {
                        setLoading(false);
                        setProgress(100);
                        toast.success("Training Complete", {
                            description: "The AI model is now calibrated with your datasets.",
                        });
                        clearInterval(interval);
                    }
                } catch (e) {
                    console.error("Status check failed:", e);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const startTraining = async () => {
        setLoading(true);
        setProgress(0);
        setLogs([]);
        try {
            const res = await fetch(getApiUrl(`/api/train?epochs=${epochs}&batch_size=${batchSize}`), {
                method: "POST"
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Server error");
            }
            const data = await res.json();

            if (data.status === "started") {
                toast.info("Training Analysis Started", {
                    description: "Scaling signatures and learning patterns...",
                });
            } else if (data.message?.includes("already in progress")) {
                setLoading(true); // Switch to polling mode immediately
                toast.info("Resuming Tracking", {
                    description: "Syncing with the background training task...",
                });
            } else {
                setLoading(false);
                toast.error("Training failed: " + (data.message || "Unknown error"));
            }
        } catch (e) {
            console.error(e);
            setLoading(false);
            toast.error("Connection error: " + (e instanceof Error ? e.message : "Backend unavailable"));
        }
    };

    const resetState = async () => {
        try {
            const res = await fetch(getApiUrl("/api/train/reset"), { method: "POST" });
            const data = await res.json();
            if (data.status === "success") {
                setLoading(false);
                setProgress(0);
                toast.success("State Reset", { description: "Training engine is now ready again." });
            }
        } catch (e) {
            toast.error("Failed to reset state.");
        }
    };

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ChartIcon className="w-5 h-5 text-indigo-400" />
                    Model Training
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Epochs</Label>
                        <Input
                            type="number"
                            value={epochs}
                            onChange={(e) => setEpochs(Number(e.target.value))}
                            min={1}
                            max={100}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Batch Size</Label>
                        <Input
                            type="number"
                            value={batchSize}
                            onChange={(e) => setBatchSize(Number(e.target.value))}
                            min={1}
                            max={32}
                        />
                    </div>
                </div>

                <Button
                    onClick={startTraining}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {progress}% Complete
                        </>
                    ) : progress === 100 ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> Training Complete
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 mr-2" /> Start Training
                        </>
                    )}
                </Button>

                {loading && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetState}
                        className="w-full text-muted-foreground hover:text-destructive transition-colors text-xs"
                    >
                        Stuck? Reset Training Engine
                    </Button>
                )}

                {(loading || (progress > 0 && progress < 100)) && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-muted-foreground">Calibration Progress</span>
                            <span className="text-primary">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                )}

                {logs.length > 0 && (
                    <div className="h-[200px] w-full mt-4">
                        <h4 className="text-sm font-medium mb-2">Loss Curve</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={logs}>
                                <XAxis dataKey="epoch" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Line type="monotone" dataKey="loss" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
