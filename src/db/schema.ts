import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const providers = sqliteTable('providers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').notNull(),
  apiKey: text('api_key'),
  baseUrl: text('base_url'),
  enabled: integer('enabled').default(1),
  createdAt: integer('created_at').default(sql`(unixepoch())`),
});

export const conversations = sqliteTable('conversations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  providerId: integer('provider_id').references(() => providers.id),
  model: text('model'),
  createdAt: integer('created_at').default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').default(sql`(unixepoch())`),
});

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  conversationId: integer('conversation_id').references(() => conversations.id),
  role: text('role').notNull(),
  content: text('content').notNull(),
  tokens: integer('tokens').default(0),
  createdAt: integer('created_at').default(sql`(unixepoch())`),
});

export const workflows = sqliteTable('workflows', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  nodes: text('nodes'),
  edges: text('edges'),
  enabled: integer('enabled').default(1),
  createdAt: integer('created_at').default(sql`(unixepoch())`),
  updatedAt: integer('updated_at').default(sql`(unixepoch())`),
});

export const agents = sqliteTable('agents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  systemPrompt: text('system_prompt'),
  providerId: integer('provider_id').references(() => providers.id),
  model: text('model'),
  tools: text('tools'),
  enabled: integer('enabled').default(1),
  createdAt: integer('created_at').default(sql`(unixepoch())`),
});