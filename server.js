import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(express.static("public"));

const videos = JSON.parse(fs.readFileSync("videos.json", "utf8"));

app.get("/api/stream", async (req, res) => {
  const id = req.query.id;
  if (!videos[id]) return res.status(404).send("Invalid ID");

  const videoURL = videos[id];

  const response = await fetch(videoURL, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://classplusapp.com"
    }
  });

  res.setHeader("Content-Type", response.headers.get("content-type"));
  response.body.pipe(res);
});

app.listen(3000, () =>
  console.log("Engineers Babu Player running on port 3000")
);
