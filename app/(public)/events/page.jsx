"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventCard from "@/components/event-card";
import {
  getBangladeshStates,
  getBangladeshCities,
} from "@/lib/bangladesh-locations";
import { cn } from "@/lib/utils";

export default function AllEventsPage() {
  const router = useRouter();
  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" }) ?? false;

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const bangladeshiStates = useMemo(() => getBangladeshStates(), []);
  const cities = useMemo(() => {
    return getBangladeshCities(selectedState);
  }, [selectedState]);

  const { data: events, isLoading } = useConvexQuery(api.explore.getAllEvents, {
    state: selectedState || undefined,
    city: selectedCity || undefined,
    isProUser: hasPro,
  });

  const isProOnlyEvents = events?.filter((event) => event.isProOnly);

  const handleEventClick = (slug) => {
    router.push(`/events/${slug}`);
  };

  const inputClasses = cn(
    "text-white transition-colors border bg-[#0A0A0A] border-[#27272A] focus:ring-[#CCFF00]/50 hover:bg-[#27272A]/50"
  );

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-4 md:pt-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">All Events</h1>
          <p className="text-lg text-muted-foreground">
            Browse and filter events happening nationwide.
          </p>
        </div>
        <Button
          onClick={() => router.push("/my-events")}
          className="gap-2 bg-white text-black hover:bg-gray-200 shrink-0 md:self-end font-semibold uppercase tracking-wider cursor-pointer"
        >
          My Events <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">State / Division</label>
          <Select
            value={selectedState}
            onValueChange={(val) => {
              setSelectedState(val === "all" ? "" : val);
              setSelectedCity("");
            }}
          >
            <SelectTrigger className={inputClasses}>
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {bangladeshiStates.map((s) => (
                <SelectItem key={s.isoCode} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">City / Area</label>
          <Select
            value={selectedCity}
            onValueChange={(val) => setSelectedCity(val === "all" ? "" : val)}
            disabled={!selectedState || cities.length === 0}
          >
            <SelectTrigger className={inputClasses}>
              <SelectValue
                placeholder={
                  !selectedState
                    ? "Select state first"
                    : cities.length > 0
                    ? "All Cities"
                    : "No cities available"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.length > 0 ? (
                cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-cities" disabled>
                  No cities available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#CCFF00]" />
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onClick={() => handleEventClick(event.slug)}
            />
          ))}
        </div>
      ) : isProOnlyEvents && (
        <Card className="p-12 text-center bg-zinc-900/40 border-zinc-800">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold">No events found</h2>
            <p className="text-muted-foreground">
              Try adjusting your filters or browse all states to find events.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedState("");
                setSelectedCity("");
              }}
              className="mt-4 border-[#27272A] hover:bg-[#27272A]/50"
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
