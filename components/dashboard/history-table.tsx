"use client";

import { getApiUrl } from "@/lib/api-config";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface HistoryItem {
    timestamp: string;
    result: string;
    confidence: number;
    id: string;
}

export function HistoryTable() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const fetchHistory = async () => {
        try {
            const res = await fetch(getApiUrl("/api/history"));
            if (!res.ok) return;
            const data = await res.json();
            setHistory(data);
        } catch (e) {
            // Silently fail if backend is unreachable
            console.warn("Could not fetch history:", e);
        }
    };

    useEffect(() => {
        fetchHistory();
        const interval = setInterval(fetchHistory, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    if (history.length === 0) return null;

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    Recent Predictions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px] w-full pr-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground pb-2 border-b border-border/50">
                            <div>Timestamp</div>
                            <div>Result</div>
                            <div>Confidence</div>
                            <div>ID</div>
                        </div>
                        {history.map((item, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-4 items-center text-sm py-2 hover:bg-accent/50 rounded-md transition-colors"
                            >
                                <div className="text-muted-foreground">
                                    {new Date(item.timestamp).toLocaleString()}
                                </div>
                                <div>
                                    <Badge
                                        variant="outline"
                                        className={`${item.result === "Genuine"
                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                            : "bg-red-500/10 text-red-500 border-red-500/20"
                                            }`}
                                    >
                                        {item.result === "Genuine" ? (
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                        ) : (
                                            <XCircle className="w-3 h-3 mr-1" />
                                        )}
                                        {item.result}
                                    </Badge>
                                </div>
                                <div className="font-mono">{item.confidence}%</div>
                                <div className="text-xs text-muted-foreground font-mono">
                                    {item.id}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
