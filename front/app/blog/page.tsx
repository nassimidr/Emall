"use client"

import { useState, useEffect } from "react"
import { Search, Filter, TrendingUp, Video, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import BlogCard from "@/components/BlogCard"

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  publishedAt: string;
  readTime: number;
  likes: number;
  comments: number;
  type: "article" | "video";
  videoUrl?: string;
  tags: string[];
}

const categories = [
  "All Categories",
  "Casual Wear",
  "Formal Wear",
  "Street Style",
  "Color Theory",
  "Seasonal",
  "Accessories",
  "Sustainable",
  "Denim",
]

const popularTags = [
  "styling",
  "trends",
  "accessories",
  "casual",
  "formal",
  "color",
  "seasonal",
  "sustainable",
  "denim",
  "basics",
]

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch("/blogPostsDetails.json")
      .then((res) => res.json())
      .then((json) => setBlogPosts(json))
      .finally(() => setIsLoading(false))
  }, [])

  // Filter and sort posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory
    const matchesType = selectedType === "all" || post.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case "oldest":
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      case "popular":
        return b.likes - a.likes
      case "most_comments":
        return b.comments - a.comments
      default:
        return 0
    }
  })

  const featuredPost = blogPosts.length > 0 ? blogPosts[0] : undefined;
  const trendingPosts = blogPosts.length > 1 ? blogPosts.slice(1, 4) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <img src="/placeholder-logo.svg" alt="Loading..." className="w-24 h-24 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Style Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the latest fashion trends, styling tips, and expert advice to elevate your wardrobe and express
            your unique style.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-purple-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Article</h2>
          </div>
          {featuredPost && <BlogCard blog={featuredPost} variant="featured" />}
        </div>

        {/* Trending Posts */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Trending Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingPosts.map((post) => (
              <BlogCard key={post.id} blog={post} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="space-y-6">
              {/* Search */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </Card>

              {/* Categories */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Content Type */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Type</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedType("all")}
                    className={`flex items-center w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedType === "all"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    All Content
                  </button>
                  <button
                    onClick={() => setSelectedType("article")}
                    className={`flex items-center w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedType === "article"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Articles
                  </button>
                  <button
                    onClick={() => setSelectedType("video")}
                    className={`flex items-center w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedType === "video"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Videos
                  </button>
                </div>
              </Card>

              {/* Popular Tags */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700"
                      onClick={() => setSearchQuery(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Newsletter Signup */}
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get the latest styling tips and fashion trends delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <Input placeholder="Enter your email" type="email" />
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Subscribe
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Filters Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Posts ({sortedPosts.length})</h2>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="most_comments">Most Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory !== "All Categories" || selectedType !== "all") && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("")}>
                    Search: "{searchQuery}" ×
                  </Badge>
                )}
                {selectedCategory !== "All Categories" && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory("All Categories")}
                  >
                    {selectedCategory} ×
                  </Badge>
                )}
                {selectedType !== "all" && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedType("all")}>
                    {selectedType === "article" ? "Articles" : "Videos"} ×
                  </Badge>
                )}
              </div>
            )}

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sortedPosts.map((post) => (
                <BlogCard key={post.id} blog={post} />
              ))}
            </div>

            {/* No Results */}
            {sortedPosts.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No posts found</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All Categories")
                    setSelectedType("all")
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {sortedPosts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Posts
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
