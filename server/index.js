import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "db.json");

const app = express();
app.use(cors());
app.use(express.json());

const readDb = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
const writeDb = (db) => fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

// GET /orders - list all orders
app.get("/orders", (req, res) => {
  const db = readDb();
  res.json(db.orders);
});

// GET /orders/:id - order details
app.get("/orders/:id", (req, res) => {
  const db = readDb();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

// PATCH /orders/:id/status - update order status
app.patch("/orders/:id/status", (req, res) => {
  const db = readDb();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "status is required" });

  order.status = status;
  writeDb(db);
  res.json(order);
});

// POST /orders/:id/notes - add a note to an order
app.post("/orders/:id/notes", (req, res) => {
  const db = readDb();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "text is required" });

  const note = {
    id: `N-${Date.now()}`,
    text,
    createdAt: new Date().toISOString(),
  };
  order.notes.push(note);
  writeDb(db);
  res.status(201).json(order);
});

// PATCH /orders/:id - generic update (favorite, archived, etc.)
app.patch("/orders/:id", (req, res) => {
  const db = readDb();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  Object.assign(order, req.body);
  writeDb(db);
  res.json(order);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Orders API running at http://localhost:${PORT}`);
});
