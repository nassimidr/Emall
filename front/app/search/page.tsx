"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import MallCard from "@/components/MallCard"
import ShopCard from "@/components/ShopCard"
import ProductCard from "@/components/ProductCard"
import axios from "axios"

interface Mall {
  _id: string
  name: string
  description: string
  image: string
  location?: string
  rating?: number
  tags?: string[]
}

interface Shop {
  _id: string
  name: string
  description: string
  image: string
  rating?: number
  tags?: string[]
  location?: string
  category?: string
}

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  tags: string[]
  rating?: number
  shopName?: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [activeTab, setActiveTab] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [discountedOnly, setDiscountedOnly] = useState(searchParams.get("discounted") === "true")
  const [sortBy, setSortBy] = useState("relevance")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filteredResults, setFilteredResults] = useState<{
    malls: Mall[]
    shops: Shop[]
    products: Product[]
  }>({
    malls: [],
    shops: [],
    products: [],
  })

  const categories = ["Electronics", "Fashion", "Home", "Sports", "Books", "Beauty"]

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery.trim() === "") {
        setFilteredResults({ malls: [], shops: [], products: [] });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:5000/api/search?q=${searchQuery}`)
        setFilteredResults(response.data)
      } catch (error: any) {
        console.error("Erreur de recherche :", error)
        setError("Impossible d'effectuer la recherche")
        setFilteredResults({ malls: [], shops: [], products: [] })
      } finally {
        setIsLoading(false);
      }
    }

    fetchData()
  }, [searchQuery])

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearFilters = () => {
    setPriceRange([0, 1000])
    setSelectedCategories([])
    setDiscountedOnly(false)
    setSortBy("relevance")
  }

  const filteredProducts = filteredResults.products.filter((product: Product) => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesCategory =
      selectedCategories.length === 0 || product.tags?.some((tag: string) => selectedCategories.includes(tag))
    const matchesDiscount =
      !discountedOnly || (product.originalPrice && product.originalPrice > product.price)

    return matchesPrice && matchesCategory && matchesDiscount
  })

  const totalResults =
    filteredResults.malls.length + filteredResults.shops.length + filteredProducts.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Search Results</h1>
              {searchQuery && (
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Results for "{searchQuery}" ({totalResults} found)
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search malls, shops, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">Price Range</Label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="mb-2" />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">Categories</Label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="discounted"
                    checked={discountedOnly}
                    onCheckedChange={(checked) => setDiscountedOnly(checked as boolean)}
                  />
                  <Label htmlFor="discounted" className="text-sm">
                    Discounted items only
                  </Label>
                </div>
              </div>

              {(selectedCategories.length > 0 || discountedOnly || priceRange[0] > 0 || priceRange[1] < 1000) && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">Active Filters</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleCategoryToggle(category)}
                      >
                        {category} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                    {discountedOnly && (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setDiscountedOnly(false)}>
                        Discounted <X className="w-3 h-3 ml-1" />
                      </Badge>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange([0, 1000])}>
                        ${priceRange[0]}-${priceRange[1]} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { key: "all", label: `All (${totalResults})` },
                { key: "products", label: `Products (${filteredResults.products.length})` },
                { key: "shops", label: `Shops (${filteredResults.shops.length})` },
                { key: "malls", label: `Malls (${filteredResults.malls.length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.key
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {(activeTab === "all" || activeTab === "products") && filteredResults.products.length > 0 && (
                <div>
                  {activeTab === "all" && (
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Products</h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.products.map((product) => (
                      <ProductCard key={product._id} product={{
                        ...product,
                        rating: product.rating || 0,
                        shopName: product.shopName || "Unknown Shop",
                        discount: product.originalPrice && product.originalPrice > product.price 
                          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                          : undefined
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {(activeTab === "all" || activeTab === "shops") && filteredResults.shops.length > 0 && (
                <div>
                  {activeTab === "all" && (
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Shops</h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.shops.map((shop) => (
                      <ShopCard key={shop._id} shop={{
                        ...shop,
                        rating: shop.rating || 0,
                        tags: shop.tags || [],
                        mallName: "Unknown Mall",
                        productCount: 0
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {(activeTab === "all" || activeTab === "malls") && filteredResults.malls.length > 0 && (
                <div>
                  {activeTab === "all" && (
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Malls</h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.malls.map((mall) => (
                      <MallCard key={mall._id} mall={{
                        ...mall,
                        id: mall._id,
                        location: mall.location || "Unknown Location",
                        rating: mall.rating || 0,
                        tags: mall.tags || [],
                        shopCount: 0
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {totalResults === 0 && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your search terms or filters</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
