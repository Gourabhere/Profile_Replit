import { pgTable, text, serial, integer, boolean, date, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Candidate table for storing talent information
export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull().unique(),
  name: text("name").notNull(),
  prefix: text("prefix").notNull(), // Mr./Ms./etc
  skills: text("skills").array().notNull(),
  grade: text("grade").notNull(), // C1, C2, C3A, etc.
  experienceYears: text("experience_years").notNull(), // Stored as text to allow for decimal values (e.g. "1.42")
  availability: text("availability").notNull(), // Available, Available-ESU Skill, Fresh Trainee-Available
  unallocatedDays: integer("unallocated_days").notNull().default(0),
  location: text("location").notNull(),
  phoneNumber: text("phone_number"),
  email: text("email"),
  availableSince: date("available_since"),
});

// Saved candidates for user preferences
export const savedCandidates = pgTable("saved_candidates", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => candidates.id),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
});

// Import history to track file uploads
export const imports = pgTable("imports", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  recordCount: integer("record_count").notNull(),
  fileSize: text("file_size").notNull(), // Store as text for formats like "1.2 MB"
  importedAt: timestamp("imported_at").notNull().defaultNow(),
});

// Project history for candidates
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => candidates.id),
  name: text("name").notNull(),
  role: text("role").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
});

// Define the insert schemas
export const insertCandidateSchema = createInsertSchema(candidates).omit({ id: true });
export const insertSavedCandidateSchema = createInsertSchema(savedCandidates).omit({ id: true, savedAt: true });
export const insertImportSchema = createInsertSchema(imports).omit({ id: true, importedAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });

// Define the types
export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type SavedCandidate = typeof savedCandidates.$inferSelect;
export type InsertSavedCandidate = z.infer<typeof insertSavedCandidateSchema>;
export type Import = typeof imports.$inferSelect;
export type InsertImport = z.infer<typeof insertImportSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

// Reexport user types from the default schema
export { users, type User, type InsertUser, insertUserSchema } from "./schema-original";
