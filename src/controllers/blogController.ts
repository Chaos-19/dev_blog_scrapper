import { db } from "../config/db";
import { blogPost } from "../schema/schema";

import { Response, Request } from "express";

import { and, eq, ilike, or } from "drizzle-orm";
import { BlogType } from "../types";

/* const getJob = async (req: Request, res: Response) => {
  try {
    const {
      title,
      company,
      experience,
      deadline,
      sector,
      location,
      type,
      category,
      postedDate,
      sortBy = "postedDate",
      sortOrder = "desc",
      search,
    } = req.query;

    const queryFilters = [];

    if (title) queryFilters.push(ilike(jobs.title, `%${title}%`));
    if (company) queryFilters.push(ilike(jobs.company, `%${company}%`));
    if (location) queryFilters.push(ilike(jobs.location, `%${location}%`));
    if (type) queryFilters.push(ilike(jobs.jobType, `%${type}%`));
    if (sector) queryFilters.push(ilike(jobs.sector, `%${category}%`));
    if (experience)
      queryFilters.push(ilike(jobs.experienceLevel, `%${category}%`));

    if (search) {
      queryFilters.push(
        or(
          ilike(jobs.title, `%${search}%`),
          ilike(jobs.description, `%${search}%`),
          ilike(jobs.company, `%${search}%`)
        )
      );
    }

    const filter = queryFilters.length ? and(...queryFilters) : undefined;

    const result = await db
      .select()
      .from(jobs)
      .where(filter)
      .orderBy(
        sortBy === "postedDate" ? jobs.deadline : jobs[sortBy as keyof jobType]
      )
      .execute();

    res.status(201).json({
      status: 200,
      message: "Request successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: error.message ?? "Something went wrong",
    });
  }
};
 */
const insertJob = async (data: BlogType[]) => {
  try {
    const existpBlogPost = await db.select().from(blogPost);

    if (existpBlogPost.length > 0) {
      const newBlogPosts = await db.insert(blogPost).values([...data]);
    }
    return { status: "successful" };
  } catch (error) {
    console.log(error);
    return { status: "failed" };
  }
};

const deleteJob = async () => {
  try {
    const deletedJob: {}[] = [];

    const blogList = await db.select().from(blogPost);

    return deletedJob;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export { insertJob };
