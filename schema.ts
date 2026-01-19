import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll keep the DB schema simple/optional since we're using memory storage for world state as requested
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  worldState: jsonb("world_state").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  sessionId: true,
  worldState: true,
});

// API Schemas
export const playRequestSchema = z.object({
  content: z.string(),
  sessionId: z.string().optional(),
});

export const playResponseSchema = z.object({
  response: z.string(),
  sessionId: z.string(),
  choices: z.array(z.string()).optional(),
  isGameOver: z.boolean().optional(),
});

export type PlayRequest = z.infer<typeof playRequestSchema>;
export type PlayResponse = z.infer<typeof playResponseSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
