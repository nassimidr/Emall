"use client"

import { useState, useEffect, use as reactUse } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Heart, Share2, Bookmark, Play, ArrowLeft, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BlogCard from "@/components/BlogCard"

interface BlogPostDetail {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    social: { instagram: string; twitter: string };
  };
  category: string;
  publishedAt: string;
  readTime: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  type: "article" | "video";
  tags: string[];
}

interface RelatedPost {
  blogId: string;
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: { name: string; avatar: string };
  category: string;
  publishedAt: string;
  readTime: number;
  likes: number;
  comments: number;
  type: "article" | "video";
  tags: string[];
}

export default function BlogPostPage({ params }: { params: any }) {
  const paramsObj = typeof params?.then === "function" ? reactUse(params) : params;
  const id = paramsObj.id;
  const [blogPost, setBlogPost] = useState<BlogPostDetail | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      fetch("/blogPostsDetails.json").then((res) => res.json()),
      fetch("/blogPostsDetails.json").then((res) => res.json()),
    ]).then(([posts, related]) => {
      const post = posts.find((p: BlogPostDetail) => p.id === id)
      setBlogPost(post || null)
      setRelatedPosts(related.filter((r: RelatedPost) => r.blogId === id))
      if (post) {
        setIsLiked(post.isLiked)
        setIsBookmarked(post.isBookmarked)
        setLikes(post.likes)
      }
    }).finally(() => setIsLoading(false))
  }, [id])

  if (isLoading || !blogPost) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <img src="/placeholder-logo.svg" alt="Loading..." className="w-24 h-24 animate-spin" />
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost.title,
        text: blogPost.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button
              variant="ghost"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-96 overflow-hidden">
            <Image src={blogPost.image || "/placeholder.svg"} alt={blogPost.title} fill className="object-cover" />
            {blogPost.type === "video" && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-6">
                  <Play className="w-12 h-12 text-gray-900" />
                </div>
              </div>
            )}
            <div className="absolute top-6 left-6">
              <Badge className="bg-white/90 text-gray-900 hover:bg-white">{blogPost.category}</Badge>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            {/* Title and Meta */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {blogPost.title}
              </h1>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Image
                    src={blogPost.author.avatar || "/placeholder.svg"}
                    alt={blogPost.author.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{blogPost.author.name}</p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(blogPost.publishedAt)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{blogPost.readTime} min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`${isLiked ? "text-red-500" : "text-gray-500"}`}
                  >
                    <Heart className={`w-5 h-5 mr-1 ${isLiked ? "fill-current" : ""}`} />
                    {likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmark}
                    className={`${isBookmarked ? "text-blue-500" : "text-gray-500"}`}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare} className="text-gray-500">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {blogPost.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Article Body */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-start space-x-4">
                <Image
                  src={blogPost.author.avatar || "/placeholder.svg"}
                  alt={blogPost.author.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    About {blogPost.author.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{blogPost.author.bio}</p>
                  <div className="flex items-center space-x-4">
                    {blogPost.author.social.instagram && (
                      <a
                        href={`https://instagram.com/${blogPost.author.social.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        {blogPost.author.social.instagram}
                      </a>
                    )}
                    {blogPost.author.social.twitter && (
                      <a
                        href={`https://twitter.com/${blogPost.author.social.twitter.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {blogPost.author.social.twitter}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
              <BlogCard key={post.id} blog={post} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
