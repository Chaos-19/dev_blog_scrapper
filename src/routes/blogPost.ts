import e, { Router } from "express";

import { getBlogs, insertBlog, deleteJob } from "../controllers/blogController.js";

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
router.post("/insert", (req, res) => {
  const data = req.body;
    insertBlog(data)
        .then(() => res.status(201).json({ message: "Blog inserted successfully" }))
        .catch((error) => res.status(500).json({ error: error.message }));
});


export default router;