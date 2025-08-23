import { pgTable, text, timestamp, integer, uuid, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['candidate', 'interviewer']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  image: text('image'),
  role: roleEnum('role').notNull().default('candidate'),
  clerkId: text('clerk_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  clerkIdIdx: index('users_clerk_id_idx').on(table.clerkId),
}));

// Interviews table
export const interviews = pgTable('interviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  status: text('status').notNull().default('scheduled'),
  streamCallId: text('stream_call_id').notNull().unique(),
  candidateId: text('candidate_id').notNull(),
  interviewerIds: text('interviewer_ids').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  candidateIdIdx: index('interviews_candidate_id_idx').on(table.candidateId),
  streamCallIdIdx: index('interviews_stream_call_id_idx').on(table.streamCallId),
}));

// Comments table
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  rating: integer('rating').notNull(),
  interviewerId: text('interviewer_id').notNull(),
  interviewId: uuid('interview_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  interviewIdIdx: index('comments_interview_id_idx').on(table.interviewId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  candidateInterviews: many(interviews),
  comments: many(comments),
}));

export const interviewsRelations = relations(interviews, ({ many }) => ({
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  interview: one(interviews, {
    fields: [comments.interviewId],
    references: [interviews.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;