import Image from "next/image"
import Link from "next/link"
import { MapPin, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MallCardProps {
  mall: {
    id: string
    _id: string
    name: string
    description: string
    image: string
    location: string
    rating: number
    tags: string[]
    shopCount: number
  }
}

export default function MallCard({ mall }: MallCardProps) {
  return (
    <Link href={`/malls/${mall._id}`}>

      <div className="bg-white dark:bg-gray-900 rounded-xl premium-shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden elegant-border">
        <div className="relative h-48">
          <Image src={mall.image || "/placeholder.svg"} alt={mall.name} fill className="object-cover" />
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{mall.rating}</span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{mall.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{mall.description}</p>

          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{mall.location}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {mall.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{mall.shopCount} shops</div>
        </div>
      </div>
    </Link>
  )
}
