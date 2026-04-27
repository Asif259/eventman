import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingEventCard } from "@/components/landing/EventCard";

// Mock data for the design demonstration
const TRENDING_EVENTS = [
  {
    id: 1,
    title: "React 19 Workshop: Master the New Features",
    category: "TECH",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
    href: "/explore",
  },
  {
    id: 2,
    title: "Indie Music Night - Acoustic Sessions",
    category: "MUSIC",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
    href: "/explore",
  },
  {
    id: 3,
    title: "Startup Networking Breakfast",
    category: "BUSINESS",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
    href: "/explore",
  },
  {
    id: 4,
    title: "Weekend Photography Masterclass",
    category: "ART",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80",
    href: "/explore",
  }
];

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen text-black font-sans overflow-x-hidden w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-40 md:-mt-32">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex flex-col justify-end pb-16 md:pb-24 px-4 md:px-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1619229667009-e7e51684e8e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Crowd at high energy concert" 
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Dark Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10" />

        <div className="relative z-20 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-3xl sm:text-4xl md:text-[6rem] lg:text-[8rem] font-bold leading-[0.85] tracking-tight uppercase text-white mb-4 md:mb-6 drop-shadow-2xl">
            Where Events <br/> <span className="text-[#CCFF00]">Come to Life</span>
          </h1>
          <p className="text-sm md:text-2xl text-white/90 font-light mb-6 md:mb-10 max-w-2xl drop-shadow-md">
            Find the best events, grab your tickets, or host your own epic experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/explore" 
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-[#CCFF00] text-[#0A0A0A] font-heading font-bold text-base md:text-xl uppercase tracking-wider hover:bg-[#CCFF00]/80 transition-colors duration-300"
            >
              Book a Ticket
            </Link>
            <Link 
              href="/create-event" 
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 bg-transparent border border-white text-white font-heading font-bold text-base md:text-xl uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-300"
            >
              Create an Event
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TRENDING EVENTS */}
      <section className="py-12 md:py-24 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#0A0A0A]">
              Trending Events
            </h2>
            <Link href="/explore" className="hidden md:flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-black hover:underline group">
              Browse All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TRENDING_EVENTS.slice(0, 3).map((event, idx) => (
              <LandingEventCard 
                key={event.id}
                {...event}
                delay={idx * 150}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}