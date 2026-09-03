"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Bell,
  Database,
  Key,
  Globe,
  Save,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const apiKey = "vsk_live_2024_xK9mN3pL7qR1tW4yZ8aB5cD6eF0gH2iJ";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-0 lg:pl-64">
        <Header
          title="Settings"
          description="Configure your VeriSign AI platform"
        />
        <main className="p-6">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="w-full flex overflow-x-auto justify-start sm:justify-center h-auto p-1 gap-1">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="api">API & Integrations</TabsTrigger>
              <TabsTrigger value="model">Model Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-card-foreground">
                    Organization Settings
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input id="orgName" defaultValue="Acme Corporation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc+0">UTC</SelectItem>
                        <SelectItem value="utc+1">Central European (UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-card-foreground">
                    Security Settings
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all admin users
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        Session Timeout
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out inactive users
                      </p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        IP Whitelisting
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Restrict access to specific IP addresses
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        Audit Log Retention
                      </p>
                      <p className="text-sm text-muted-foreground">
                        How long to keep verification logs
                      </p>
                    </div>
                    <Select defaultValue="365">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="730">2 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-card-foreground">
                    Notification Preferences
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        Forgery Alerts
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when forgeries are detected
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        Daily Summary
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Receive daily verification reports
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        Model Updates
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Notifications about model improvements
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        System Alerts
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Critical system and security alerts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Key className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-card-foreground">
                    API Configuration
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value={apiKey}
                          readOnly
                          className="pr-10 font-mono"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Button variant="outline">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use this key to authenticate API requests
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input
                      placeholder="https://your-domain.com/webhooks/verisign"
                      defaultValue=""
                    />
                    <p className="text-sm text-muted-foreground">
                      Receive real-time verification results
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        Rate Limiting
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Current limit: 1000 requests/hour
                      </p>
                    </div>
                    <Button variant="outline">Upgrade Plan</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="model" className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-card-foreground">
                    Model Configuration
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        Confidence Threshold
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Minimum confidence to classify as genuine/forged
                      </p>
                    </div>
                    <Select defaultValue="75">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="70">70%</SelectItem>
                        <SelectItem value="75">75%</SelectItem>
                        <SelectItem value="80">80%</SelectItem>
                        <SelectItem value="85">85%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        Auto-Retrain
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Automatically retrain model with feedback
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">
                        Heatmap Generation
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Generate suspicious region heatmaps
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="rounded-lg bg-secondary/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-card-foreground">
                          Current Model Version
                        </p>
                        <p className="text-sm text-muted-foreground">
                          v2.4.1 - Last updated: Jan 15, 2024
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-success">98.2%</p>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
