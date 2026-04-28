import { v } from "convex/values";
import { query } from "./_generated/server";

// Get featured events
export const getFeaturedEvents = query({
    args: {
        limit: v.optional(v.number()),
        isProUser: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        let events = await ctx.db.query("events")
            .withIndex("by_start_date", (q) => q.gte("startDate", now))
        .order("desc")
            .collect();

        const featured = events
            .filter((event) => !event.isProOnly || args.isProUser)
            .sort((a, b) => b.registrationCount - a.registrationCount)
            .slice(0, args.limit ?? 3);

        return featured;
    },
});

// Get events by location (city/state)
export const getEventsByLocation = query({
    args: {
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        limit: v.optional(v.number()),
        isProUser: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        let events = await ctx.db.query("events")
            .withIndex("by_start_date", (q) => q.gte("startDate", now))
            .order("desc")
            .collect();

        // Filter by city or state
        if (args.city) {
            events = events.filter((event) => event.city?.toLowerCase() === args.city.toLowerCase());
        }

        if (args.state) {
            events = events.filter((event) => event.state?.toLowerCase() === args.state.toLowerCase());
        }

        // Filter Pro-only events
        events = events.filter((event) => !event.isProOnly || args.isProUser);

        return events.slice(0, args.limit ?? 4);
    },
});

// Get popular events
export const getPopularEvents = query({
    args: {
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        limit: v.optional(v.number()),
        isProUser: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        let events = await ctx.db.query("events")
            .withIndex("by_start_date", (q) => q.gte("startDate", now))
            .order("desc")
            .collect();

        if (args.city) {
            events = events.filter((event) => event.city?.toLowerCase() === args.city.toLowerCase());
        }
        if (args.state) {
            events = events.filter((event) => event.state?.toLowerCase() === args.state.toLowerCase());
        }

        // Filter Pro-only events
        events = events.filter((event) => !event.isProOnly || args.isProUser);

        // Sort by registration count
        const popular = events
            .sort((a, b) => b.registrationCount - a.registrationCount)
            .slice(0, args.limit ?? 6);

        return popular;
    },
});

// Get Events by category
export const getEventsByCategory = query({
    args: {
        category: v.optional(v.string()),
        limit: v.optional(v.number()),
        isProUser: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        let events = await ctx.db.query("events")
            .withIndex("by_start_date", (q) => q.gte("startDate", now))
            .order("desc")
            .collect();

        if (args.category) {
            events = events.filter(e => e.category === args.category);
        }

        // Filter Pro-only events
        events = events.filter((event) => !event.isProOnly || args.isProUser);

        return events.slice(0, args.limit ?? 12);
    },
});

// Get category counts
export const getCategoryCounts = query({
    args: {
        isProUser: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        let events = await ctx.db.query("events")
            .withIndex("by_start_date", (q) => q.gte("startDate", now))
            .order("desc")
            .collect();

        // Filter Pro-only events
        events = events.filter((event) => !event.isProOnly || args.isProUser);

        const counts = {};
        events.forEach((event) => {
            counts[event.category] = (counts[event.category] || 0) + 1;
        });

        return counts;
    },
});

// Get all events with optional filters
export const getAllEvents = query({
    args: {
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        isProUser: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        let events = await ctx.db.query("events")
            .withIndex("by_start_date", (q) => q.gte("startDate", now))
            .order("desc")
            .collect();

        if (args.state && args.state !== "all") {
            events = events.filter((event) => event.state?.toLowerCase() === args.state.toLowerCase());
        }

        if (args.city && args.city !== "all") {
            events = events.filter((event) => event.city?.toLowerCase() === args.city.toLowerCase());
        }

        // Filter Pro-only events
        events = events.filter((event) => !event.isProOnly || args.isProUser);

        return events;
    },
});
