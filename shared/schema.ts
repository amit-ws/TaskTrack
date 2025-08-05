import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const snowflakeUsers = pgTable("snowflake_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userName: text("user_name").notNull(),
  userOwner: text("user_owner"),
  lastSuccessfulLogin: timestamp("last_successful_login"),
  status: text("status").notNull(),
  authenticationMethod: text("authentication_method"),
  riskLevel: text("risk_level"),
  createdOn: timestamp("created_on").notNull().defaultNow(),
  isNHI: boolean("is_nhi").default(false),
  tokenType: text("token_type"), // For NHI only
  humanOwner: text("human_owner"), // For NHI only
});

export const userAnalytics = pgTable("user_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  totalQueries: integer("total_queries").default(0),
  avgQueryDuration: decimal("avg_query_duration", { precision: 10, scale: 2 }),
  mostUsedQueryType: text("most_used_query_type"),
  distinctDatabases: integer("distinct_databases").default(0),
  frequentTables: text("frequent_tables"),
  creditsUsed: decimal("credits_used", { precision: 10, scale: 2 }),
  warehouseUsage: text("warehouse_usage"),
  uniqueRoles: integer("unique_roles").default(0),
  uniquePrivileges: integer("unique_privileges").default(0),
  dataScanned: decimal("data_scanned", { precision: 15, scale: 2 }),
});

export const userActivities = pgTable("user_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  loginTime: timestamp("login_time").notNull(),
  ipAddress: text("ip_address"),
  roles: text("roles"),
  objectsAccessed: text("objects_accessed"),
  creditsConsumed: decimal("credits_consumed", { precision: 10, scale: 2 }),
  queriesExecuted: integer("queries_executed").default(0),
  dataScanned: decimal("data_scanned", { precision: 15, scale: 2 }),
  sessionType: text("session_type"), // 'session' or 'daily'
});

export const expensiveQueries = pgTable("expensive_queries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  queryHash: text("query_hash"),
  sampleQueryText: text("sample_query_text").notNull(),
  users: text("users"),
  roles: text("roles"),
  warehouses: text("warehouses"),
  totalExecutions: integer("total_executions").default(0),
  totalCreditsUsed: decimal("total_credits_used", { precision: 10, scale: 2 }),
  totalMbScanned: decimal("total_mb_scanned", { precision: 15, scale: 2 }),
  totalRuntimeSec: decimal("total_runtime_sec", { precision: 10, scale: 2 }),
  firstSeen: timestamp("first_seen"),
  lastSeen: timestamp("last_seen"),
  groupingType: text("grouping_type").notNull(), // 'query_hash', 'user_role', 'user_query'
  userName: text("user_name"),
  roleName: text("role_name"),
});

export const objectUsage = pgTable("object_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  objectName: text("object_name").notNull(),
  objectType: text("object_type").notNull(),
  operationType: text("operation_type"), // 'READ', 'INSERT', 'UPDATE', 'DELETE'
  creditsConsumed: decimal("credits_consumed", { precision: 10, scale: 2 }),
  uniqueUsers: text("unique_users"),
  accessCount: integer("access_count").default(0),
  lastAccessed: timestamp("last_accessed"),
  dataScanned: decimal("data_scanned", { precision: 15, scale: 2 }),
});

export const lineageDependencies = pgTable("lineage_dependencies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceObject: text("source_object").notNull(),
  dependentObject: text("dependent_object").notNull(),
  dependencyType: text("dependency_type").notNull(), // 'logical', 'fk', 'external'
  constraintName: text("constraint_name"),
  externalSystem: text("external_system"),
  status: text("status").default("active"),
});

export const userObjectAccess = pgTable("user_object_access", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  objectName: text("object_name").notNull(),
  userName: text("user_name").notNull(),
  roleName: text("role_name"),
  queryType: text("query_type"),
  accessCount: integer("access_count").default(0),
  creditsUsed: decimal("credits_used", { precision: 10, scale: 2 }),
  lastAccess: timestamp("last_access"),
  impactLevel: text("impact_level"), // 'high', 'medium', 'low'
});

// Insert schemas
export const insertSnowflakeUserSchema = createInsertSchema(snowflakeUsers).omit({
  id: true,
  createdOn: true,
});

export const insertUserAnalyticsSchema = createInsertSchema(userAnalytics).omit({
  id: true,
});

export const insertUserActivitiesSchema = createInsertSchema(userActivities).omit({
  id: true,
});

export const insertExpensiveQueriesSchema = createInsertSchema(expensiveQueries).omit({
  id: true,
});

export const insertObjectUsageSchema = createInsertSchema(objectUsage).omit({
  id: true,
});

export const insertLineageDependenciesSchema = createInsertSchema(lineageDependencies).omit({
  id: true,
});

export const insertUserObjectAccessSchema = createInsertSchema(userObjectAccess).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSnowflakeUser = z.infer<typeof insertSnowflakeUserSchema>;
export type SnowflakeUser = typeof snowflakeUsers.$inferSelect;

export type InsertUserAnalytics = z.infer<typeof insertUserAnalyticsSchema>;
export type UserAnalytics = typeof userAnalytics.$inferSelect;

export type InsertUserActivities = z.infer<typeof insertUserActivitiesSchema>;
export type UserActivities = typeof userActivities.$inferSelect;

export type InsertExpensiveQueries = z.infer<typeof insertExpensiveQueriesSchema>;
export type ExpensiveQueries = typeof expensiveQueries.$inferSelect;

export type InsertObjectUsage = z.infer<typeof insertObjectUsageSchema>;
export type ObjectUsage = typeof objectUsage.$inferSelect;

export type InsertLineageDependencies = z.infer<typeof insertLineageDependenciesSchema>;
export type LineageDependencies = typeof lineageDependencies.$inferSelect;

export type InsertUserObjectAccess = z.infer<typeof insertUserObjectAccessSchema>;
export type UserObjectAccess = typeof userObjectAccess.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
