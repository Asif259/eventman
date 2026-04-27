"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Zap, Users, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans overflow-x-hidden w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-40 md:-mt-32 pt-40 pb-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-6 md:px-16 max-w-7xl mx-auto mb-32">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="font-heading text-6xl md:text-[8rem] font-bold leading-[0.85] tracking-tight uppercase text-white mb-6">
            We Are <br/> <span className="text-[#CCFF00]">Nexus.</span>
          </h1>
          <p className="text-xl md:text-3xl text-[#A1A1AA] font-light max-w-3xl leading-relaxed">
            More than a ticketing platform. We are the central nervous system of modern live experiences. 
            Built for the creators who push boundaries and the audiences who crave them.
          </p>
        </div>
      </section>

      {/* 2. OUR MISSION / WHITE SECTION */}
      <section className="py-32 bg-white text-black border-y border-[#27272A]">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8">
                The Mission
              </h2>
              <div className="space-y-6 text-lg text-gray-700 font-medium">
                <p>
                  Nexus was born out of frustration with clunky, outdated event platforms. We believed that hosting an event should be as seamless as attending one.
                </p>
                <p>
                  Our mission is simple: eliminate the friction between creation and attendance. Whether you are hosting an intimate tech meetup in Dhaka, a massive music festival, or an exclusive online masterclass, Nexus provides the infrastructure to make it happen flawlessly.
                </p>
                <p>
                  We empower organizers with AI-driven tools, real-time analytics, and seamless QR check-ins, while giving attendees a premium, lightning-fast discovery experience.
                </p>
              </div>
            </div>
            <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=800&q=80" 
                alt="Crowd at event"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM FEATURES */}
      <section className="py-32 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <h2 className="font-heading text-5xl md:text-6xl font-bold uppercase tracking-tight text-white mb-16 text-center">
            Why We Built This
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe className="w-8 h-8 text-[#CCFF00]" />,
                title: "Global Reach, Local Impact",
                desc: "Discover events anywhere or target your specific local community."
              },
              {
                icon: <Zap className="w-8 h-8 text-[#CCFF00]" />,
                title: "Lightning Fast",
                desc: "Built on a modern stack to ensure your tickets and event data load instantly."
              },
              {
                icon: <Shield className="w-8 h-8 text-[#CCFF00]" />,
                title: "Rock-Solid Reliability",
                desc: "Secure ticketing, fraud prevention, and seamless offline QR check-ins."
              },
              {
                icon: <Users className="w-8 h-8 text-[#CCFF00]" />,
                title: "Community First",
                desc: "Tools designed specifically to help organizers grow and engage their audience."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 border border-[#27272A] rounded-2xl hover:border-[#CCFF00]/50 transition-colors bg-black/50">
                <div className="mb-6 bg-[#27272A]/50 w-16 h-16 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-[#A1A1AA] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-32 bg-[#CCFF00] text-black text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-heading text-6xl md:text-8xl font-bold uppercase tracking-tight mb-8">
            Ready to dive in?
          </h2>
          <p className="font-mono text-lg font-bold uppercase tracking-widest mb-12">
            Join thousands of creators and attendees already on Nexus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/explore" 
              className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-heading font-bold text-xl uppercase tracking-wider hover:bg-gray-800 transition-colors duration-300"
            >
              Find an Event
            </Link>
            <Link 
              href="/create-event" 
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-black text-black font-heading font-bold text-xl uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-300"
            >
              Host Your Own
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
