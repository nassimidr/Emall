import Image from "next/image"
import Link from "next/link"
import { Calendar, Heart, MessageCircle, Play, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BlogCardProps {
  blog: {
    id: string
    title: string
    excerpt: string
    image: string
    author: {
      name: string
      avatar: string
    }
    category: string
    publishedAt: string
    readTime: number
    likes: number
    comments: number
    type: "article" | "video"
    videoUrl?: string
    tags: string[]
  }
  variant?: "default" | "featured" | "compact"
}

export default function BlogCard({ blog, variant = "default" }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (variant === "featured") {
    return (
      <Link href={`/blog/${blog.id}`}>
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="relative h-80 overflow-hidden">
            <Image
              src={blog.image || "/placeholder.svg"}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {blog.type === "video" && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-gray-900" />
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/90 text-gray-900 hover:bg-white">{blog.category}</Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-black/50 text-white border-0">
                {blog.type === "video" ? "Video" : "Article"}
              </Badge>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
              {blog.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">{blog.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src={blog.author.avatar || "/placeholder.svg"}
                  alt={blog.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{blog.author.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(blog.publishedAt)}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{blog.readTime} min read</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{blog.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{blog.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === "compact") {
    return (
      <Link href={`/blog/${blog.id}`}>
        <div className="group flex space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all duration-200">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={blog.image || "/placeholder.svg"}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {blog.type === "video" && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="text-xs mb-2">
              {blog.category}
            </Badge>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {blog.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatDate(blog.publishedAt)}</span>
              <span>•</span>
              <span>{blog.readTime} min</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${blog.id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={blog.image || "/placeholder.svg"}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {blog.type === "video" && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-gray-900" />
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-gray-900 hover:bg-white">{blog.category}</Badge>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src={blog.author.avatar || "/placeholder.svg"}
                alt={blog.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{blog.author.name}</p>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{blog.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{blog.comments}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-4">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
