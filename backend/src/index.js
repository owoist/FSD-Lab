import { apiReference } from "@scalar/express-api-reference";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { calculate, benchmarks } from "./calc.js";
import spec from "./openapi.js";

const { PORT = 4000, MONGODB_URI, FRONTEND_URL = "http://localhost:3000" } = process.env;
const Footprint = mongoose.model(
  "Footprint",
  new mongoose.Schema(
    { userId: { type: String, index: true }, month: String, inputs: Object, result: Object },
    { timestamps: true },
  ).index({ userId: 1, month: 1 }, { unique: true }),
);

// Validates the Better Auth session by asking the Next.js app who the cookie belongs to.
const requireUser = async (req, res, next) => {
  try {
    const r = await fetch(`${FRONTEND_URL}/api/auth/get-session`, {
      headers: { cookie: req.headers.cookie || "" },
    });
    const s = r.ok ? await r.json() : null;
    if (!s?.user) return res.status(401).json({ error: "Unauthorized" });
    req.userId = s.user.id;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

const app = express();
app.use(cors({ origin: FRONTEND_URL, credentials: true }), express.json());
app.use("/docs", apiReference({ content: spec }));
app.get("/openapi.json", (_, res) => res.json(spec));

app.get("/api/benchmarks", (_, res) => res.json(benchmarks));
app.post("/api/calculate", (req, res) => res.json(calculate(req.body)));

app.get("/api/footprints", requireUser, async (req, res) =>
  res.json(await Footprint.find({ userId: req.userId }).sort({ month: 1 })),
);

app.post("/api/footprints", requireUser, async (req, res) => {
  const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(req.body.month)
    ? req.body.month
    : new Date().toISOString().slice(0, 7);
  const { month: _, ...inputs } = req.body;
  res.json(
    await Footprint.findOneAndUpdate(
      { userId: req.userId, month },
      { inputs, result: calculate(inputs) },
      { upsert: true, new: true },
    ),
  );
});

app.delete("/api/footprints/:id", requireUser, async (req, res) => {
  const d = await Footprint.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  d ? res.json({ deleted: true }) : res.status(404).json({ error: "Not found" });
});

app.use((err, _req, res, _next) => res.status(500).json({ error: err.message }));

await mongoose.connect(MONGODB_URI);
app.listen(PORT, () =>
  console.log(`API http://localhost:${PORT}  Docs http://localhost:${PORT}/docs`),
);
