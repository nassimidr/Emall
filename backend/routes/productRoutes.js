import express from "express";
import Product from "../models/Product.js"; 
import Review from "../models/Review.js";
import { auth } from "../middleware/auth.js";
import { sendMail } from '../utils/mailer.js';
import Shop from '../models/Shop.js';

const router = express.Router();

// ✅ GET: Tous les produits
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ GET: Produits d'un shop spécifique
router.get("/shop/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    if (!shopId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID du shop invalide" });
    }

    const products = await Product.find({ shopId });
    res.json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits du shop :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET: Avis d'un produit
router.get('/:productId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'fullName name email').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// POST: Ajouter un avis (authentifié)
router.post('/:productId/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) return res.status(400).json({ message: 'Note et commentaire obligatoires' });
    // Un seul avis par user par produit
    const existing = await Review.findOne({ productId: req.params.productId, userId: req.user.id });
    if (existing) return res.status(400).json({ message: 'Vous avez déjà laissé un avis pour ce produit.' });
    const review = new Review({
      productId: req.params.productId,
      userId: req.user.id || req.user._id || req.user.userId,
      rating,
      comment
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout de l'avis", error: err.message });
  }
});

// ✅ GET: Un seul produit par ID
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ POST: Ajouter un produit
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout du produit", error: err.message });
  }
});

// ✅ PUT: Modifier un produit
router.put('/:id', async (req, res) => {
  console.log("ROUTE PUT appelée", req.params.id, req.body);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log("Produit non trouvé");
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    const wasOutOfStock = product.inStock === false;
    Object.assign(product, req.body);
    await product.save();
    console.log('wasOutOfStock:', wasOutOfStock, 'product.inStock:', product.inStock, 'notifyEmails:', product.notifyEmails);
    if (wasOutOfStock && product.inStock && Array.isArray(product.notifyEmails) && product.notifyEmails.length > 0) {
      console.log('Déclenchement de l\'envoi d\'email à :', product.notifyEmails);
      let fromEmail = process.env.GMAIL_USER;
      if (product.shopId) {
        const shop = await Shop.findById(product.shopId);
        if (shop && shop.email) fromEmail = shop.email;
      }
      const subject = "Votre produit est de nouveau en stock !";
      const text = `Bonjour,\n\nLe produit \"${product.name}\" est de nouveau disponible sur notre boutique ! Rendez-vous vite sur le site pour le commander.\n\nCeci est un message automatique.`;
      for (const email of product.notifyEmails) {
        try {
          await sendMail({ to: email, subject, text, from: fromEmail });
          console.log('Email envoyé à', email);
        } catch (e) {
          console.error("Erreur lors de l'envoi de l'email à", email, e);
        }
      }
      product.notifyEmails = [];
      await product.save();
    }
    res.json(product);
  } catch (err) {
    console.error("Erreur dans la route PUT :", err);
    res.status(400).json({ message: "Erreur lors de la modification du produit", error: err.message });
  }
});

// ✅ DELETE: Supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json({ message: "Produit supprimé !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// POST: S'inscrire pour être notifié quand le produit est en stock
router.post('/:id/notify-when-in-stock', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: "Email requis" });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produit non trouvé" });
    // Ajoute le champ notifyEmails s'il n'existe pas
    if (!product.notifyEmails) product.notifyEmails = [];
    // N'ajoute pas de doublon
    if (!product.notifyEmails.includes(email)) {
      product.notifyEmails.push(email);
      await product.save();
    }
    res.json({ message: "Inscription au rappel enregistrée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
