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
import SearchLocationBar from "@/components/searchLocationBar";
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
                src="/logo.png"
                alt="nexus logo"
                width={120}
                height={44}
                className="w-auto h-9 md:h-11 object-contain"
                priority
              />
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

          {/* Search bar */}
          <div className="hidden md:flex flex-1 justify-center">
            <SearchLocationBar />
          </div>


          <div className="flex items-center gap-2 md:gap-4">
            {/* Nav links */}
            {!hasPro && (
            <Button variant="ghost" size="default" onClick={() => setShowUpgradeModal(true)} className="hidden sm:flex hover:-translate-y-[1px] transition-transform duration-200">
              Pricing
            </Button>
            )}

            <Button asChild variant="ghost" size="default" className="hidden sm:flex hover:-translate-y-[1px] transition-transform duration-200">
              <Link href="/explore">Explore</Link>
            </Button>

            {/* Auth buttons */}
            <Authenticated>
              <Button asChild variant="default" size="default" className="shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200">
                <Link href="/create-event" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create Event</span>
                </Link>
              </Button>
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
              <Button asChild size="default" className="shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200">
                <SignInButton mode="modal" className="cursor-pointer" />
              </Button>
            </Unauthenticated>
          </div>
        </div>

        {/*  mobile Search Bar */}
        <div className="md:hidden border-t px-3 py-3">
          <SearchLocationBar />
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