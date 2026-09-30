import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /api/health", () => {
  test("should return 200", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
