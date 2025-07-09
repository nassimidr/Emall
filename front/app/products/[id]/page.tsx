"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { use } from "react"
import Link from "next/link"
import { Heart, Share2, Bell, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import ImageCarousel from "@/components/ImageCarousel"
import RatingStars from "@/components/RatingStars"
import { useAuth } from "@/hooks/useAuth";

// Dummy product data
const productData = {
  id: "1",
  name: "Veste en jean classique",
  description: "Veste en denim style vintage avec coupe moderne et tissu premium.",
  fullDescription:
    "Cette veste en jean vintage allie style intemporel et confort moderne. Taillée dans un denim de qualité, elle présente une coupe légèrement ample, parfaite pour les superpositions. Le style vintage est accentué par des boutons classiques, poches poitrine et un léger effet usé. Polyvalente et élégante au quotidien.",
  images: [
    "https://i.pinimg.com/736x/f3/e6/97/f3e6971203c97781fc26e8ee782c995e.jpg",
    "https://i.pinimg.com/736x/19/ad/c3/19adc36b674e7fff574a85e4479978cc.jpg",
    "https://i.pinimg.com/736x/dc/75/6f/dc756f5f68e01d7c15aa2b896e448a1e.jpg",
    "https://i.pinimg.com/736x/83/c5/ee/83c5ee0dd96dffee8a32f760e7c5a807.jpg",
  ],
  price: 890,              // en dirhams marocains
  originalPrice: 1200,
  discount: 26,
  rating: 4.6,
  totalReviews: 128,
  tags: ["Denim", "Veste", "Casual", "Vintage"],
  shopName: "Urban Threads Rabat",
  shopId: "2",
  category: "Outerwear",
  brand: "Urban Classic Rabat",
  material: "Denim 100 % coton",
  care: "Lavable en machine à froid, sèche-linge doux",
  variants: [
    { id: "1", sku: "DJ-RAB-001-S-BLEU", size: "S", color: "Bleu", price: 890, stock: 5 },
    { id: "2", sku: "DJ-RAB-001-M-BLEU", size: "M", color: "Bleu", price: 890, stock: 12 },
    { id: "3", sku: "DJ-RAB-001-L-BLEU", size: "L", color: "Bleu", price: 890, stock: 8 },
    { id: "4", sku: "DJ-RAB-001-XL-BLEU", size: "XL", color: "Bleu", price: 890, stock: 3 },
    { id: "5", sku: "DJ-RAB-001-S-NOIR", size: "S", color: "Noir", price: 940, stock: 0 },
    { id: "6", sku: "DJ-RAB-001-M-NOIR", size: "M", color: "Noir", price: 940, stock: 7 },
    { id: "7", sku: "DJ-RAB-001-L-NOIR", size: "L", color: "Noir", price: 940, stock: 15 },
    { id: "8", sku: "DJ-RAB-001-XL-NOIR", size: "XL", color: "Noir", price: 940, stock: 2 },
  ],
}


const reviews = [
  {
    id: "1",
    user: "Sarah M.",
    rating: 5,
    date: "2024-01-15",
    comment: "Perfect fit and great quality! The denim feels premium and the vintage look is exactly what I wanted.",
    verified: true,
  },
  {
    id: "2",
    user: "Mike R.",
    rating: 4,
    date: "2024-01-10",
    comment: "Good jacket overall. Runs a bit large so consider sizing down. Material is nice and sturdy.",
    verified: true,
  },
  {
    id: "3",
    user: "Emma L.",
    rating: 5,
    date: "2024-01-08",
    comment: "Love this jacket! It goes with everything and the quality is excellent for the price.",
    verified: false,
  },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { user, getToken } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Next.js 15: params peut être une Promise ou un objet direct
  let unwrappedParams: { id: string };
  if (params && typeof (params as any).then === "function") {
    unwrappedParams = use(params) as { id: string };
  } else {
    unwrappedParams = params as { id: string };
  }
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    fetch(`http://localhost:5000/api/products/${unwrappedParams.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Produit introuvable")
        const data = await res.json()
        setProduct(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [unwrappedParams.id])

  // Charger les avis du produit
  useEffect(() => {
    if (!product) return;
    setReviewLoading(true);
    fetch(`http://localhost:5000/api/products/${product._id}/reviews`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des avis");
        const data = await res.json();
        setReviews(data);
      })
      .catch((err) => setReviewError(err.message))
      .finally(() => setReviewLoading(false));
  }, [product]);

  // Soumettre un nouvel avis
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRating || !newComment) return;
    setSubmitting(true);
    setReviewError("");
    try {
      const res = await fetch(`http://localhost:5000/api/products/${product._id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ rating: newRating, comment: newComment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de l'envoi de l'avis");
      }
      setNewRating(0);
      setNewComment("");
      // Rafraîchir les avis
      fetch(`http://localhost:5000/api/products/${product._id}/reviews`)
        .then(async (res) => {
          if (!res.ok) throw new Error();
          const data = await res.json();
          setReviews(data);
        });
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Produit introuvable"}</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/shops" className="hover:text-gray-900 dark:hover:text-white">Shops</Link>
            <span>/</span>
            <Link href={product.shopId ? `/shops/${product.shopId}` : '#'} className="hover:text-gray-900 dark:hover:text-white">{product.shopName}</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{product.name}</span>
          </div>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <ImageCarousel images={product.images && product.images.length ? product.images : [product.image]} alt={product.name} />
          </div>
          {/* Product Info */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl premium-shadow p-6 elegant-border">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700">{product.category}</Badge>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <RatingStars rating={product.rating} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">({product.totalReviews || 0} reviews)</span>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{product.price} DH</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">{product.originalPrice} DH</span>
                      {product.discount && <Badge className="bg-red-500 text-white">-{product.discount}%</Badge>}
                    </>
                  )}
                </div>
                {/* Affichage du stock */}
                <div className="mb-2">
                  {product.inStock ? (
                    <Badge className="bg-blue-500 text-white">En stock</Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white">Rupture de stock</Badge>
                  )}
                </div>
                {/* Affichage des tailles disponibles */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tailles disponibles :</span>
                    {product.sizes.map((size: string) => (
                      <Badge key={size} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700">{size}</Badge>
                    ))}
                  </div>
                )}
                <p className="text-gray-600 dark:text-gray-300 mb-6">{product.fullDescription || product.description}</p>
              </div>
              {/* Tags, Brand, Material, Care */}
              <div className="mb-4 flex flex-wrap gap-2">
                {product.tags && product.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>)}
                {product.brand && <Badge variant="outline">{product.brand}</Badge>}
                {product.material && <Badge variant="outline">{product.material}</Badge>}
              </div>
              {product.care && <div className="mb-4 text-sm text-gray-500">Conseils d'entretien : {product.care}</div>}
              {/* Stock, Add to cart, etc. (à personnaliser selon ton besoin) */}
              {!product.inStock && (
                <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl flex flex-col gap-2">
                  <span className="text-blue-700 dark:text-blue-200 font-medium">Ce produit est actuellement en rupture de stock.</span>
                  {user ? (
                    <Button
                      className="w-fit bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={async () => {
                        const res = await fetch(`http://localhost:5000/api/products/${product._id}/notify-when-in-stock`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: user.email }),
                        });
                        if (res.ok) {
                          alert("Vous serez prévenu par email dès que ce produit sera de nouveau en stock.");
                        } else {
                          alert("Erreur lors de l'inscription au rappel.");
                        }
                      }}
                    >
                      Me prévenir quand ce produit est disponible
                    </Button>
                  ) : (
                    <NotifyWhenInStockForm productId={product._id} />
                  )}
                </div>
              )}
            </div>
            {/* Avis / Commentaires */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Avis des utilisateurs</h2>
              {reviewLoading ? (
                <div>Chargement des avis...</div>
              ) : reviewError ? (
                <div className="text-red-500">{reviewError}</div>
              ) : reviews.length === 0 ? (
                <div>Aucun avis pour ce produit.</div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-1">
                        <RatingStars rating={r.rating} size={20} />
                        <span className="font-semibold text-blue-700 dark:text-blue-300">{r.userId?.fullName || r.userId?.name || "Utilisateur"}</span>
                        <span className="text-xs text-gray-500 ml-2">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 mt-1">{r.comment}</div>
                    </div>
                  ))}
                </div>
              )}
              {/* Formulaire d'ajout d'avis */}
              <div className="mt-8">
                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block mb-1 font-medium">Votre note :</label>
                      <RatingStars
                        rating={newRating}
                        onChange={setNewRating}
                        size={32}
                      />
                      {newRating === 0 && <div className="text-xs text-gray-400 mt-1">Cliquez sur une étoile pour noter</div>}
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Votre avis :</label>
                      <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        required
                        className="border rounded-xl px-4 py-3 w-full min-h-[80px] shadow focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        placeholder="Partagez votre expérience..."
                      />
                    </div>
                    {reviewError && <div className="text-red-500">{reviewError}</div>}
                    <Button
                      type="submit"
                      disabled={submitting || !newRating || !newComment}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold shadow-lg hover:scale-105 transition-all"
                    >
                      {submitting ? "Envoi..." : "Envoyer mon avis"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center text-gray-500">Connectez-vous pour laisser un avis.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotifyWhenInStockForm({ productId }: { productId: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  return sent ? (
    <div className="text-green-600 dark:text-green-300">Vous serez prévenu par email dès que ce produit sera de nouveau en stock.</div>
  ) : (
    <form
      className="flex flex-col gap-2"
      onSubmit={async e => {
        e.preventDefault();
        setError("");
        const res = await fetch(`http://localhost:5000/api/products/${productId}/notify-when-in-stock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (res.ok) {
          setSent(true);
        } else {
          setError("Erreur lors de l'inscription au rappel.");
        }
      }}
    >
      <Input
        type="email"
        required
        placeholder="Votre email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="max-w-xs"
      />
      <Button type="submit" className="w-fit bg-blue-600 hover:bg-blue-700 text-white">Me prévenir</Button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </form>
  );
}
