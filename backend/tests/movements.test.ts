import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { resetDb } from "./helpers/resetDb.js";

describe("movements API", () => {
  beforeEach(async () => {
    await resetDb();
  });

  describe("POST /api/products/:id/movements", () => {
    test("should create IN movement and return 201", async () => {
      const reqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };
      const movementReqBody = {
        type: "IN",
        quantity: 10,
        occurred_at: "2026-09-30T18:30:00+03:00",
      };

      const product = await request(app).post("/api/products").send(reqBody);
      const response = await request(app)
        .post(`/api/products/${product.body.product.id}/movements`)
        .send(movementReqBody);

      expect(response.status).toBe(201);
      expect(response.body.movement).toMatchObject({
        type: "IN",
        quantity: 10,
      });
      expect(new Date(response.body.movement.occurred_at)).toEqual(
        new Date(movementReqBody.occurred_at),
      );
    });

    test("should create OUT movement and return 201", async () => {
      const reqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };
      const movementInReqBody = {
        type: "IN",
        quantity: 10,
        occurred_at: "2026-09-30T18:30:00+03:00",
      };
      const movementOutReqBody = {
        type: "OUT",
        quantity: 5,
        occurred_at: "2026-09-30T18:30:00+03:00",
      };

      const product = await request(app).post("/api/products").send(reqBody);
      await request(app)
        .post(`/api/products/${product.body.product.id}/movements`)
        .send(movementInReqBody);
      const response = await request(app)
        .post(`/api/products/${product.body.product.id}/movements`)
        .send(movementOutReqBody);
      const currentStockResponse = await request(app).get(
        `/api/products/${product.body.product.id}`,
      );

      expect(response.status).toBe(201);
      expect(response.body.movement).toMatchObject({
        type: "OUT",
        quantity: 5,
      });
      expect(new Date(response.body.movement.occurred_at)).toEqual(
        new Date(movementOutReqBody.occurred_at),
      );
      expect(currentStockResponse.body.product.stock).toBe(5);
    });

    test("should return 409 when trying to create an OUT movement with insufficient stock", async () => {
      const reqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };
      const movementInReqBody = {
        type: "IN",
        quantity: 10,
        occurred_at: "2026-09-30T18:30:00+03:00",
      };
      const movementOutReqBody = {
        type: "OUT",
        quantity: 11,
        occurred_at: "2026-09-30T18:30:00+03:00",
      };

      const product = await request(app).post("/api/products").send(reqBody);
      await request(app)
        .post(`/api/products/${product.body.product.id}/movements`)
        .send(movementInReqBody);
      const response = await request(app)
        .post(`/api/products/${product.body.product.id}/movements`)
        .send(movementOutReqBody);
      const currentStockResponse = await request(app).get(
        `/api/products/${product.body.product.id}`,
      );

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        "Insufficient stock. Available: 10, requested: 11.",
      );
      expect(currentStockResponse.body.product.stock).toBe(10);
    });

    test("should return 400 when trying to create a movement with a future date", async () => {
      const reqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };
      const movementInReqBody = {
        type: "IN",
        quantity: 10,
        occurred_at: "2153-09-30T18:30:00+03:00",
      };

      const product = await request(app).post("/api/products").send(reqBody);
      const response = await request(app)
        .post(`/api/products/${product.body.product.id}/movements`)
        .send(movementInReqBody);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Movement date cannot be in the future!",
      );
    });

    test("should return 404 when product does not exist", async () => {
      const movementInReqBody = {
        type: "IN",
        quantity: 10,
        occurred_at: "2026-09-30T18:30:00+03:00",
      };

      const response = await request(app)
        .post(`/api/products/9999/movements`)
        .send(movementInReqBody);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product with this id was not found");
    });

    test("should return 400 when body is invalid", async () => {
      const movementInReqBody = {
        type: "ALL",
        quantity: "ten",
        occurred_at: "2026-09-30T18:30:00+03:00",
      };

      const response = await request(app)
        .post(`/api/products/9999/movements`)
        .send(movementInReqBody);
      const paths = response.body.errors.map((error: any) => error.path[0]);

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(2);
      expect(paths).toContain("type");
      expect(paths).toContain("quantity");
    });

    test("should prevent concurrent OUT movements from making stock negative", async () => {
      const reqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };
      const movementInReqBody = {
        type: "IN",
        quantity: 10,
        occurred_at: "2026-09-30T18:30:00+03:00",
      };
      const movementOutReqBody = {
        type: "OUT",
        quantity: 6,
        occurred_at: "2026-09-30T18:30:00+03:00",
      };

      const product = await request(app).post("/api/products").send(reqBody);
      await request(app)
        .post(`/api/products/${product.body.product.id}/movements`)
        .send(movementInReqBody);
      const response = await Promise.all([
        request(app)
          .post(`/api/products/${product.body.product.id}/movements`)
          .send(movementOutReqBody),
        request(app)
          .post(`/api/products/${product.body.product.id}/movements`)
          .send(movementOutReqBody),
      ]);
      const currentStockResponse = await request(app).get(
        `/api/products/${product.body.product.id}`,
      );

      expect([response[0].status, response[1].status]).toContain(409);
      expect([response[0].status, response[1].status]).toContain(201);
      expect(currentStockResponse.body.product.stock).toBe(4);
    });
  });

  describe("GET /api/products/:id/movements", () => {
    test("should return 200 and movements", async () => {
      const reqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };
      const firstMovement = {
        type: "IN",
        quantity: 3,
        occurred_at: "2026-09-30T18:30:00+03:00",
      };
      const secondMovement = {
        type: "IN",
        quantity: 10,
        occurred_at: "2026-09-29T18:30:00+03:00",
      };
      const thirdMovement = {
        type: "IN",
        quantity: 6,
        occurred_at: "2026-09-29T19:30:00+03:00",
      };

      const product = await request(app).post("/api/products").send(reqBody);
      const movements = await Promise.all([
        request(app)
          .post(`/api/products/${product.body.product.id}/movements`)
          .send(firstMovement),
        request(app)
          .post(`/api/products/${product.body.product.id}/movements`)
          .send(secondMovement),
        request(app)
          .post(`/api/products/${product.body.product.id}/movements`)
          .send(thirdMovement),
      ]);
      const response = await request(app).get(
        `/api/products/${product.body.product.id}/movements`,
      );
      const expectedMovements = movements
        .map((movement) => movement.body.movement)
        .sort(
          (a, b) =>
            new Date(b.occurred_at).getTime() -
            new Date(a.occurred_at).getTime(),
        );

      expect(response.status).toBe(200);
      expect(response.body.movements).toEqual(expectedMovements);
    });

    test("should return 200 and empty array when no movements exist", async () => {
      const reqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };

      const product = await request(app).post("/api/products").send(reqBody);
      const response = await request(app).get(
        `/api/products/${product.body.product.id}/movements`,
      );

      expect(response.status).toBe(200);
      expect(response.body.movements).toEqual([]);
    });

    test("should return 404 when product does not exist", async () => {
      const response = await request(app)
        .get(`/api/products/9999/movements`)

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product with this id was not found");
    });

    test("should return 400 when id is invalid", async () => {
      const response = await request(app)
        .get(`/api/products/abc/movements`);

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].path).toContain("id");
    });
  });
});
