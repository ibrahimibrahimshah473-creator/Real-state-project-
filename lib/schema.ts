// lib/schema.ts
import { pgTable, text, integer, boolean, json, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'), // <-- Ye nayi line add karein
  image: text('image'),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const properties = pgTable('properties', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  location: text('location').notNull(),
  latitude: text('latitude'),
  longitude: text('longitude'),
  images: json('images').notNull(),
  features: json('features').notNull(),
  published: boolean('published').default(false).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});