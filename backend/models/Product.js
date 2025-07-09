import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  fullDescription: String,
  images: [String],
  price: {
    type: Number,
    required: true,
  },
  originalPrice: Number,
  discount: Number,
  rating: Number,
  totalReviews: Number,
  tags: [String],
  shopName: String,
  shopId: String, // tu peux le remplacer par type: mongoose.Schema.Types.ObjectId si tu fais une vraie relation
  category: String,
  brand: String,
  material: String,
  care: String,
  inStock: {
    type: Boolean,
    default: true,
  },
  sizes: [String],
  notifyEmails: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});
const Product = mongoose.model("Product", productSchema);
export default Product;
