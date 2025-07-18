import { db } from "../config/db";
import { blogPost } from "../schema/schema";

import { Response, Request } from "express";

import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { BlogType } from "../types";
import crypto from "crypto";
import { parseHumanReadableDate } from "../utils/parseHumanReadableDate";
import logger from "../utils/logger";

/**
 * Fetches blog posts from the database based on the provided query parameters.
 * @param req - The request object containing query parameters.
 * @param res - The response object to send the results.
 */
const getBlogs = async (req: Request, res: Response) => {
  const { search, tag, limit = 10, offset = 0 } = req.query;

  try {
    const blogs = await db
      .select()
      .from(blogPost)
      .where(
        and(
          or(
            ilike(blogPost.title, `%${search || ""}%`),
            ilike(blogPost.tags, `%${tag || ""}%`)
          ),
          eq(blogPost.postHash, "")
        )
      )
      .limit(Number(limit))
      .offset(Number(offset))
      .orderBy(desc(blogPost.createdAt));

    return res.status(200).json(blogs);
  } catch (error) {
    logger.info(`Error fetching blogs: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
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
    let processData: BlogType<Date>[] = data.map((blog) => ({
      ...blog,
      id: 0,
      postHash: crypto
        .createHash("sha1")
        .update(blog.title + blog.link)
        .digest("hex"),
      createdAt: parseHumanReadableDate(blog.createdAt, {
        returnISO: true,
      }) as Date,
      scrapedAt: new Date(),
    }));

    const existingBlogPosts = await db
      .select()
      .from(blogPost)
      .where(
        inArray(blogPost.postHash, [
          ...processData.map((blog) => blog.postHash),
        ])
      );

    let filterPost: BlogType<Date>[] = processData.filter(
      (blog) =>
        !existingBlogPosts.some(
          (existingBlog) => existingBlog.postHash === blog.postHash
        )
    );

    if (filterPost.length > 0) {
      const newBlogPosts = await db
        .insert(blogPost)
        .values([...filterPost])
        .returning(); //{ postHash: blogPost.postHash }
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
    logger.info(`Error inserting blogs: ${error}`);
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
    logger.info("Error deleting blog post:", error);
    return { status: "failed", message: "An error occurred while deleting" };
  }
};

export { getBlogs, insertBlog, deleteJob };
