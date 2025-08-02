import { db } from "../config/db.js";
import { blogPost, clusteredPost } from "../schema/schema.js";

import { Response, Request } from "express";

import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { BlogType } from "../types/index.js";
import crypto from "crypto";
import { parseHumanReadableDate } from "../utils/parseHumanReadableDate.js";
import logger from "../utils/logger.js";
import type { User } from "better-auth";
import { user } from "../schema/auth-schema.js";
import { auth } from "../auth.js";
import { title } from "process";
import { scrape } from "../services/scrapingService.js";

/* declare module "express-serve-static-core" {
  interface Request {
    apiKey?: any;
  }
} */

/**
 * Fetches blog posts from the database based on the provided query parameters.
 * @param req - The request object containing query parameters.
 * @param res - The response object to send the results.
 */
const getBlogs = async (req: Request, res: Response): Promise<void> => {
  const { apiKey } = req.query;

  try {
    // 1. Load user based on API key
    const session = await auth.api.getSession({
      headers: new Headers({
        "x-api-key": apiKey as string,
      }),
    });

    const user = session?.user;

    const { topics, readTime } = {
      topics: Array.isArray(user?.topicsOfInterset)
        ? user.topicsOfInterset
        : [],
      readTime: Boolean(user?.readTime) ? (user?.readTime as string) : "",
    };

    const clusters = await db
      .select()
      .from(clusteredPost)
      .where(
        and(
          inArray(clusteredPost.clusterLabel, [...topics, readTime]),
          inArray(clusteredPost.clusterType, ["topic", "read_length"])
        )
      )
      .limit(Number(10))
      .offset(Number(0))
      .orderBy(desc(clusteredPost.createdAt));

    const blogPostIds = clusters.map((c) => c.blogPostId);
    const blogs = await db
      .select()
      .from(blogPost)
      .where(inArray(blogPost.id, blogPostIds))
      .orderBy(desc(blogPost.createdAt));

    res.status(200).json(blogs);
  } catch (error) {
    logger.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Inserts blog data into the database.
 * @param data - Array of blog data to be inserted.
 * @returns A promise that resolves to the status of the insertion operation.
 */
const insertBlog = async (
  data: Omit<BlogType<string>, "id" | "scrapedAt" | "postHash">[]
) => {
  try {
    let processData: BlogType<string>[] = data.map((blog, index) => ({
      ...blog,
      id: index + 1,
      postHash: crypto
        .createHash("sha1")
        .update(blog.title + blog.link)
        .digest("hex"),

      scrapedAt: new Date(),
    }));

    const existingBlogPosts = await db
      .select()
      .from(blogPost)
      .where(
        inArray(blogPost.postHash, [
          ...processData.map((blog) => blog.postHash),
        ])
      )
      .catch((err) => {
        logger.error(`Error checking existing posts: ${err.message}`);
        return [];
      });

    let filterPost: BlogType<string>[] = processData.filter(
      (blog) =>
        !existingBlogPosts.some(
          (existingBlog) => existingBlog.postHash === blog.postHash
        )
    );

    if (filterPost.length > 0) {
      const newBlogPosts = await db
        .insert(blogPost)
        .values(
          filterPost.map((post) => ({
            title: post.title,
            link: post.link,
            reactionCount: post.reactionCount,
            commentCount: post.commentCount,
            readTime: post.readTime,
            tags: post.tags,
            comments: post.comments,
            scrapedAt: post.scrapedAt,
            createdAt: post.createdAt,
            postHash: post.postHash,
          }))
        )
        .onConflictDoUpdate({
          target: blogPost.postHash,
          targetWhere: sql``,
          set: {
            reactionCount: sql`excluded."reactionCount"`,
            commentCount: sql`excluded."commentCount"`,
            comments: sql`excluded."comments"`,
          },
        })
        .returning()
        .catch((err) => {
          logger.error(`Error inserting: ${err.message}`);
          logger.error(err);

          return [];
        }); //{ postHash: blogPost.postHash }
    }
    logger.info(
      `Inserted ${filterPost.length} new blog posts out of ${data.length}`
    );
    return {
      status: "successful",
      insertedCount: filterPost.length,
      posts: filterPost,
    };
  } catch (error) {
    logger.error(`Error inserting blogs: ${error}`);
    return { status: "failed" };
  }
};

const deleteJob = async (id: number) => {
  try {
    const result = await db
      .delete(blogPost)
      .where(eq(blogPost.id, id))
      .returning({ id: blogPost.id });

    if (result.length === 0) {
      return { status: "failed", message: "Blog post not found" };
    }
    logger.info(`Deleted blog post with ID: ${result[0].id}`);
    return { status: "successful", deletedId: result[0].id };
  } catch (error) {
    logger.error("Error deleting blog post:", error);
    return { status: "failed", message: "An error occurred while deleting" };
  }
};

export { getBlogs, insertBlog, deleteJob };
