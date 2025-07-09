// routes/shopRoutes.js
import express from "express";
import Shop from "../models/Shop.js";

const router = express.Router();

// ✅ GET all shops
router.get("/", async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// ✅ GET one shop by ID
router.get("/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop non trouvé" });
    }
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// ✅ GET shops by mallId
router.get("/mall/:mallId", async (req, res) => {
  try {
    const mallId = req.params.mallId;
    const shops = await Shop.find({ mallId }); // Attention: le champ mallId doit exister dans ton modèle Shop
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// ✅ GET shop by name (case-insensitive)
router.get("/name/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const shop = await Shop.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (!shop) {
      return res.status(404).json({ message: "Shop non trouvé" });
    }
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// ✅ POST: Ajouter un shop
router.post("/", async (req, res) => {
  try {
    const shop = new Shop(req.body);
    await shop.save();
    res.status(201).json(shop);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout du shop", error: err.message });
  }
});

// ✅ PUT: Modifier un shop
router.put('/:id', async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shop) {
      return res.status(404).json({ message: "Shop non trouvé" });
    }
    res.json(shop);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la modification du shop", error: err.message });
  }
});

// ✅ DELETE: Supprimer un shop
router.delete('/:id', async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop non trouvé" });
    }
    res.json({ message: "Shop supprimé !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
