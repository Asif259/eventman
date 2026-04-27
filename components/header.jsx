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
import { Plus, Ticket, Building, LogIn } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import UpgradeModal from "@/components/upgrade-modal";

export default function Header() {

  const { isLoading, isAuthenticated } = useStoreUser();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

          {/* Center nav links */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-8  text-lg tracking-wider text-white/90">
            <Link href="/explore" className="hover:text-white transition-colors">Browse Events</Link>
            <Link href="/create-event" className="hover:text-white transition-colors">Create Events</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Auth buttons */}
            <Authenticated>
              <Link href="/create-event" className="hidden md:block">
                <Button variant="default" size="default" className="bg-white text-black hover:bg-gray-200  tracking-widest uppercase">
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
            
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-white hover:bg-white/10  tracking-widest uppercase border border-transparent">
                  Log In
                </Button>
              </SignInButton>
              {/* @clerk/nextjs SignUpButton is missing from imports, so I'll just use SignInButton which handles both or a generic Link to sign-up */}
              <SignInButton mode="modal" fallbackRedirectUrl="/explore">
                <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white hover:text-black  tracking-widest uppercase">
                  Sign Up
                </Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>

        {/* {Loader} */}
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