import cluster from "cluster";
import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const blogPost = pgTable("blog_post", {
  id: serial("serial").primaryKey(),
  title: varchar("title").notNull(),
  link: varchar("link").notNull(),
  reactionCount: varchar("reactionCount"),
  commentCount: varchar("commentCount"),
  readTime: varchar("readTime"),
  tags: text("tags").array(),
  comments: text("comments").array(),
  scrapedAt: timestamp("scraped_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull(),
  postHash: text("post_hash").notNull(),
});

export const clusteredPost = pgTable("clustered_post", {
  id: serial("id").primaryKey(),

  blogPostId: integer("blog_post_id")
    .notNull()
    .references(() => blogPost.id, { onDelete: "cascade" }),

  clusterType: varchar("cluster_type").notNull(), // e.g. "topic", "popularity", "recency"
  clusterLabel: varchar("cluster_label").notNull(), // e.g. "ai", "trending", "short_read"
  //clusterScore: integer("cluster_score"), // Optional, for ranking
  clusterTags: text("cluster_tags").array(), // Optional, if multi-label in one

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
