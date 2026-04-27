"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/use-store-user";
import { useState } from "react";
import { Plus, Ticket, Building, LogIn, Menu, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import UpgradeModal from "@/components/upgrade-modal";

export default function Header() {

  const { isLoading, isAuthenticated } = useStoreUser();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { has } = useAuth();
  const hasPro = has?.({ plan: 'pro' });

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b border-border/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
          {/* Logo & Badge Group */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
              <Image
                src="/logo2.png"
                alt="nexus logo"
                width={120}
                height={44}
                className="w-auto h-9 md:h-11 object-contain"
                priority
              />
              <h2 className=" text-2xl font-bold tracking-widest uppercase text-white">Nexus</h2>
            </Link>

            {/* Pro Badge */}
            { isAuthenticated && (
              <Badge
              variant={hasPro ? "default" : "outline"}
              className={cn(
                "text-xs px-2.5 py-0.5 transition-all duration-300 tracking-wide font-medium",
                hasPro
                  ? "bg-amber-500 text-white hover:bg-amber-600 border-none shadow-sm"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              )}
            >
              {hasPro ? "Pro" : "Free"}
            </Badge>
            )}
          </div>

          {/* Center nav links — desktop only */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-8 text-lg tracking-wider text-white/90">
            <Link href="/explore" className="hover:text-white transition-colors">Browse Events</Link>
            <Link href="/create-event" className="hover:text-white transition-colors">Create Events</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Auth buttons — desktop */}
            <Authenticated>
              <Link href="/create-event" className="hidden md:block">
                <Button variant="default" size="default" className="bg-white text-black hover:bg-gray-200 tracking-widest uppercase">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </Link>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Tickets"
                    labelIcon={<Ticket size={16} />}
                    href="/my-tickets"
                  />
                  <UserButton.Link
                    label="My Events"
                    labelIcon={<Building size={16} />}
                    href="/my-events"
                  />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </Authenticated>
            
            <div className="hidden md:flex items-center gap-3">
              <Unauthenticated>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-white hover:bg-white/10 tracking-widest uppercase border border-transparent">
                    Log In
                  </Button>
                </SignInButton>
                <SignInButton mode="modal" fallbackRedirectUrl="/explore">
                  <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white hover:text-black tracking-widest uppercase">
                    Sign Up
                  </Button>
                </SignInButton>
              </Unauthenticated>
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-6 space-y-4">
              <Link href="/explore" className="block py-3 text-lg tracking-wider text-white/90 hover:text-[#CCFF00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Browse Events</Link>
              <Link href="/create-event" className="block py-3 text-lg tracking-wider text-white/90 hover:text-[#CCFF00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Create Events</Link>
              <Link href="/about" className="block py-3 text-lg tracking-wider text-white/90 hover:text-[#CCFF00] transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/contact" className="block py-3 text-lg tracking-wider text-white/90 hover:text-[#CCFF00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</Link>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <Authenticated>
                  <Link href="/create-event" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full bg-[#CCFF00] text-[#0A0A0A] hover:bg-[#CCFF00]/80 tracking-widest uppercase">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </Link>
                </Authenticated>
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="w-full text-white hover:bg-white/10 tracking-widest uppercase border border-white/20">
                      Log In
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal" fallbackRedirectUrl="/explore">
                    <Button variant="outline" className="w-full text-white border-white bg-transparent hover:bg-white hover:text-black tracking-widest uppercase">
                      Sign Up
                    </Button>
                  </SignInButton>
                </Unauthenticated>
              </div>
            </div>
          </div>
        )}

        {/* Loader */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#fff" />
          </div>
        )}

        {/* Modals */}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          trigger="header"
        />
      </nav>
    </>
  );
}