import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import mallRoutes from "./routes/mallRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import authRoutes from './routes/authRoutes.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Configuration CORS améliorée
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use("/api/malls", mallRoutes);
app.use('/api/shops', shopRoutes)
app.use("/api/products", productRoutes);
app.use('/api/search', searchRoutes)
app.use("/api/auth", authRoutes)




app.get("/", (req, res) => {
  res.send("🎉 API eMall est en ligne !");
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Erreur MongoDB :", err.message));
