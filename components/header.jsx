"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/use-store-user";
import { useState } from "react";
import { Plus, Ticket, Building } from "lucide-react";
export default function Header() {

  const { isLoading, isAuthenticated } = useStoreUser();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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

          

          <div className="flex items-center gap-1">
            {/* Nav links */}
            <Button variant="ghost" size="sm" onClick={() => setShowUpgradeModal(true)}>
              <Link href="/pricing">Pricing</Link>
            </Button>

            <Button variant="ghost" size="sm" className={"mr-2"}>
              <Link href="/explore">Explore</Link>
            </Button>

            {/* Auth buttons */}
            <Authenticated>
              <Button variant="ghost" size="sm" className={"mr-2"}>
                <Link href="/create-event" className="flex gap-2 mr-4 items-center">
                  <Plus className="h-4 w-4"/>
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
              <Button size="sm">
                <SignInButton mode="modal" className="cursor-pointer" />
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