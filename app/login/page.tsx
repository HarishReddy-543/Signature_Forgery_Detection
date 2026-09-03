"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Logo3D } from "@/components/ui/logo-3d";

export default function LoginPage() {
    const [email, setEmail] = useState("admin@verisign.ai");
    const [password, setPassword] = useState("password123");
    const { login, isLoading } = useAuth();
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            setIsError(true);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] flex items-center justify-center p-4">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                <div className="flex flex-col items-center mb-8 gap-4">
                    <div className="h-16 w-16 mb-2">
                        <Logo3D />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight text-center">
                        VeriSign <span className="text-blue-500">AI</span>
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">Enterprise Signature Authentication</p>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                    <CardHeader className="space-y-1 pb-8">
                        <CardTitle className="text-2xl font-bold text-white">Sign In</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Secure access to your forensic dashboard
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2 group">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                                    Work Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@verisign.ai"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-black/40 border-white/5 pl-10 h-12 rounded-xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                                        Password
                                    </Label>
                                    <Button variant="link" className="text-[10px] font-bold text-blue-500 hover:text-blue-400 h-auto p-0 uppercase tracking-wider">
                                        Forgot Key?
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-black/40 border-white/5 pl-10 h-12 rounded-xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium text-white"
                                    />
                                </div>
                            </div>

                            {isError && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center animate-shake">
                                    Invalid authentication credentials. Please try again.
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="pt-2 pb-8 flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all group overflow-hidden relative"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Initialize Session <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 transition-all duration-500 scale-x-[2] group-hover:translate-x-[-100%]" />
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest justify-center">
                                <Shield className="h-3 w-3 text-blue-500" />
                                Enterprise Grade AES-256 Encryption Active
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                <p className="mt-8 text-center text-xs font-medium text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Button variant="link" className="text-xs font-bold text-blue-500 hover:text-blue-400 h-auto p-0">
                        Contact Security Ops
                    </Button>
                </p>
            </motion.div>
        </div>
    );
}
