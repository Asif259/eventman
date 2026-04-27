import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingEventCard({ title, category, image, href, delay = 0 }) {
  return (
    <Link href={href}>
      <div 
        className="group relative block w-full aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-12 fill-mode-both border border-gray-100"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="absolute inset-0 z-0 h-[60%]">
          <Image 
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        
        {/* Gradient transition from image to white card body */}
        <div className="absolute top-[60%] inset-x-0 h-12 -mt-12 bg-gradient-to-t from-white to-transparent z-10" />

        <div className="absolute top-[60%] bottom-0 left-0 right-0 p-4 md:p-6 z-20 flex flex-col bg-white">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-heading tracking-wider uppercase text-white bg-black rounded-full w-fit">
            {category}
          </span>
          <h3 className="text-lg md:text-2xl font-heading font-bold text-black mb-2 leading-tight group-hover:text-gray-700 transition-colors duration-300">
            {title}
          </h3>
          <div className="mt-auto flex items-center text-gray-500 text-sm font-sans font-medium group-hover:text-black transition-colors duration-300">
            <span>Explore Event</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
