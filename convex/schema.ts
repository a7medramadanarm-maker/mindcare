import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  providers: defineTable({
    nameAr: v.optional(v.string()),
    nameEn: v.optional(v.string()),
    specialtyAr: v.optional(v.string()),
    specialtyEn: v.optional(v.string()),
    qualificationsAr: v.optional(v.array(v.string())),
    qualificationsEn: v.optional(v.array(v.string())),
    bioAr: v.optional(v.string()),
    bioEn: v.optional(v.string()),
    areasAr: v.optional(v.array(v.string())),
    areasEn: v.optional(v.array(v.string())),
    approachAr: v.optional(v.array(v.string())),
    approachEn: v.optional(v.array(v.string())),
    philosophyAr: v.optional(v.string()),
    philosophyEn: v.optional(v.string()),
    profileVersion: v.optional(v.number()),
    active: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_active", ["active"]),

  topics: defineTable({
    key: v.string(),
    titleAr: v.optional(v.string()),
    titleEn: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    intro: v.optional(v.string()),
    introEn: v.optional(v.string()),
    symptoms: v.optional(v.array(v.string())),
    active: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_key", ["key"])
    .index("by_active", ["active"]),

  slots: defineTable({
    providerId: v.id("providers"),
    provider: v.string(),
    date: v.string(),
    time: v.string(),
    booked: v.boolean(),
    bookingId: v.optional(v.id("bookings")),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_provider_date", ["providerId", "date"])
    .index("by_provider_booked", ["providerId", "booked"]),

  bookings: defineTable({
    name: v.string(),
    phone: v.string(),
    message: v.optional(v.string()),
    providerId: v.id("providers"),
    provider: v.string(),
    slotId: v.id("slots"),
    date: v.string(),
    time: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
    ),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_created_at", ["createdAt"])
    .index("by_status", ["status"])
    .index("by_slot_id", ["slotId"]),

  admins: defineTable({
    email: v.string(),
    active: v.boolean(),
  }).index("by_email", ["email"]),
});
