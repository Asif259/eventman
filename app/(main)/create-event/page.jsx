/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import UnsplashImagePicker from "@/components/unsplash-image-picker";
import AIEventCreator from "./_components/ai-event-creator";
import UpgradeModal from "@/components/upgrade-modal";
import { CATEGORIES } from "@/lib/data";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    getBangladeshCities,
    getBangladeshStates,
} from "@/lib/bangladesh-locations";


// HH:MM in 24h
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    category: z.string().min(1, "Please select a category"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
    endTime: z.string().regex(timeRegex, "End time must be HH:MM"),
    locationType: z.enum(["physical", "online"]).default("physical"),
    venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    address: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    ticketType: z.enum(["free", "paid"]).default("free"),
    ticketPrice: z.union([z.number(), z.nan()]).optional(),
    coverImage: z.string().optional(),
    isProOnly: z.boolean().default(false),
}).refine(data => {
    if (data.ticketType === "paid") {
        return typeof data.ticketPrice === 'number' && !isNaN(data.ticketPrice) && data.ticketPrice > 0;
    }
    return true;
}, {
    message: "Ticket price must be greater than 0 for paid events",
    path: ["ticketPrice"]
});

export default function CreateEventPage() {
    const router = useRouter();
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState("limit");

    // Check if user has Pro plan
    const { has } = useAuth();
    const hasPro = has?.({ plan: "pro" });

    const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
    const { mutate: createEvent, isLoading } = useConvexMutation(
        api.events.createEvent
    );

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            locationType: "physical",
            ticketType: "free",
            capacity: 50,
            category: "",
            state: "",
            city: "",
            startTime: "",
            endTime: "",
            isProOnly: false,
        },
    });

    const inputClasses = cn("text-white placeholder:text-white/40 transition-colors border bg-[#0A0A0A] border-[#27272A] focus-visible:ring-[#CCFF00]/50");
    const buttonClasses = cn(inputClasses, "hover:bg-[#27272A]/50");

    const ticketType = watch("ticketType");
    const startDate = watch("startDate");
    const endDate = watch("endDate");
    const coverImage = watch("coverImage");
    const isProOnly = watch("isProOnly");
    const selectedState = useWatch({
        control,
        name: "state",
        defaultValue: "",
    });

    const bangladeshiStates = useMemo(() => getBangladeshStates(), []);
    const cities = useMemo(() => {
        return getBangladeshCities(selectedState);
    }, [selectedState]);



    const combineDateTime = (date, time) => {
        if (!date || !time) return null;
        const [hh, mm] = time.split(":").map(Number);
        const d = new Date(date);
        d.setHours(hh, mm, 0, 0);
        return d;
    };

    const onSubmit = async (data) => {
        try {
            const start = combineDateTime(data.startDate, data.startTime);
            const end = combineDateTime(data.endDate, data.endTime);

            if (!start || !end) {
                toast.error("Please select both date and time for start and end.");
                return;
            }
            if (end.getTime() <= start.getTime()) {
                toast.error("End date/time must be after start date/time.");
                return;
            }

            // Check event limit for Free users
            if (!hasPro && currentUser?.freeEventsCreated >= 1) {
                setUpgradeReason("limit");
                setShowUpgradeModal(true);
                return;
            }



            await createEvent({
                title: data.title,
                description: data.description,
                category: data.category,
                tags: [data.category],
                startDate: start.getTime(),
                endDate: end.getTime(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                locationType: data.locationType,
                venue: data.venue || undefined,
                address: data.address || undefined,
                city: data.city,
                state: data.state || undefined,
                country: "Bangladesh",
                capacity: data.capacity,
                ticketType: data.ticketType,
                ticketPrice: data.ticketPrice || undefined,
                coverImage: data.coverImage || undefined,
                isProOnly: data.isProOnly,
                hasPro,
            });

            toast.success("Event created successfully! 🎉");
            router.push("/my-events");
        } catch (error) {
            toast.error(error.message || "Failed to create event");
        }
    };

    const handleAIGenerate = (generatedData) => {
        setValue("title", generatedData.title);
        setValue("description", generatedData.description);
        setValue("category", generatedData.category);
        setValue("capacity", generatedData.suggestedCapacity);
        setValue("ticketType", generatedData.suggestedTicketType);
        toast.success("Event details filled! Customize as needed.");
    };

    return (
        <div className="min-h-screen text-white transition-colors duration-500 px-4 md:px-6 py-6 md:py-8 -mt-6 md:-mt-16 lg:-mt-5 lg:rounded-md">
            {/* Header */}
            <div className="max-w-6xl mx-auto flex flex-col gap-5 md:flex-row justify-between mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Create Event</h1>
                    {!hasPro && (
                        <p className="text-sm text-white/70 mt-2">
                            Free: {currentUser?.freeEventsCreated || 0}/1 events created
                        </p>
                    )}
                </div>
                <AIEventCreator onEventGenerated={handleAIGenerate} />
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8 md:gap-10">
                {/* LEFT: Image + Theme */}
                <div className="space-y-6">
                    <div
                        className="aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center cursor-pointer border transition-colors bg-[#0A0A0A] border-[#27272A] hover:bg-[#27272A]/50"
                        onClick={() => setShowImagePicker(true)}
                    >
                        {coverImage ? (
                            <Image
                                src={coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                                width={500} // Adjust width as needed
                                height={500} // Adjust height as needed
                                priority // Optional: prioritize loading this image
                            />
                        ) : (
                            <span className="opacity-60 text-sm text-white/70">
                                Click to add cover image
                            </span>
                        )}
                    </div>


                </div>

                {/* RIGHT: Form */}
                <form onSubmit={handleSubmit(onSubmit, (errors) => console.log("Form Errors:", errors))} className="space-y-8">
                    {/* Title */}
                    <div>
                        <Input
                            {...register("title")}
                            placeholder="Event Name"
                            className={cn("text-xl md:text-2xl font-bold bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/40 h-auto")}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-300 font-medium mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Date + Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Start */}
                        <div className="space-y-2">
                            <Label className="text-sm text-white/90">Start</Label>
                            <div className="grid grid-cols-[1fr_auto] gap-2">
                                <Popover>
                                    <PopoverTrigger render={
                                        <Button
                                            variant="outline"
                                            className={cn("w-full justify-between text-left font-normal", buttonClasses)}
                                        />
                                    }>
                                        {startDate ? format(startDate, "PPP") : "Pick date"}
                                        <CalendarIcon className="w-4 h-4 opacity-60" />
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => setValue("startDate", date)}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Input
                                    type="time"
                                    {...register("startTime")}
                                    placeholder="hh:mm"
                                    className={inputClasses}
                                />
                            </div>
                            {(errors.startDate || errors.startTime) && (
                                <p className="text-sm text-red-300 font-medium">
                                    {errors.startDate?.message || errors.startTime?.message}
                                </p>
                            )}
                        </div>

                        {/* End */}
                        <div className="space-y-2">
                            <Label className="text-sm text-white/90">End</Label>
                            <div className="grid grid-cols-[1fr_auto] gap-2">
                                <Popover>
                                    <PopoverTrigger render={
                                        <Button
                                            variant="outline"
                                            className={cn("w-full justify-between text-left font-normal", buttonClasses)}
                                        />
                                    }>
                                        {endDate ? format(endDate, "PPP") : "Pick date"}
                                        <CalendarIcon className="w-4 h-4 opacity-60" />
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={(date) => setValue("endDate", date)}
                                            disabled={(date) => date < (startDate || new Date())}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Input
                                    type="time"
                                    {...register("endTime")}
                                    placeholder="hh:mm"
                                    className={inputClasses}
                                />
                            </div>
                            {(errors.endDate || errors.endTime) && (
                                <p className="text-sm text-red-300 font-medium">
                                    {errors.endDate?.message || errors.endTime?.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label className="text-sm text-white/90">Category</Label>
                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className={cn("w-full", buttonClasses)}>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.icon} {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.category && (
                            <p className="text-sm text-red-300 font-medium">{errors.category.message}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                        <Label className="text-sm text-white/90">Location</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                control={control}
                                name="state"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={(val) => {
                                            field.onChange(val);
                                            setValue("city", "", {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            });
                                        }}
                                    >
                                        <SelectTrigger className={cn("w-full", buttonClasses)}>
                                            <SelectValue placeholder="Select state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {bangladeshiStates.map((s) => (
                                                <SelectItem key={s.isoCode} value={s.name}>
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                            <Controller
                                control={control}
                                name="city"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={!selectedState || cities.length === 0}
                                    >
                                        <SelectTrigger className={cn("w-full", buttonClasses)}>
                                            <SelectValue
                                                placeholder={
                                                    !selectedState
                                                        ? "Select state first"
                                                        : cities.length > 0
                                                            ? "Select city"
                                                            : "No cities available"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.length > 0 ? (
                                                cities.map((city) => (
                                                    <SelectItem key={city.name} value={city.name}>
                                                        {city.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-cities" disabled>
                                                    No cities available for this state
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {errors.city && (
                            <p className="text-sm text-red-300 font-medium">
                                {errors.city.message}
                            </p>
                        )}

                        <div className="space-y-2 mt-6">
                            <Label className="text-sm text-white/90">Venue Details</Label>

                            <Input
                                {...register("venue")}
                                placeholder="Venue link (Google Maps Link)"
                                type="url"
                                className={inputClasses}
                            />
                            {errors.venue && (
                                <p className="text-sm text-red-300 font-medium">{errors.venue.message}</p>
                            )}

                            <Input
                                {...register("address")}
                                placeholder="Full address / street / building (optional)"
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-white/90">Description</Label>
                        <Textarea
                            {...register("description")}
                            placeholder="Tell people about your event..."
                            rows={4}
                            className={cn("resize-none", inputClasses)}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-300 font-medium">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Ticketing */}
                    <div className="space-y-3">
                        <Label className="text-sm text-white/90">Tickets</Label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-white/90">
                                <input
                                    type="radio"
                                    value="free"
                                    {...register("ticketType")}
                                    className="accent-white"
                                />{" "}
                                Free
                            </label>
                            <label className="flex items-center gap-2 text-white/90">
                                <input type="radio" value="paid" {...register("ticketType")} className="accent-white" />{" "}
                                Paid
                            </label>
                        </div>

                        {ticketType === "paid" && (
                            <div className="space-y-1">
                                <Input
                                    type="number"
                                    placeholder="Ticket price ৳"
                                    {...register("ticketPrice", { valueAsNumber: true })}
                                    className={inputClasses}
                                />
                                {errors.ticketPrice && (
                                    <p className="text-sm text-red-300 font-medium">{errors.ticketPrice.message}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Capacity */}
                    <div className="space-y-2">
                        <Label className="text-sm text-white/90">Capacity</Label>
                        <Input
                            type="number"
                            {...register("capacity", { valueAsNumber: true })}
                            placeholder="Ex: 100"
                            className={inputClasses}
                        />
                        {errors.capacity && (
                            <p className="text-sm text-red-300 font-medium">{errors.capacity.message}</p>
                        )}
                    </div>

                    {/* Pro Only Toggle */}
                    <div className="flex flex-col space-y-2 pt-2 border-t border-[#27272A]">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                            Pro-Only Event
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Restrict this event so only Nexus Pro members can register.
                        </p>
                        <label className="flex items-center gap-2 mt-2">
                            <input 
                                type="checkbox" 
                                {...register("isProOnly")}
                                className="w-4 h-4 accent-[#CCFF00]"
                            />
                            <span className="text-sm">Make event Pro-Only</span>
                        </label>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary/90 border-0 font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                            </>
                        ) : (
                            "Create Event"
                        )}
                    </Button>
                </form>
            </div>

            {/* Unsplash Picker */}
            {showImagePicker && (
                <UnsplashImagePicker
                    isOpen={showImagePicker}
                    onClose={() => setShowImagePicker(false)}
                    onSelect={(url) => {
                        setValue("coverImage", url);
                        setShowImagePicker(false);
                    }}
                />
            )}

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                trigger={upgradeReason}
            />
        </div>
    );
}
