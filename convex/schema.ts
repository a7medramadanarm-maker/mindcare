import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * MindCare Convex schema
 * Defines the database structure only.
 * Keep Firebase and its data intact during migration.
 */

const timestamp = v.number();
const optionalTimestamp = v.optional(v.number());
const stringList = v.array(v.string());

export default defineSchema({
  providers: defineTable({
    nameAr: v.string(),
    nameEn: v.optional(v.string()),
    specialtyAr: v.optional(v.string()),
    specialtyEn: v.optional(v.string()),
    qualificationsAr: v.optional(stringList),
    qualificationsEn: v.optional(stringList),
    bioAr: v.optional(v.string()),
    bioEn: v.optional(v.string()),
    areasAr: v.optional(stringList),
    areasEn: v.optional(stringList),
    approachAr: v.optional(stringList),
    approachEn: v.optional(stringList),
    philosophyAr: v.optional(v.string()),
    philosophyEn: v.optional(v.string()),
    profileVersion: v.optional(v.number()),
    active: v.boolean(),
    createdAt: timestamp,
    updatedAt: optionalTimestamp,
  }).index("by_active", ["active"]),

  topics: defineTable({
    key: v.string(),
    titleAr: v.string(),
    titleEn: v.optional(v.string()),
    descriptionAr: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    intro: v.optional(v.string()),
    introEn: v.optional(v.string()),
    symptoms: v.optional(stringList),
    active: v.boolean(),
    createdAt: optionalTimestamp,
    updatedAt: optionalTimestamp,
  })
    .index("by_key", ["key"])
    .index("by_active", ["active"]),

  slots: defineTable({
    providerId: v.string(),
    provider: v.string(),
    date: v.string(),
    time: v.string(),
    booked: v.boolean(),
    bookingId: v.string(),
    createdAt: timestamp,
    updatedAt: optionalTimestamp,
  })
    .index("by_provider_date", ["providerId", "date"])
    .index("by_provider_booked", ["providerId", "booked"])
    .index("by_booking_id", ["bookingId"]),

  bookings: defineTable({
    name: v.string(),
    phone: v.string(),
    message: v.optional(v.string()),
    providerId: v.string(),
    provider: v.string(),
    slotId: v.string(),
    date: v.string(),
    time: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
    ),
    createdAt: timestamp,
    updatedAt: optionalTimestamp,
  })
    .index("by_created_at", ["createdAt"])
    .index("by_status", ["status"])
    .index("by_slot_id", ["slotId"])
    .index("by_provider_date", ["providerId", "date"]),

  admins: defineTable({
    subject: v.string(),
    email: v.string(),
    active: v.boolean(),
    createdAt: timestamp,
  })
    .index("by_subject", ["subject"])
    .index("by_email", ["email"]),
});
