"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Phone, Mail, ExternalLink, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageCarousel from "@/components/ImageCarousel"
import ProductCard from "@/components/ProductCard"
import RatingStars from "@/components/RatingStars"
import InteractiveMap from "@/components/InteractiveMap"
import axios from "axios";

interface ShopData {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  images: string[];
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  totalReviews: number;
  tags: string[];
  hours: Record<string, string>;
  socialMedia: Record<string, string>;
}

interface ShopProduct {
  _id: string
  id: string
  shopId: string
  name: string
  description: string
  image: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  tags: string[]
  shopName: string
  category: string
  inStock: boolean
}

export default function ShopDetailPage({ params }: { params: any }) {
  const [shopData, setShopData] = useState<ShopData | null>(null)
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  // Validation de l'ID MongoDB
  const validateMongoId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id)
  }

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const paramsObj = await params;
      const { id } = paramsObj;
      if (!validateMongoId(id) && isMounted) {
        setError("ID de boutique invalide");
        setIsLoading(false);
        return;
      }
      setIsLoading(true)
      setError(null)
      const baseURL = "http://localhost:5000"
      Promise.all([
        axios.get(`${baseURL}/api/shops/${id}`),
        axios.get(`${baseURL}/api/products/shop/${id}`)
      ])
        .then(([shopRes, productsRes]) => {
          if (!isMounted) return;
          setShopData(shopRes.data)
          setShopProducts(productsRes.data)
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error("❌ Erreur Axios :", err.response?.data || err.message)
          if (err.response?.status === 404) {
            setError("Boutique non trouvée")
          } else {
            setError("Impossible de charger les données de la boutique")
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false)
        })
    })();
    return () => { isMounted = false; };
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <img src="/placeholder-logo.svg" alt="Loading..." className="w-24 h-24 animate-spin" />
      </div>
    )
  }

  if (error || !shopData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Erreur</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || "Données de boutique non disponibles"}</p>
          <Link href="/shops">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
              Retour aux boutiques
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Get unique categories
  const categories = [...new Set(shopProducts.map((product) => product.category))]

  // Filter and sort products
  const filteredProducts = shopProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/shops" className="hover:text-gray-900 dark:hover:text-white">
              Shops
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{shopData.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <ImageCarousel images={shopData.images} alt={shopData.name} />
            </div>

            {/* Shop Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl premium-shadow p-6 mb-8 elegant-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{shopData.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <RatingStars rating={shopData.rating} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{shopData.totalReviews} reviews</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {shopData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">{shopData.fullDescription}</p>

              {/* Hours */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Opening Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {shopData.hours && typeof shopData.hours === 'object' && shopData.hours !== null &&
                    Object.entries(shopData.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{day}:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{hours}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl premium-shadow p-6 mb-6 elegant-border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="text-gray-900 dark:text-white">{shopData.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <a href={`tel:${shopData.phone}`} className="text-gray-900 dark:text-white hover:underline">
                      {shopData.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <a href={`mailto:${shopData.email}`} className="text-gray-900 dark:text-white hover:underline">
                      {shopData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Website</p>
                    <a
                      href={`https://${shopData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 dark:text-white hover:underline"
                    >
                      {shopData.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Follow us</p>
                <div className="flex space-x-3">
                  {shopData.socialMedia && shopData.socialMedia.facebook && (
                    <a
                      href={shopData.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {shopData.socialMedia && shopData.socialMedia.instagram && (
                    <a
                      href={shopData.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-pink-600"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387z" />
                      </svg>
                    </a>
                  )}
                  {shopData.socialMedia && shopData.socialMedia.twitter && (
                    <a
                      href={shopData.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <InteractiveMap
              address={shopData.address}
              name={shopData.name}
              coordinates={{ lat: 40.7505, lng: -73.9934 }} // Example coordinates
            />
          </div>
        </div>

        {/* Products Section - Full Width */}
        <div className="bg-white dark:bg-gray-800 rounded-xl premium-shadow p-8 elegant-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Products</h2>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Search and Filters */}
          <div className={`space-y-6 mb-8 ${showFilters ? "block" : "hidden md:block"}`}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Search */}
              <div className="md:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="md:col-span-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.filter(Boolean).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="md:col-span-1">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="md:col-span-1">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSortBy("featured")
                  }}
                  className="w-full h-12"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory !== "all") && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer text-sm py-1 px-3"
                    onClick={() => setSearchQuery("")}
                  >
                    Search: "{searchQuery}" ×
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer text-sm py-1 px-3"
                    onClick={() => setSelectedCategory("all")}
                  >
                    {selectedCategory} ×
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Products Grid - More columns for better space utilization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No products found</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                size="lg"
              >
                Clear Search & Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
