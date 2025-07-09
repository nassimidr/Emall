import Image from "next/image"
import Link from "next/link"
import { Star, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ShopCardProps {
  shop: {
    _id: string
    name: string
    description: string
    image: string
    rating: number
    tags: string[]
    mallName: string
    productCount: number
    location?: string
    category?: string
  }
}

export default function ShopCard({ shop }: ShopCardProps) {
  const isValidId = !!shop._id && typeof shop._id === 'string' && shop._id !== 'undefined';
  const href = isValidId ? `/shops/${shop._id}` : '#';
  return (
    <Link href={href} legacyBehavior>
      <a aria-disabled={!isValidId} tabIndex={!isValidId ? -1 : 0} style={!isValidId ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
        <div className="bg-white dark:bg-gray-900 rounded-xl premium-shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden elegant-border group">
          <div className="relative h-40">
            <Image src={shop.image || "/placeholder.svg"} alt={shop.name} fill className="object-cover" />
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{shop.rating}</span>
            </div>
            {shop.category && (
              <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-xs font-medium text-white">{shop.category}</span>
              </div>
            )}
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
              {shop.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{shop.description}</p>

            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{shop.location || shop.mallName}</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {shop.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{shop.productCount} products</div>
          </div>
        </div>
      </a>
    </Link>
  )
}
