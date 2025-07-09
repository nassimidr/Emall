"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ShopCard from "@/components/ShopCard"
import ProductCard from "@/components/ProductCard"
import Link from "next/link" 

// Ajouter les types Shop et Product
interface Shop {
  id: string;
   _id: string; // <-- ajoute ceci
  name: string;
  description: string;
  image: string;
  rating: number;
  tags: string[];
  mallName: string;
  mallId: string;
  location: string;
  productCount: number;
  category: string;
}

interface Product {
  _id: string
  id: string
  name: string
  description: string
  image: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  tags: string[]
  shopName: string
  shopId: string
  category: string
  brand?: string
  material?: string
  care?: string
  images?: string[] // Added images to the Product interface
}

export default function ShopsPage() {
  const [allShops, setAllShops] = useState<Shop[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("shops") // "shops" or "products"
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedRating, setSelectedRating] = useState("any")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    Promise.all([
      fetch("http://localhost:5000/api/shops").then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json()
      }),
      fetch("http://localhost:5000/api/products").then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json()
      }),
    ])
      .then(([shopsData, productsData]) => {
        setAllShops(shopsData)
        setAllProducts(productsData)
      })
      .catch((err) => {
        console.error("Erreur de chargement des données :", err);
        setError("Impossible de charger les boutiques")
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <img src="/placeholder-logo.svg" alt="Loading..." className="w-24 h-24 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Erreur de connexion</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  // Get unique values for filters
  const categories = [...new Set(allShops.map((shop) => shop.category).filter(Boolean))]
  const locations = [...new Set(allShops.map((shop) => shop.location).filter(Boolean))]

  // Filter shops based on search and filters
  const filteredShops = allShops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || shop.category === selectedCategory
    const matchesLocation = selectedLocation === "all" || shop.location === selectedLocation
    const matchesRating = selectedRating === "any" || shop.rating >= Number.parseFloat(selectedRating)

    return matchesSearch && matchesCategory && matchesLocation && matchesRating
  })

  // Filter products and group by shop when searching for products
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesSearch
  })

  // Group products by shop
  const productsByShop = filteredProducts.reduce(
    (acc, product) => {
      const shopId = product.shopId
      // On cherche le shop par _id (MongoDB) ou id (dummy)
      let shop = allShops.find((s) => s._id === shopId || s.id === shopId)
      if (!shop) return acc
      const shopKey = shop._id || shop.id
      if (!acc[shopKey]) {
        acc[shopKey] = {
          shop,
          products: [],
        }
      }
      acc[shopKey].products.push(product)
      return acc
    },
    {} as Record<string, { shop: (typeof allShops)[0]; products: typeof filteredProducts }>,
  )

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedLocation("all")
    setSelectedRating("any")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Discover Shops
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find amazing shops and products across our premium shopping destinations
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl premium-shadow p-6 mb-8 elegant-border">
          {/* Search Type Toggle */}
          <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 max-w-md">
            <button
              onClick={() => setSearchType("shops")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                searchType === "shops"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Search Shops
            </button>
            <button
              onClick={() => setSearchType("products")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                searchType === "products"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Search Products
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={
                searchType === "shops"
                  ? "Search for shops, brands, categories..."
                  : "Search for products across all shops..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg"
            />
          </div>

          {/* Filters - Only show for shop search */}
          {searchType === "shops" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? "block" : "hidden md:grid"}`}>
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {[...new Set(categories.filter(Boolean))].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Location Filter */}
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Rating Filter */}
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Min Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Rating</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>

              {/* Active Filters */}
              {(selectedCategory !== "all" || selectedLocation !== "all" || selectedRating !== "any") && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                      {selectedCategory} ×
                    </Badge>
                  )}
                  {selectedLocation !== "all" && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedLocation("all")}>
                      {selectedLocation} ×
                    </Badge>
                  )}
                  {selectedRating !== "any" && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedRating("any")}>
                      {selectedRating}+ Stars ×
                    </Badge>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {searchType === "shops"
              ? `Showing ${filteredShops.length} of ${allShops.length} shops`
              : `Found ${filteredProducts.length} products in ${Object.keys(productsByShop).length} shops`}
          </p>
        </div>

        {/* Shop Results */}
        {searchType === "shops" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map((shop) => (
             <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        )}

        {/* Product Results - Grouped by Shop */}
        {searchType === "products" && (
          <div className="space-y-12">
            {Object.values(productsByShop).map(({ shop, products }) => (
              <div key={shop._id || shop.id} className="bg-white dark:bg-gray-800 rounded-xl premium-shadow p-6 elegant-border">
                {/* Shop Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <img
                      src={shop.image || "/placeholder.svg"}
                      alt={shop.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{shop.mallName}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {shop.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {products.length} matching product{products.length !== 1 ? "s" : ""}
                    </p>
                    <Link href={shop._id ? `/shops/${shop._id}` : shop.id ? `/shops/${shop.id}` : '#'}>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent" disabled={!(shop._id || shop.id)}>
                        Visit Shop
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id || product.id} product={{
                      ...product,
                      _id: product._id || product.id,
                      image: product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.svg')
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {((searchType === "shops" && filteredShops.length === 0) ||
          (searchType === "products" && filteredProducts.length === 0)) && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No {searchType === "shops" ? "shops" : "products"} found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Try adjusting your search terms {searchType === "shops" ? "or filters" : ""}
            </p>
            {searchType === "shops" && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
