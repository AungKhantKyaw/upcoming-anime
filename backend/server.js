import express from "express";
import cors from "cors";
import animeRouter from "./anime.js";

const app = express();
const PORT = 5002;

// Enable CORS for all origins (or restrict to your frontend URL)
app.use(cors());

// Mount routes
app.use("/api/anime", animeRouter);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
