import request from "supertest";
import app from "../app.js"

jest.mock('../config/db', () => ({
  db: {},
}));

describe("Health Check", () => {
  it("should return 200 and API is running message", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "API is running" });
  });
});