/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { createLocationSlug } from "@/lib/location-utils";
import { getCategoryIcon } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SearchLocationBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);



  const { data: searchResults, isLoading: searchLoading } = useConvexQuery(
    api.search.searchEvents,
    searchQuery.trim().length >= 2 ? { query: searchQuery, limit: 5 } : "skip"
  );



  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }



  const debouncedSetQuery = useRef(
    debounce((value) => {
      setSearchQuery(value);
      setShowSearchResults(value.length >= 2);
    }, 300)
  ).current;

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetQuery(value);
  };

  const handleEventClick = (slug) => {
    setShowSearchResults(false);
    setSearchQuery("");
    setInputValue("");
    router.push(`/events/${slug}`);
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1 max-w-xl mx-auto" ref={searchRef}>
      <div className="flex items-stretch rounded-none border border-[#27272A] overflow-hidden bg-[#0A0A0A] focus-within:border-[#CCFF00] transition-colors duration-300">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA] pointer-events-none" />
          <Input
            value={inputValue}
            placeholder="Search events by name..."
            onChange={handleSearchInput}
            onFocus={() => {
              if (searchQuery.length >= 2) setShowSearchResults(true);
            }}
            className="pl-12 pr-4 w-full h-11 bg-transparent border-0 rounded-none shadow-none text-white placeholder:text-[#A1A1AA] focus-visible:ring-0 focus-visible:border-0 font-mono text-sm uppercase tracking-wide"
          />
        </div>
      </div>

      {/* Search Results Live Preview */}
      {showSearchResults && (
        <div className="absolute top-full mt-2 w-full bg-[#0A0A0A] border border-[#27272A] shadow-2xl z-50 max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {searchLoading ? (
            <div className="p-6 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#CCFF00]" />
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="py-2">
              <p className="px-4 py-2 text-xs font-mono font-bold text-[#A1A1AA] uppercase tracking-widest border-b border-[#27272A]/50 mb-1">
                Relevant Events
              </p>
              {searchResults.map((event) => (
                <button
                  key={event._id}
                  onClick={() => handleEventClick(event.slug)}
                  className="group w-full px-4 py-3 hover:bg-[#CCFF00] text-left transition-colors duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl mt-1 opacity-70 group-hover:opacity-100">
                      {getCategoryIcon(event.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-white group-hover:text-[#0A0A0A] mb-1 line-clamp-1 text-lg">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-mono text-[#A1A1AA] group-hover:text-[#0A0A0A]/80 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(event.startDate, "MMM dd, yyyy")}
                        </span>
                        {event.city && (
                          <span className="flex items-center gap-1.5 line-clamp-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.city}
                          </span>
                        )}
                      </div>
                    </div>
                    {event.ticketType === "free" && (
                      <Badge className="text-[10px] uppercase font-mono tracking-widest bg-[#27272A] text-white group-hover:bg-[#0A0A0A] group-hover:text-[#CCFF00] border-none rounded-none px-2 py-1">
                        Free
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-[#A1A1AA] font-mono text-sm uppercase tracking-wide">
              No events found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
