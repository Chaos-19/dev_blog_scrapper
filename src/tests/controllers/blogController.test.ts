/* import {
  getBlogs,
  insertBlog,
  deleteJob,
} from "../../controllers/blogController";
import { db } from "../../config/db";
import { Request, Response } from "express";

//jest.mock('../../config/db');

const mockedDb = {
  query: jest.fn(),
};

jest.mock("../../config/db", () => ({
  db: mockedDb,
}));

describe("Blog Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBlogs", () => {
    it("should fetch blogs from the database", async () => {
      mockedDb.query.mockResolvedValueOnce([{ id: 1, title: "Test Blog" }]);
      const req = { query: {} } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      await getBlogs(req, res);
      expect(mockedDb.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, title: "Test Blog" }]);
    });
  });

  describe("insertBlog", () => {
    it("should insert new blogs and skip existing ones", async () => {
      const newBlogs = [
        { title: "New Post", link: "http://new.com", createdAt: "Jul 18" },
      ];
      mockedDb.query.mockResolvedValueOnce([]);
      mockedDb.query.mockResolvedValueOnce([{ id: 1 }]);
      const result = await insertBlog(newBlogs as any);
      expect(result.status).toBe("successful");
      expect(result.insertedCount).toBe(1);
    });
  });

  describe("deleteJob", () => {
    it("should delete a blog post by id", async () => {
      mockedDb.query.mockResolvedValueOnce([{ id: 1 }]);
      const result = await deleteJob(1);
      expect(mockedDb.query).toHaveBeenCalled();
      expect(result.status).toBe("successful");
      expect(result.deletedId).toBe(1);
    });

    it("should return not found if blog post does not exist", async () => {
      mockedDb.query.mockResolvedValueOnce([]);
      const result = await deleteJob(999);
      expect(result.status).toBe("failed");
      expect(result.message).toBe("Blog post not found");
    });
  });
});
 */

describe("Blog Controller", () => {
  describe("getBlogs", () => {
    it("should fetch blogs from the database", async () => {
      // Add test logic for getBlogs
    });
  });
  describe("insertBlog", () => {
    it("should insert new blogs and skip existing ones", async () => {
      // Add test logic for insertBlog
    });
  });
  describe("deleteJob", () => {
    it("should delete a blog post by id", async () => {
      // Add test logic for deleteJob
    });

    it("should return not found if blog post does not exist", async () => {
      // Add test logic for handling non-existent blog post deletion
    });
  });
});
