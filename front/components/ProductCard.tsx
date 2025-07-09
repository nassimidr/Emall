import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: {
    _id: string
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
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const isValidProductId = !!product._id && typeof product._id === 'string' && product._id !== 'undefined';
  const isValidShopId = !!product.shopId && typeof product.shopId === 'string' && product.shopId !== 'undefined';
  const productHref = isValidProductId ? `/products/${product._id}` : '#';
  const shopHref = isValidShopId ? `/shops/${product.shopId}` : '#';

  return (
    <div>
      <Link href={productHref} legacyBehavior>
        <a aria-disabled={!isValidProductId} tabIndex={!isValidProductId ? -1 : 0} style={!isValidProductId ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
          <div className="bg-white dark:bg-gray-900 rounded-xl premium-shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden elegant-border group">
            <div className="relative h-48">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              {hasDiscount && (
                <div className="absolute top-3 left-3 bg-red-500 text-white rounded-full px-3 py-1">
                  <span className="text-xs font-semibold">-{product.discount}%</span>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{product.rating}</span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">${product.price}</span>
                  {hasDiscount && <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                by {isValidShopId ? (
                  <span
                    className="underline cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    onClick={e => {
                      e.stopPropagation();
                      window.location.href = shopHref;
                    }}
                  >
                    {product.shopName}
                  </span>
                ) : (
                  <span>{product.shopName}</span>
                )}
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}
