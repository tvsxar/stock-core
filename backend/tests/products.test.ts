import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { resetDb } from "./helpers/resetDb.js";

describe("products API", () => {
  beforeEach(async () => {
    await resetDb();
  });

  describe("POST /api/products", () => {
    test("should create a product and return 201", async () => {
      const reqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };

      const response = await request(app).post("/api/products").send(reqBody);

      expect(response.status).toBe(201);
      expect(response.body.product).toMatchObject({
        name: "Razer Deathadder",
        sku: "MOUSE-001",
      });
    });

    test("should return 400 when required fields are missing", async () => {
      const reqBody = {};

      const response = await request(app).post("/api/products").send(reqBody);
      const paths = response.body.errors.map((error: any) => error.path[0]);

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(2);
      expect(paths).toContain("sku");
      expect(paths).toContain("name");
    });

    test("should return 400 when fields are empty", async () => {
      const reqBody = { sku: "", name: "   " };

      const response = await request(app).post("/api/products").send(reqBody);
      const paths = response.body.errors.map((error: any) => error.path[0]);

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(2);
      expect(paths).toContain("sku");
      expect(paths).toContain("name");
    });

    test("should return 409 when SKU already exists", async () => {
      const reqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };
      const repeatReqBody = { sku: "MOUSE-001", name: "Razer Deathadder 2" };

      await request(app).post("/api/products").send(reqBody);
      const response = await request(app)
        .post("/api/products")
        .send(repeatReqBody);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        "Product with this SKU already exists",
      );
    });
  });

  describe("GET /api/products", () => {
    test("should return products array and status 200", async () => {
      await request(app)
        .post("/api/products")
        .send({ sku: "MOUSE-001", name: "Razer Deathadder V1" });
      await request(app)
        .post("/api/products")
        .send({ sku: "MOUSE-021", name: "Razer Deathadder V2" });

      const response = await request(app).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sku: "MOUSE-001",
            name: "Razer Deathadder V1",
            stock: 0,
          }),
          expect.objectContaining({
            sku: "MOUSE-021",
            name: "Razer Deathadder V2",
            stock: 0,
          }),
        ]),
      );
    });

    test("should return empty products array when no products exist", async () => {
      const expectedResult = {
        products: [],
      };

      const response = await request(app).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(expectedResult);
    });
  });

  describe("GET /api/products/:id", () => {
    test("should return product by id and status 200", async () => {
      const product = await request(app)
        .post("/api/products")
        .send({ sku: "MOUSE-001", name: "Razer Deathadder V1" });

      const response = await request(app).get(
        `/api/products/${product.body.product.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.product).toMatchObject({
        sku: "MOUSE-001",
        name: "Razer Deathadder V1",
        stock: 0,
      });
    });

    test("should return 404 when product does not exist", async () => {
      const response = await request(app).get(`/api/products/999999`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product with this id doesn`t exist");
    });

    test("should return 400 when product id is invalid", async () => {
      const response = await request(app).get(`/api/products/abc`);

      expect(response.status).toBe(400);
      expect(response.body.errors[0].path).toContain("id");
    });
  });

  describe("PATCH /api/products/:id", () => {
    test("should update product and return 200", async () => {
      const createReqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };
      const updateReqBody = { name: "Razer Deathadder V2" };

      const product = await request(app)
        .post("/api/products")
        .send(createReqBody);
      const updated = await request(app)
        .patch(`/api/products/${product.body.product.id}`)
        .send(updateReqBody);
      const response = await request(app).get(
        `/api/products/${product.body.product.id}`,
      );

      expect(updated.status).toBe(200);
      expect(updated.body.product).toMatchObject({
        name: "Razer Deathadder V2",
        sku: "MOUSE-001",
      });
      expect(response.body.product).toMatchObject({
        name: "Razer Deathadder V2",
        sku: "MOUSE-001",
      });
    });

    test("should return 400 when name field is empty", async () => {
      const createReqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };
      const updateReqBody = { name: "  " };

      const product = await request(app)
        .post("/api/products")
        .send(createReqBody);
      const response = await request(app)
        .patch(`/api/products/${product.body.product.id}`)
        .send(updateReqBody);
      const paths = response.body.errors.map((error: any) => error.path[0]);

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(1);
      expect(paths).toContain("name");
    });

    test("should return 400 when trying to update SKU", async () => {
      const createReqBody = { sku: "MOUSE-001", name: "Razer Deathadder" };
      const updateReqBody = { sku: "MOUSE-002", name: "Razer Deathadder 2" };

      const product = await request(app)
        .post("/api/products")
        .send(createReqBody);
      const response = await request(app)
        .patch(`/api/products/${product.body.product.id}`)
        .send(updateReqBody);

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].keys[0]).toBe("sku");
    });

    test("should return 404 when product does not exist", async () => {
      const updateReqBody = { name: "Razer Deathadder 2" };

      const response = await request(app)
        .patch(`/api/products/99999`)
        .send(updateReqBody);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product with this id doesn`t exist");
    });
  });
});
