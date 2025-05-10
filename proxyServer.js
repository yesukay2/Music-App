import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

// Deezer API endpoint
app.get("/api/deezer", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.deezer.com/chart/0/tracks?limit=10"
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Audio proxy endpoint
app.get("/api/audio", async (req, res) => {
  try {
    const url = decodeURIComponent(req.query.url);
    if (!url) return res.status(400).json({ error: "Missing URL parameter" });

    const audioResponse = await fetch(url, {
      headers: {
        Referer: "https://www.deezer.com/",
        "User-Agent": "Mozilla/5.0",
      },
    });

    res.setHeader("Content-Type", "audio/mpeg");
    audioResponse.body.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vercel requires this export
export default app;
