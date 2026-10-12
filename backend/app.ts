import "dotenv/config";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import movementRoutes from "./routes/movement.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/products", productRoutes);
app.use("/api/products", movementRoutes);

export default app;
