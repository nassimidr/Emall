"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import MallCard from "@/components/MallCard"

interface MallListData {
  _id: string;
  name: string;
  description: string;
  image?: string;
  location: string;
  rating: number;
  tags: string[];
  shopCount?: number;
}

export default function MallsPage() {
  const [allMalls, setAllMalls] = useState<MallListData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRating, setSelectedRating] = useState("any")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetch("http://localhost:5000/api/malls") // 🔗 Connexion au backend
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json()
      })
      .then(data => setAllMalls(data))
      .catch(err => {
        console.error("Erreur fetch malls:", err)
        setError("Impossible de charger les centres commerciaux")
      })
      .finally(() => setIsLoading(false))
  }, [])

  const locations = [...new Set(allMalls.map((mall) => mall.location))]
  const allTags = [...new Set(allMalls.flatMap((mall) => mall.tags))]

  const filteredMalls = allMalls.filter((mall) => {
    const matchesSearch =
      mall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mall.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = selectedRating === "any" || mall.rating >= Number.parseFloat(selectedRating)
    const matchesLocation = selectedLocation === "all" || mall.location === selectedLocation
    const matchesTag = selectedTag === "all" || mall.tags.includes(selectedTag)

    return matchesSearch && matchesRating && matchesLocation && matchesTag
  })

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-thin text-gray-900 dark:text-white mb-4 tracking-wider">
            Luxury Collections
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-light">
            Discover exclusive fashion destinations and premium shopping experiences
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-lg elegant-shadow p-6 mb-8 luxury-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search luxury collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:border-gold-500 focus:ring-gold-500/20"
              />
            </div>

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

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(selectedRating !== "any" || selectedLocation !== "all" || selectedTag !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedRating !== "any" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer bg-gold-500/10 text-gold-600 border-gold-500/20 hover:bg-gold-500/20"
                  onClick={() => setSelectedRating("any")}
                >
                  {selectedRating}+ Stars ×
                </Badge>
              )}
              {selectedLocation !== "all" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedLocation("all")}>
                  {selectedLocation} ×
                </Badge>
              )}
              {selectedTag !== "all" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedTag("all")}>
                  {selectedTag} ×
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Résultat */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredMalls.length} of {allMalls.length} malls
          </p>
        </div>

        {/* Grille des malls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMalls.map((mall) => (
            <MallCard
              key={mall._id}
              mall={{
                ...mall,
                id: mall._id, // important pour compatibilité avec MallCard
                image: mall.image || "/placeholder.svg",
                shopCount: mall.shopCount ?? 0,
              }}
            />
          ))}
        </div>

        {filteredMalls.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No malls found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
