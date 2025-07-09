import express from "express";
import Mall from "../models/Mall.js";

const router = express.Router();

// ✅ GET all malls
router.get("/", async (req, res) => {
  try {
    const malls = await Mall.find();
    res.json(malls);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// ✅ GET a mall by MongoDB _id
router.get("/:id", async (req, res) => {
  try {
    const mall = await Mall.findById(req.params.id);
    if (!mall) {
      return res.status(404).json({ message: "Mall not found" });
    }
    res.json(mall);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// ✅ POST: Ajouter un mall
router.post("/", async (req, res) => {
  try {
    const mall = new Mall(req.body);
    await mall.save();
    res.status(201).json(mall);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout du mall", error: err.message });
  }
});

// ✅ PUT: Modifier un mall
router.put('/:id', async (req, res) => {
  try {
    const mall = await Mall.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mall) {
      return res.status(404).json({ message: "Mall non trouvé" });
    }
    res.json(mall);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la modification du mall", error: err.message });
  }
});

// ✅ DELETE: Supprimer un mall
router.delete('/:id', async (req, res) => {
  try {
    const mall = await Mall.findByIdAndDelete(req.params.id);
    if (!mall) {
      return res.status(404).json({ message: "Mall not found" });
    }
    res.json({ message: "Mall supprimé !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
