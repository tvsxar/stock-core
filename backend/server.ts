import "dotenv/config";
import express from "express";

const PORT = process.env.PORT || 1011;

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
