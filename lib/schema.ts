// lib/schema.ts

import {
  pgTable,
  text,
  integer,
  boolean,
  json,
  timestamp,
  uuid,
  real,
} from "drizzle-orm/pg-core";

/* =========================
   USERS
========================= */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  email: text("email").notNull().unique(),

  password: text("password").notNull(),

  phone: text("phone"),

  image: text("image"),

  role: text("role").default("user").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

/* =========================
   PROPERTIES
========================= */

export const properties = pgTable("properties", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  title: text("title")
    .notNull(),

  description: text("description")
    .notNull(),

  price: integer("price")
    .notNull(),

  /* HOUSE / APARTMENT / PLOT / COMMERCIAL */
  type: text("type")
    .notNull(),

  /* FOR_SALE / FOR_RENT */
  status: text("status")
    .notNull(),

  bedrooms: integer("bedrooms"),

  bathrooms: integer("bathrooms"),

  area: real("area")
    .notNull(),

  /* marla / kanal / sqft */
  areaUnit: text("area_unit")
    .notNull()
    .default("marla"),

  address: text("address")
    .notNull(),

  city: text("city")
    .notNull(),

  state: text("state")
    .notNull(),

  /*
   * Optional location data
   * Future Google Maps / Mapbox integration
   */
  latitude: text("latitude"),

  longitude: text("longitude"),

  images: json("images")
    .notNull(),

  features: json("features")
    .notNull(),

  published: boolean("published")
    .default(false)
    .notNull(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

/* =========================
   REVIEWS
========================= */

export const reviews = pgTable("reviews", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  propertyId: uuid("property_id")
    .references(() => properties.id)
    .notNull(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  rating: integer("rating")
    .notNull(),

  comment: text("comment")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});