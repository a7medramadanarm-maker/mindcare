import { v } from "convex/values";
import {
  query,
  mutation,
  type QueryCtx,
  type MutationCtx,
} from "./_generated/server";

async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity?.email) {
    throw new Error("Authentication required.");
  }

  const admin = await ctx.db
    .query("admins")
    .withIndex("by_email", (q) =>
      q.eq("email", identity.email!.toLowerCase())
    )
    .unique();

  if (!admin || !admin.active) {
    throw new Error("Administrator access required.");
  }

  return admin;
}

// Public: list active providers.
export const listProviders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("providers")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
  },
});

// Public: list active mental-health topics.
export const listTopics = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("topics")
      .withIndex("by_active", (q) => q.eq("active", true))
      .collect();
  },
});

// Public: show available slots for a provider on a date.
export const listAvailableSlots = query({
  args: {
    providerId: v.id("providers"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const slots = await ctx.db
      .query("slots")
      .withIndex("by_provider_date", (q) =>
        q.eq("providerId", args.providerId).eq("date", args.date)
      )
      .collect();

    return slots
      .filter((slot) => !slot.booked)
      .sort((a, b) => a.time.localeCompare(b.time));
  },
});

// Public: create a booking and reserve its slot atomically.
export const createBooking = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    message: v.optional(v.string()),
    providerId: v.id("providers"),
    slotId: v.id("slots"),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const phone = args.phone.trim();

    if (name.length < 2 || name.length > 120) {
      throw new Error("Please enter a valid name.");
    }

    if (!/^[+\d][\d\s()-]{6,24}$/.test(phone)) {
      throw new Error("Please enter a valid phone number.");
    }

    if (args.message && args.message.length > 2000) {
      throw new Error("Message is too long.");
    }

    const provider = await ctx.db.get(args.providerId);

    if (!provider || provider.active !== true) {
      throw new Error("This provider is not available.");
    }

    const slot = await ctx.db.get(args.slotId);

    if (!slot || slot.providerId !== args.providerId) {
      throw new Error("The selected appointment is invalid.");
    }

    if (slot.booked) {
      throw new Error("This appointment has already been booked.");
    }

    const now = Date.now();

    const bookingId = await ctx.db.insert("bookings", {
      name,
      phone,
      message: args.message?.trim() || undefined,
      providerId: args.providerId,
      provider: provider.nameAr || provider.nameEn || "MindCare Provider",
      slotId: args.slotId,
      date: slot.date,
      time: slot.time,
      status: "pending",
      createdAt: now,
    });

    await ctx.db.patch(args.slotId, {
      booked: true,
      bookingId,
      updatedAt: now,
    });

    return { bookingId, status: "pending" as const };
  },
});

// Admin: create an appointment slot.
export const createSlot = mutation({
  args: {
    providerId: v.id("providers"),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
      throw new Error("Date must use YYYY-MM-DD format.");
    }

    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(args.time)) {
      throw new Error("Time must use HH:MM format.");
    }

    const provider = await ctx.db.get(args.providerId);

    if (!provider || provider.active !== true) {
      throw new Error("Provider not found or inactive.");
    }

    const existing = await ctx.db
      .query("slots")
      .withIndex("by_provider_date", (q) =>
        q.eq("providerId", args.providerId).eq("date", args.date)
      )
      .collect();

    if (existing.some((slot) => slot.time === args.time)) {
      throw new Error("This appointment slot already exists.");
    }

    return await ctx.db.insert("slots", {
      providerId: args.providerId,
      provider: provider.nameAr || provider.nameEn || "MindCare Provider",
      date: args.date,
      time: args.time,
      booked: false,
      createdAt: Date.now(),
    });
  },
});

// Admin: list bookings, newest first.
export const listBookings = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    return bookings;
  },
});

// Admin: confirm or cancel a booking.
export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.union(v.literal("confirmed"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const booking = await ctx.db.get(args.bookingId);

    if (!booking) {
      throw new Error("Booking not found.");
    }

    if (booking.status === "cancelled") {
      throw new Error("This booking has already been cancelled.");
    }

    const now = Date.now();

    if (args.status === "cancelled") {
      const slot = await ctx.db.get(booking.slotId);

      if (slot && slot.bookingId === args.bookingId) {
        await ctx.db.patch(booking.slotId, {
          booked: false,
          bookingId: undefined,
          updatedAt: now,
        });
      }
    }

    await ctx.db.patch(args.bookingId, {
      status: args.status,
      updatedAt: now,
    });

    return { success: true };
  },
});
