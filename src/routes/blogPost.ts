import { Router } from "express";

import { getBlogs, insertBlog, deleteJob } from "../controllers/blogController";

const router = Router();

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     description: Fetches all blog posts from the database
 *     responses:
 *       200:
 *         description: A list of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

router.get("/blogs", getBlogs);
