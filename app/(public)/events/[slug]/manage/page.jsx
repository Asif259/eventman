"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  Trash2,
  QrCode,
  Loader2,
  CheckCircle,
  Download,
  Search,
  Eye,
  Settings,
  Edit,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import QRScannerModal from "./_components/qr-scanner-modal";
import { AttendeeCard } from "./_components/attendee-card";
import EditEventForm from "./_components/edit-event-form";

export default function EventManagePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [currentSection, setCurrentSection] = useState("overview"); // overview, attendees, edit, settings

  // 1. Fetch event by slug
  const { data: event, isLoading: eventLoading } = useConvexQuery(api.events.getEventBySlug, { slug });
  
  // 2. Fetch dashboard data using event ID
  const eventId = event?._id;
  const { data: dashboardData, isLoading: dashboardLoading } = useConvexQuery(
    api.dashboard.getEventDashboard,
    eventId ? { eventId } : "skip"
  );

  // 3. Fetch registrations
  const { data: registrations, isLoading: loadingRegistrations } =
    useConvexQuery(api.registrations.getEventRegistrations, eventId ? { eventId } : "skip");

  // 4. Delete event mutation
  const { mutate: deleteEvent, isLoading: isDeleting } = useConvexMutation(
    api.events.deleteEvent
  );

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone and will permanently delete the event and all associated registrations."
    );

    if (!confirmed) return;

    try {
      await deleteEvent({ eventId });
      toast.success("Event deleted successfully");
      router.push("/my-events");
    } catch (error) {
      toast.error(error.message || "Failed to delete event");
    }
  };

  const handleExportCSV = () => {
    if (!registrations || registrations.length === 0) {
      toast.error("No registrations to export");
      return;
    }

    const escapeCsv = (value) => {
      if (value == null) return "";
      const stringValue = String(value);
      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n") ||
        stringValue.includes("\r")
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvContent = [
      [
        "Name",
        "Email",
        "Registered At",
        "Checked In",
        "Checked In At",
        "QR Code",
      ],
      ...registrations.map((reg) => [
        reg.attendeeName,
        reg.attendeeEmail,
        new Date(reg.registeredAt).toLocaleString(),
        reg.checkedIn ? "Yes" : "No",
        reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleString() : "-",
        reg.qrCode,
      ]),
    ]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dashboardData?.event.title || "event"}_registrations.csv`;
    a.click();
    toast.success("CSV exported successfully");
  };

  if (eventLoading || dashboardLoading || loadingRegistrations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (event === null || dashboardData === null) {
    notFound();
  }

  const { stats } = dashboardData;

  // Filter registrations based on active tab and search
  const filteredRegistrations = registrations?.filter((reg) => {
    const matchesSearch =
      reg.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.attendeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.qrCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch && reg.status === "confirmed";
    if (activeTab === "checked-in")
      return matchesSearch && reg.checkedIn && reg.status === "confirmed";
    if (activeTab === "pending")
      return matchesSearch && !reg.checkedIn && reg.status === "confirmed";

    return matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20 px-3 md:px-4 bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 pt-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/my-events")}
            className="gap-2 -ml-2 mb-4 text-muted-foreground hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Events
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading uppercase tracking-wider">{event.title}</h1>
              <p className="text-muted-foreground">Manage your event, attendees, and settings.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/events/${event.slug}`)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              View Event Page
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-[#111] border border-[#27272A] rounded-2xl p-4 flex flex-col gap-1">
              <Button 
                variant={currentSection === "overview" ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 ${currentSection === "overview" ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-white hover:bg-white/5"}`}
                onClick={() => setCurrentSection("overview")}
              >
                <LayoutDashboard className="w-5 h-5" />
                Overview
              </Button>
              <Button 
                variant={currentSection === "attendees" ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 ${currentSection === "attendees" ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-white hover:bg-white/5"}`}
                onClick={() => setCurrentSection("attendees")}
              >
                <Users className="w-5 h-5" />
                Attendees ({stats.totalRegistrations})
              </Button>
              <Button 
                variant={currentSection === "edit" ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 ${currentSection === "edit" ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-white hover:bg-white/5"}`}
                onClick={() => setCurrentSection("edit")}
              >
                <Edit className="w-5 h-5" />
                Edit Details
              </Button>
              <Button 
                variant={currentSection === "settings" ? "secondary" : "ghost"} 
                className={`w-full justify-start gap-3 ${currentSection === "settings" ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "text-white hover:bg-white/5"}`}
                onClick={() => setCurrentSection("settings")}
              >
                <Settings className="w-5 h-5" />
                Settings
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* OVERVIEW SECTION */}
            {currentSection === "overview" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {event.coverImage && (
                  <div className="relative h-[200px] sm:h-[250px] md:h-[350px] rounded-2xl overflow-hidden">
                    <Image
                      src={event.coverImage}
                      alt={event.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                        <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-white/20">
                          {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
                        </Badge>
                        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{format(event.startDate, "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>
                            {event.locationType === "online"
                              ? "Online"
                              : `${event.city}, ${event.state || event.country}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions - Show QR Scanner if event is today */}
                {stats.isEventToday && !stats.isEventPast && (
                  <Button
                    size="lg"
                    className="w-full gap-2 h-14 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white font-bold text-lg hover:scale-[1.01] transition-transform border-0 cursor-pointer"
                    onClick={() => setShowQRScanner(true)}
                  >
                    <QrCode className="w-6 h-6" />
                    Scan QR Code to Check-In
                  </Button>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-[#111] border-[#27272A]">
                    <CardContent className="p-6 flex flex-col gap-3">
                      <div className="p-3 bg-primary/10 rounded-xl w-fit">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">
                          {stats.totalRegistrations}<span className="text-muted-foreground text-xl">/{stats.capacity}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111] border-[#27272A]">
                    <CardContent className="p-6 flex flex-col gap-3">
                      <div className="p-3 bg-green-500/10 rounded-xl w-fit">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{stats.checkedInCount}</p>
                        <p className="text-sm text-muted-foreground">Checked In</p>
                      </div>
                    </CardContent>
                  </Card>

                  {event.ticketType === "paid" ? (
                    <Card className="bg-[#111] border-[#27272A]">
                      <CardContent className="p-6 flex flex-col gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-xl w-fit">
                          <TrendingUp className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">₹{stats.totalRevenue}</p>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-[#111] border-[#27272A]">
                      <CardContent className="p-6 flex flex-col gap-3">
                        <div className="p-3 bg-orange-500/10 rounded-xl w-fit">
                          <TrendingUp className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">{stats.checkInRate}%</p>
                          <p className="text-sm text-muted-foreground">Check-in Rate</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-[#111] border-[#27272A]">
                    <CardContent className="p-6 flex flex-col gap-3">
                      <div className="p-3 bg-amber-500/10 rounded-xl w-fit">
                        <Clock className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">
                          {stats.isEventPast
                            ? "Ended"
                            : stats.hoursUntilEvent > 24
                              ? `${Math.floor(stats.hoursUntilEvent / 24)}d`
                              : `${stats.hoursUntilEvent}h`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {stats.isEventPast ? "Event Over" : "Time Left"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* ATTENDEES SECTION */}
            {currentSection === "attendees" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold">Attendee Management</h2>
                  <Button
                    variant="outline"
                    onClick={handleExportCSV}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>

                <Card className="bg-[#111] border-[#27272A]">
                  <CardContent className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="mb-6 bg-black border border-[#27272A]">
                        <TabsTrigger value="all" className="data-[state=active]:bg-[#27272A]">
                          All ({stats.totalRegistrations})
                        </TabsTrigger>
                        <TabsTrigger value="checked-in" className="data-[state=active]:bg-[#27272A]">
                          Checked In ({stats.checkedInCount})
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="data-[state=active]:bg-[#27272A]">
                          Pending ({stats.pendingCount})
                        </TabsTrigger>
                      </TabsList>

                      {/* Search */}
                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Search by name, email, or QR code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-[#0A0A0A] border-[#27272A] text-white"
                          />
                        </div>
                      </div>

                      {/* Attendee List */}
                      <TabsContent value={activeTab} className="space-y-3 mt-0">
                        {filteredRegistrations && filteredRegistrations.length > 0 ? (
                          filteredRegistrations.map((registration) => (
                            <AttendeeCard
                              key={registration._id}
                              registration={registration}
                            />
                          ))
                        ) : (
                          <div className="text-center py-12 border border-dashed border-[#27272A] rounded-xl text-muted-foreground">
                            No attendees found
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* EDIT SECTION */}
            {currentSection === "edit" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold">Edit Details</h2>
                <div className="bg-[#111] border border-[#27272A] rounded-2xl p-6">
                  <EditEventForm event={event} />
                </div>
              </div>
            )}

            {/* SETTINGS SECTION */}
            {currentSection === "settings" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-red-500">Danger Zone</h2>
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader>
                    <CardTitle className="text-red-500">Delete Event</CardTitle>
                    <CardDescription className="text-red-200/70">
                      Permanently delete this event and all associated registrations. This action cannot be undone.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting ? "Deleting..." : "Delete Event"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScannerModal
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}
