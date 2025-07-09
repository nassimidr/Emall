// backend/controllers/searchController.js
import Mall from "../models/Mall.js";
import Shop from "../models/Shop.js";
import Product from "../models/Product.js";

export const searchAll = async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  try {
    const malls = await Mall.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    const shops = await Shop.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.json({ malls, shops, products });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
