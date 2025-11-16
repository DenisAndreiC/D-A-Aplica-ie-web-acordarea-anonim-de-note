import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Backend OK – Faza 0" });
});

export default app;
