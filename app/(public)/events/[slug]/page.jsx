/* eslint-disable react-hooks/purity */
"use client";

import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  Ticket,
  ExternalLink,
  Loader2,
  CheckCircle,
  Lock,
  Zap,
  ListOrdered,
} from "lucide-react";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useUser, useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import RegisterModal from "./_components/register-modal";
import ProBadge from "@/components/pro-badge";



export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { has } = useAuth();
  const isPro = has?.({ plan: "pro" }) || user?.publicMetadata?.isPro;
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  // Fetch event details
  const { data: event, isLoading } = useConvexQuery(api.events.getEventBySlug, {
    slug: params.slug,
  });

  // Check if user is already registered
  const { data: registration } = useConvexQuery(
    api.registrations.checkRegistration,
    event?._id ? { eventId: event._id } : "skip"
  );

  // Check waitlist status
  const { data: waitlistStatus } = useConvexQuery(
    api.registrations.getWaitlistStatus,
    event?._id ? { eventId: event._id } : "skip"
  );

  // Waitlist mutation
  const { mutate: joinWaitlist, isLoading: isJoiningWaitlist } = useConvexMutation(
    api.registrations.joinWaitlist
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description.slice(0, 100) + "...",
          url: url,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      if (!navigator.clipboard?.writeText) {
        toast.error("Clipboard sharing is not supported in this browser.");
        return;
      }

      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Couldn't copy the link. Please copy it manually.");
      }
    }
  };

  const handleRegister = () => {
    if (!user) {
      toast.error("Please sign in to register");
      return;
    }
    setShowRegisterModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  const isEventFull = event.registrationCount >= event.capacity;
  const isEventPast = event.endDate < Date.now();
  const isOrganizer = currentUser?._id === event.organizerId;

  // Early access: 48h window from creation
  const EARLY_ACCESS_WINDOW = 48 * 60 * 60 * 1000;
  const earlyAccessEndsAt = event._creationTime + EARLY_ACCESS_WINDOW;
  const isInEarlyAccess = Date.now() < earlyAccessEndsAt;
  const earlyAccessTimeLeft = Math.max(0, earlyAccessEndsAt - Date.now());
  const earlyAccessHoursLeft = Math.floor(earlyAccessTimeLeft / (1000 * 60 * 60));
  const earlyAccessMinutesLeft = Math.floor((earlyAccessTimeLeft % (1000 * 60 * 60)) / (1000 * 60));

  const handleJoinWaitlist = async () => {
    if (!user) {
      toast.error("Please sign in to join the waitlist");
      return;
    }
    try {
      await joinWaitlist({
        eventId: event._id,
        attendeeName: user.fullName || "Anonymous",
        attendeeEmail: user.primaryEmailAddress?.emailAddress || "",
      });
      toast.success("You've been added to the waitlist! 🎉");
    } catch (err) {
      toast.error(err.message || "Failed to join waitlist");
    }
  };

  return (
    <div className="min-h-screen py-6 md:py-8 -mt-6 md:-mt-16 lg:-mx-5 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Event Title & Info */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">
              {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
            </Badge>
            {event.isProOnly && (
              <Badge className="bg-pro hover:bg-pro/90 border-none px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase">
                Nexus Pro
              </Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{format(event.startDate, "EEEE, MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {format(event.startDate, "h:mm a")} -{" "}
                {format(event.endDate, "h:mm a")}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {event.coverImage && (
          <div className="relative h-[200px] sm:h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-6">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Description */}
            <Card
              className={"pt-0"}
              style={{
                backgroundColor: "#0A0A0A",
                border: "1px solid #27272A"
              }}
            >
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            <Card className="pt-0 bg-[#0A0A0A] border-[#27272A]">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Location
                </h2>

                <div className="space-y-3">
                  <p className="font-medium">
                    {event.city}, {event.state || event.country}
                  </p>
                  {event.address && (
                    <p className="text-sm text-muted-foreground">
                      {event.address}
                    </p>
                  )}
                  {event.venue && (
                    <Button variant="default" className="bg-primary hover:bg-primary/90">
                      <Link
                        href={event.venue}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        View on Map
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="pt-0 bg-[#0A0A0A] border-[#27272A]">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Organizer</h2>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {event.organizerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold flex items-center gap-1.5">
                      {event.organizerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Event Organizer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="overflow-hidden py-0 bg-[#0A0A0A] border-[#27272A]">
              <CardContent className="p-6 space-y-4">
                {/* Price */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  
                  {event.ticketType === "free" ? (
                    <p className="text-3xl font-bold">Free</p>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {isPro ? (
                        <>
                          <div className="flex items-center gap-2">
                            <p className="text-3xl font-bold text-[#CCFF00]">
                              ₹{(event.ticketPrice * 0.9).toFixed(2)}
                            </p>
                            <Badge className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/80">PRO 10% OFF</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-through">
                            ₹{event.ticketPrice}
                          </p>
                        </>
                      ) : (
                        <p className="text-3xl font-bold">₹{event.ticketPrice}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Pay at event offline
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Attendees</span>
                    </div>
                    <p className="font-semibold">
                      {event.registrationCount} / {event.capacity}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Date</span>
                    </div>
                    <p className="font-semibold text-sm">
                      {format(event.startDate, "MMM dd")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Time</span>
                    </div>
                    <p className="font-semibold text-sm">
                      {format(event.startDate, "h:mm a")}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Registration Button */}
                {registration ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        You&apos;re registered!
                      </span>
                    </div>
                    <Button
                      className="w-full gap-2"
                      onClick={() => router.push("/my-tickets")}
                    >
                      <Ticket className="w-4 h-4" />
                      View Ticket
                    </Button>
                  </div>
                ) : isEventPast ? (
                  <Button className="w-full" disabled>
                    Event Ended
                  </Button>
                ) : isOrganizer ? (
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
                    onClick={() => router.push(`/events/${event.slug}/manage`)}
                  >
                    Manage Event
                  </Button>
                ) : event.isProOnly && !isPro ? (
                  <Button className="w-full gap-2 bg-[#27272A] text-white hover:bg-[#27272A]/80 cursor-not-allowed">
                    <Lock className="w-4 h-4 text-[#CCFF00]" />
                    Pro Members Only
                  </Button>
                ) : isInEarlyAccess && !isPro ? (
                  <div className="space-y-2">
                    <Button className="w-full gap-2 bg-[#27272A] text-white" disabled>
                      <Zap className="w-4 h-4 text-[#CCFF00]" />
                      Early Access — Pro Only
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Opens for everyone in{" "}
                      <span className="text-[#CCFF00] font-semibold">
                        {earlyAccessHoursLeft}h {earlyAccessMinutesLeft}m
                      </span>
                    </p>
                  </div>
                ) : isEventFull && !waitlistStatus ? (
                  <Button
                    className="w-full gap-2 cursor-pointer bg-amber-600 hover:bg-amber-700"
                    onClick={handleJoinWaitlist}
                    disabled={isJoiningWaitlist}
                  >
                    {isJoiningWaitlist ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ListOrdered className="w-4 h-4" />
                    )}
                    Join Waitlist
                  </Button>
                ) : isEventFull && waitlistStatus ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 bg-amber-950/40 p-3 rounded-lg">
                      <ListOrdered className="w-5 h-5" />
                      <span className="font-medium text-sm">
                        Waitlist Position: #{waitlistStatus.position}
                        {waitlistStatus.isPro && " (Priority)"}
                      </span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      {waitlistStatus.totalInQueue} people in queue
                    </p>
                  </div>
                ) : (
                  <Button className="w-full gap-2 cursor-pointer" onClick={handleRegister}>
                    <Ticket className="w-4 h-4" />
                    {isPro && isInEarlyAccess ? "Register (Early Access ⚡)" : "Register for Event"}
                  </Button>
                )}

                {/* Share Button */}
                <Button
                  variant="outline"
                  className="w-full gap-2 cursor-pointer"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  Share Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterModal
          event={event}
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          isPro={isPro}
        />
      )}
    </div>
  );
}
