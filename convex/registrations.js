import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

const generateQRCode = (eventId, userId) => {
  return `EVT-${eventId}-USER-${userId}-${Date.now()}`;
};

async function getCurrentUser(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();
}

// register for event
export const registerForEvent = mutation({
  args: {
    eventId: v.id("events"),
    attendeeName: v.string(),
    attendeeEmail: v.string(),
    isPro: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Pro status: DB field OR client-passed Clerk plan check
    const isPro = user.isPro === true || args.isPro === true;

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.isProOnly && !isPro) {
      throw new Error("This event is exclusively for Pro members");
    }

    // Early access check: first 48 hours after creation are Pro-only
    const EARLY_ACCESS_WINDOW = 48 * 60 * 60 * 1000; // 48 hours in ms
    const earlyAccessEndsAt = event._creationTime + EARLY_ACCESS_WINDOW;
    if (Date.now() < earlyAccessEndsAt && !isPro) {
      throw new Error("Early access: Pro members can register first. Opens for everyone soon!");
    }

    // event is full
    if (event.registrationCount >= event.capacity) {
      throw new Error("Event is full");
    }

    const existingRegistration = await ctx.db
      .query("registrations")
      .withIndex("by_event_user", (q) =>
        q.eq("userId", user._id).eq("eventId", args.eventId)
      )
      .unique();

    if (existingRegistration) {
      throw new Error("You have already registered for this event");
    }

    const qrCode = generateQRCode(args.eventId, user._id);

    const registrationId = await ctx.db.insert("registrations", {
      eventId: args.eventId,
      userId: user._id,
      attendeeName: args.attendeeName,
      attendeeEmail: args.attendeeEmail,
      qrCode,
      checkedIn: false,
      status: "confirmed",
      registeredAt: Date.now(),
    });

    await ctx.db.patch(args.eventId, {
      registrationCount: event.registrationCount + 1,
    });

    return registrationId;
  },
});

// check if user has registered
export const checkRegistration = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    let user;

    try {
      user = await getCurrentUser(ctx);
    } catch {
      return null;
    }

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("registrations")
      .withIndex("by_event_user", (q) =>
        q.eq("userId", user._id).eq("eventId", args.eventId)
      )
      .unique();
  },
});

// get user's registrations
export const getMyRegistrations = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    const registrationsWithEvents = await Promise.all(
      registrations.map(async (registration) => {
        const event = await ctx.db.get(registration.eventId);
        if (!event) return { ...registration, event: null };
        return { ...registration, event };
      })
    );

    return registrationsWithEvents;
  },
});

export const cancelRegistration = mutation({
  args: {
    registrationId: v.id("registrations"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const registration = await ctx.db.get(args.registrationId);
    if (!registration) {
      throw new Error("Registration not found");
    }

    if (registration.userId !== user?._id) {
      throw new Error("You can only cancel your own registrations");
    }

    const event = await ctx.db.get(registration.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // if event is already started, we can't cancel the registration
    if (event.startDate < Date.now()) {
      throw new Error("Event has already started");
    }

    await ctx.db.patch(args.registrationId, {
      status: "cancelled",
    });

    if (event.registrationCount > 0) {
      await ctx.db.patch(registration.eventId, {
        registrationCount: event.registrationCount - 1,
      });
    }

    // Auto-promote from waitlist: Pro users first, then by join time
    const waitlistEntries = await ctx.db
      .query("waitlist")
      .withIndex("by_event", (q) => q.eq("eventId", registration.eventId))
      .collect();

    if (waitlistEntries.length > 0) {
      // Sort: Pro users first, then by joinedAt ascending
      waitlistEntries.sort((a, b) => {
        if (a.isPro && !b.isPro) return -1;
        if (!a.isPro && b.isPro) return 1;
        return a.joinedAt - b.joinedAt;
      });

      const promoted = waitlistEntries[0];
      const qrCode = generateQRCode(promoted.eventId, promoted.userId);

      await ctx.db.insert("registrations", {
        eventId: promoted.eventId,
        userId: promoted.userId,
        attendeeName: promoted.attendeeName,
        attendeeEmail: promoted.attendeeEmail,
        qrCode,
        checkedIn: false,
        status: "confirmed",
        registeredAt: Date.now(),
      });

      await ctx.db.patch(promoted.eventId, {
        registrationCount: (event.registrationCount - 1) + 1, // cancel - 1, promote + 1
      });

      await ctx.db.delete(promoted._id);
    }

    return { success: true };
  },
});
// Get all registrations for an event (organizer only)
export const getEventRegistrations = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is the organizer
    if (event.organizerId !== user._id) {
      throw new Error("Unauthorized");
    }

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .collect();

    // Enrich with user isPro status
    const enriched = await Promise.all(
      registrations.map(async (reg) => {
        const attendeeUser = await ctx.db.get(reg.userId);
        return {
          ...reg,
          isPro: attendeeUser?.isPro || false,
        };
      })
    );

    return enriched;
  },
});

export const checkInAttendee = mutation({
  args: { qrCode: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    if (!user) {
      return { success: false, message: "Not authenticated" };
    }

    const registration = await ctx.db
      .query("registrations")
      .filter((q) => q.eq(q.field("qrCode"), args.qrCode))
      .first();

    if (!registration) {
      return { success: false, message: "Invalid ticket" };
    }

    const event = await ctx.db.get(registration.eventId);
    if (!event) {
      return { success: false, message: "Event not found" };
    }

    if (event.organizerId !== user._id) {
      return { success: false, message: "Unauthorized scanner" };
    }

    if (registration.status !== "confirmed") {
      return { success: false, message: "Ticket is cancelled" };
    }

    if (registration.checkedIn) {
      return { success: false, message: "Already checked in" };
    }

    await ctx.db.patch(registration._id, {
      checkedIn: true,
      checkedInAt: Date.now(),
    });

    return { success: true };
  },
});

// Join waitlist when event is full
export const joinWaitlist = mutation({
  args: {
    eventId: v.id("events"),
    attendeeName: v.string(),
    attendeeEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Can only join waitlist if event is actually full
    if (event.registrationCount < event.capacity) {
      throw new Error("Event is not full yet. Register normally.");
    }

    // Check if already registered
    const existingReg = await ctx.db
      .query("registrations")
      .withIndex("by_event_user", (q) =>
        q.eq("userId", user._id).eq("eventId", args.eventId)
      )
      .unique();

    if (existingReg && existingReg.status === "confirmed") {
      throw new Error("You are already registered for this event");
    }

    // Check if already on waitlist
    const existingWaitlist = await ctx.db
      .query("waitlist")
      .withIndex("by_event_user", (q) =>
        q.eq("userId", user._id).eq("eventId", args.eventId)
      )
      .unique();

    if (existingWaitlist) {
      throw new Error("You are already on the waitlist");
    }

    const waitlistId = await ctx.db.insert("waitlist", {
      eventId: args.eventId,
      userId: user._id,
      attendeeName: args.attendeeName,
      attendeeEmail: args.attendeeEmail,
      isPro: user.isPro || false,
      joinedAt: Date.now(),
    });

    return waitlistId;
  },
});

// Get waitlist status for a user on an event
export const getWaitlistStatus = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    let user;
    try {
      user = await getCurrentUser(ctx);
    } catch {
      return null;
    }
    if (!user) return null;

    const myEntry = await ctx.db
      .query("waitlist")
      .withIndex("by_event_user", (q) =>
        q.eq("userId", user._id).eq("eventId", args.eventId)
      )
      .unique();

    if (!myEntry) return null;

    // Calculate position: Pro users first, then by joinedAt
    const allEntries = await ctx.db
      .query("waitlist")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    allEntries.sort((a, b) => {
      if (a.isPro && !b.isPro) return -1;
      if (!a.isPro && b.isPro) return 1;
      return a.joinedAt - b.joinedAt;
    });

    const position = allEntries.findIndex((e) => e._id === myEntry._id) + 1;

    return {
      _id: myEntry._id,
      position,
      totalInQueue: allEntries.length,
      isPro: myEntry.isPro,
    };
  },
});
