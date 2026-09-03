"use client";

import { useState } from "react";
import { Bell, Search, User, LogOut, Settings, Key, FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { SidebarContent } from "@/components/dashboard/sidebar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-r border-border bg-sidebar">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarContent onItemClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div>
          <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">{title}</h1>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search verifications..."
            className="w-48 lg:w-64 pl-9"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-white/10 bg-black/90 backdrop-blur-xl">
            <DropdownMenuLabel className="pb-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white">{user?.name || "Guest User"}</span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {user?.email || "Not signed in"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="py-2.5 focus:bg-blue-600 focus:text-white transition-colors cursor-pointer group">
              <Settings className="mr-2 h-4 w-4 text-muted-foreground group-focus:text-white" />
              <span className="font-semibold">Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2.5 focus:bg-blue-600 focus:text-white transition-colors cursor-pointer group">
              <Key className="mr-2 h-4 w-4 text-muted-foreground group-focus:text-white" />
              <span className="font-semibold">API Keys</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2.5 focus:bg-blue-600 focus:text-white transition-colors cursor-pointer group">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground group-focus:text-white" />
              <span className="font-semibold">Documentation</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              className="py-2.5 text-red-500 focus:bg-red-500/10 focus:text-red-500 transition-colors cursor-pointer group"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="font-bold">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
