import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const locationTypeValidator = v.union(
  v.literal("physical"),
  v.literal("online"),
);
const ticketTypeValidator = v.union(v.literal("free"), v.literal("paid"));

// Helper function to get authenticated user
async function getAuthenticatedUser(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier),
    )
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper function to generate unique slug
function generateUniqueSlug(title) {
  const baseSlug = slugify(title) || "event";
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${baseSlug}-${suffix}`;
}

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    timezone: v.string(),
    locationType: locationTypeValidator,
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),
    capacity: v.number(),
    ticketType: ticketTypeValidator,
    ticketPrice: v.optional(v.number()),
    coverImage: v.optional(v.string()),
    themeColor: v.optional(v.string()),
    hasPro: v.optional(v.boolean()),
    isProOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (args.endDate <= args.startDate) {
      throw new Error("End date/time must be after start date/time.");
    }

    if (args.ticketType === "paid" && (!args.ticketPrice || args.ticketPrice <= 0)) {
      throw new Error("Paid events must include a valid ticket price.");
    }

    const now = Date.now();
    const eventId = await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      slug: generateUniqueSlug(args.title),
      organizerId: user._id,
      organizerName: user.name,
      category: args.category,
      tags: args.tags,
      startDate: args.startDate,
      endDate: args.endDate,
      timezone: args.timezone,
      locationType: args.locationType,
      venue: args.venue,
      address: args.address,
      city: args.city,
      state: args.state,
      country: args.country,
      capacity: args.capacity,
      ticketType: args.ticketType,
      ticketPrice: args.ticketType === "paid" ? args.ticketPrice : undefined,
      registrationCount: 0,
      isProOnly: args.isProOnly,
      coverImage: args.coverImage,
      themeColor: args.themeColor,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(user._id, {
      freeEventsCreated: user.freeEventsCreated + 1,
      updatedAt: now,
    });

    return eventId;
  },
});

// Helper function to get event by slug
export const getEventBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getMyEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    return await ctx.db
      .query("events")
      .withIndex("by_organizer", (q) => q.eq("organizerId", user._id))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const deleteEvent = mutation({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const event = await ctx.db.get(args.eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.organizerId !== user._id) {
      throw new Error("You can only delete your own events");
    }

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .collect();

    for (const registration of registrations) {
      await ctx.db.delete(registration._id);
    }

    await ctx.db.delete(event._id);

    return { success: true };
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    timezone: v.string(),
    locationType: locationTypeValidator,
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),
    capacity: v.number(),
    ticketType: ticketTypeValidator,
    ticketPrice: v.optional(v.number()),
    coverImage: v.optional(v.string()),
    themeColor: v.optional(v.string()),
    isProOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const event = await ctx.db.get(args.eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.organizerId !== user._id) {
      throw new Error("You can only edit your own events");
    }

    if (args.endDate <= args.startDate) {
      throw new Error("End date/time must be after start date/time.");
    }

    if (args.ticketType === "paid" && (!args.ticketPrice || args.ticketPrice <= 0)) {
      throw new Error("Paid events must include a valid ticket price.");
    }

    // Only generate a new slug if the title actually changed
    const newSlug = event.title !== args.title ? generateUniqueSlug(args.title) : event.slug;

    await ctx.db.patch(args.eventId, {
      title: args.title,
      description: args.description,
      slug: newSlug,
      category: args.category,
      tags: args.tags,
      startDate: args.startDate,
      endDate: args.endDate,
      timezone: args.timezone,
      locationType: args.locationType,
      venue: args.venue,
      address: args.address,
      city: args.city,
      state: args.state,
      country: args.country,
      capacity: args.capacity,
      ticketType: args.ticketType,
      ticketPrice: args.ticketType === "paid" ? args.ticketPrice : undefined,
      isProOnly: args.isProOnly,
      coverImage: args.coverImage,
      themeColor: args.themeColor,
      updatedAt: Date.now(),
    });

    return args.eventId;
  },
});
