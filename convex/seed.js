import { internalMutation } from "./_generated/server";

// Sample events data with Unsplash images
const SAMPLE_EVENTS = [
  {
    title: "Eid Fashion & Handicraft Fair",
    description: `Discover traditional and modern Eid fashion from local Bangladeshi brands.

Featured:
- Jamdani sarees
- Panjabi collections
- Handmade jewelry
- Leather products
- Henna art booths

Support local artisans and small businesses while shopping for Eid.`,
    category: "shopping",
    tags: ["eid", "fashion", "handicraft", "shopping"],
    city: "Dhaka",
    state: "Dhaka",
    venue: "https://maps.google.com/?q=Bangabandhu+International+Conference+Center",
    address: "BICC, Agargaon, Dhaka",
    capacity: 400,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=80",
  },

  {
    title: "Rural Innovation Hackathon Bangladesh",
    description: `Build technology solutions for real rural problems in Bangladesh.

Themes:
- Agriculture technology
- Flood monitoring
- Rural healthcare
- Smart irrigation
- Digital education

Teams will present solutions to judges from NGOs and tech companies.`,
    category: "tech",
    tags: ["hackathon", "innovation", "agriculture", "technology"],
    city: "Mymensingh",
    state: "Mymensingh",
    venue: "https://maps.google.com/?q=Bangladesh+Agricultural+University",
    address: "BAU Campus, Mymensingh",
    capacity: 100,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=80",
  },

  {
    title: "Padma River Boat Photography Tour",
    description: `Capture stunning sunrise and river life photography along the Padma River.

Includes:
- Boat ride
- Photography guidance
- Village landscape photography
- Fishermen lifestyle documentation

Breakfast and tea included because Bangladesh runs on tea and collective dehydration.`,
    category: "art",
    tags: ["photography", "travel", "river", "nature"],
    city: "Rajbari",
    state: "Dhaka",
    venue: "https://maps.google.com/?q=Padma+River+Rajbari",
    address: "Padma River Ghat, Rajbari",
    capacity: 30,
    ticketType: "paid",
    ticketPrice: 1200,
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
  },

  {
    title: "Bangladesh Robotics Olympiad",
    description: `A robotics competition for school and college students.

Competition tracks:
- Line-following robots
- Soccer bots
- Rescue mission bots
- Autonomous navigation

Workshops and mentoring sessions available for beginners.`,
    category: "tech",
    tags: ["robotics", "competition", "students", "engineering"],
    city: "Dhaka",
    state: "Dhaka",
    venue: "https://maps.google.com/?q=Ahsanullah+University",
    address: "AUST Campus, Tejgaon, Dhaka",
    capacity: 220,
    ticketType: "paid",
    ticketPrice: 250,
    coverImage:
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&q=80",
  },

  {
    title: "Traditional Pitha Utshob",
    description: `Celebrate winter with traditional Bangladeshi pitha and folk culture.

Enjoy:
- Bhapa pitha
- Chitoi pitha
- Patishapta
- Folk music
- Live cooking demonstrations

Family-friendly environment with cultural performances.`,
    category: "food",
    tags: ["pitha", "culture", "winter", "food"],
    city: "Rangpur",
    state: "Rangpur",
    venue: "https://maps.google.com/?q=Town+Hall+Rangpur",
    address: "Town Hall মাঠ, Rangpur",
    capacity: 350,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1200&q=80",
  },

  {
    title: "Freelancers Meetup Bangladesh",
    description: `Connect with freelancers from across Bangladesh and learn how to grow your online career.

Topics:
- Upwork strategies
- Fiverr gig optimization
- Client communication
- International payments
- Personal branding

Experienced freelancers will share real case studies.`,
    category: "business",
    tags: ["freelancing", "career", "business"],
    city: "Dhaka",
    state: "Dhaka",
    venue: "https://maps.google.com/?q=BRAC+Center+Inn+Dhaka",
    address: "Mohakhali, Dhaka",
    capacity: 140,
    ticketType: "paid",
    ticketPrice: 200,
    coverImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  },

  {
    title: "Night Cricket Tournament - Ramadan Special",
    description: `Late-night cricket tournament during Ramadan under floodlights.

Features:
- T10 matches
- Sehri arrangements
- Team jerseys
- Commentary booth

Winning team receives trophy and cash prize.`,
    category: "sports",
    tags: ["cricket", "ramadan", "sports", "tournament"],
    city: "Khulna",
    state: "Khulna",
    venue: "https://maps.google.com/?q=Khulna+District+Stadium",
    address: "Khulna District Stadium",
    capacity: 250,
    ticketType: "paid",
    ticketPrice: 300,
    coverImage:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80",
  },

  {
    title: "Sundarbans Eco Adventure Camp",
    description: `Explore the beauty of the Sundarbans with guided eco-tour activities.

Activities:
- Mangrove exploration
- Wildlife spotting
- Boat camping
- Local village visits

Safety equipment and guides provided.`,
    category: "outdoor",
    tags: ["travel", "nature", "camping", "adventure"],
    city: "Satkhira",
    state: "Khulna",
    venue: "https://maps.google.com/?q=Sundarbans+Satkhira",
    address: "Sundarbans Entry Point, Satkhira",
    capacity: 40,
    ticketType: "paid",
    ticketPrice: 4500,
    coverImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
  },

  {
    title: "Bangla Book Reading Circle",
    description: `A community gathering for Bangla literature lovers.

This month's discussion:
- Works of রবীন্দ্রনাথ ঠাকুর
- Modern Bangla fiction
- Poetry recitation

Tea and snacks included because intellectual discussions apparently require synchronized biscuit dipping.`,
    category: "education",
    tags: ["books", "literature", "culture"],
    city: "Chittagong",
    state: "Chittagong",
    venue: "https://maps.google.com/?q=Chittagong+Public+Library",
    address: "Public Library Hall, Chittagong",
    capacity: 60,
    ticketType: "free",
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80",
  }
];

// Helper functions
function getRandomFutureDate(minDays = 7, maxDays = 90) {
  const now = Date.now();
  const randomDays = Math.floor(Math.random() * (maxDays - minDays) + minDays);
  return now + randomDays * 24 * 60 * 60 * 1000;
}

function getEventEndTime(startTime) {
  const durationHours = Math.floor(Math.random() * 3) + 2;
  return startTime + durationHours * 60 * 60 * 1000;
}

function generateSlug(title) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    `-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
  );
}

// RUN THIS DIRECTLY FROM CONVEX DASHBOARD
// Go to Dashboard > Functions > seed:run > Run
export const run = internalMutation({
  handler: async (ctx) => {
    // First, get or create a default organizer user
    let organizer = await ctx.db.query("users").first();

    if (!organizer) {
      // Create a default organizer if no users exist
      const organizerId = await ctx.db.insert("users", {
        email: "organizer@nexus.com",
        tokenIdentifier: "seed-user-token",
        name: "Nexus Team",
        hasCompletedOnboarding: true,
        location: {
          city: "Dhaka",
          state: "Dhaka",
          country: "Bangladesh",
        },
        interests: ["tech", "music", "business"],
        freeEventsCreated: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      organizer = await ctx.db.get(organizerId);
    }

    if (!organizer) {
      throw new Error("Failed to read or insert an organizer user.");
    }

    const createdEvents = [];

    for (const eventData of SAMPLE_EVENTS) {
      const startDate = getRandomFutureDate();
      const endDate = getEventEndTime(startDate);
      const registrationCount = Math.floor(
        Math.random() * eventData.capacity * 0.7
      );

      const event = {
        ...eventData,
        slug: generateSlug(eventData.title),
        organizerId: organizer._id,
        organizerName: organizer.name,
        startDate,
        endDate,
        timezone: "Asia/Dhaka",
        locationType: "physical",
        country: "Bangladesh",
        registrationCount,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const eventId = await ctx.db.insert("events", event);
      createdEvents.push(eventData.title);
    }

    console.log(`✅ Successfully seeded ${createdEvents.length} events!`);
    return {
      success: true,
      count: createdEvents.length,
      events: createdEvents,
    };
  },
});

// Optional: Clear all events
export const clear = internalMutation({
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    let count = 0;

    for (const event of events) {
      const regs = await ctx.db
        .query("registrations")
        .withIndex("by_event", (q) => q.eq("eventId", event._id))
        .collect();

      for (const reg of regs) {
        await ctx.db.delete(reg._id);
      }

      await ctx.db.delete(event._id);
      count++;
    }

    console.log(`🗑️ Cleared ${count} events`);
    return { success: true, deleted: count };
  },
});