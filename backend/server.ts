import "dotenv/config";
import express from "express";
import productRoutes from './routes/product.routes.js';
import movementRoutes from './routes/movement.route.js';

const PORT = process.env.PORT || 1011;

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use('/api/products', productRoutes);
app.use('/api/products', movementRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
