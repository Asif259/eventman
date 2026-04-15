"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building, Crown, Plus, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/use-store-user";
export default function Header() {

  const { isLoading, isAuthenticated } = useStoreUser();


  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="nexus logo"
              width={500}
              height={500}
              className="w-full h-11"
              priority
            />
          </Link>

          

          <div className="flex items-center">
            {/* Show Pro badge or Upgrade button */}
            {!hasPro && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpgradeModal(true)}
              >
                Pricing
              </Button>
            )}

            <Button variant="ghost" size="sm" asChild className={"mr-2"}>
              <Link href="/explore">Explore</Link>
            </Button>

          {/* Auth buttons */}
            <Authenticated>
              <Button variant="ghost" size="sm" asChild className={"mr-2"}>
                <Link href="/dashboard">C</Link>
              </Button>
              <UserButton />
            </Authenticated>
            <Unauthenticated>
              <Button size="sm">
                <SignInButton mode="modal" className="cursor-pointer"/>
              </Button>
            </Unauthenticated>
          </div>
        </div>

        {/* {Loader} */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full">
            <BarLoader width={"100%"} color="#fff"/>
          </div>
        )}
      </nav>
    </>
  );
}