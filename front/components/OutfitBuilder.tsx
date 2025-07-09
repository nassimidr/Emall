"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, X, Plus, Minus, Shirt, Package, Footprints, Crown } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  image: string
  price: number
  category: string
  shopName: string
}

interface OutfitBuilderProps {
  availableProducts?: Product[]
  shoppingCash: number
  onProductSelect: (product: Product) => void
  onProductRemove: (productId: string) => void
  selectedProducts: Product[]
}

export default function OutfitBuilder({
  availableProducts = [],
  shoppingCash,
  onProductSelect,
  onProductRemove,
  selectedProducts,
}: OutfitBuilderProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Items", icon: Package },
    { id: "tops", name: "Tops", icon: Shirt },
    { id: "bottoms", name: "Bottoms", icon: Package },
    { id: "outerwear", name: "Outerwear", icon: Shirt },
    { id: "footwear", name: "Footwear", icon: Footprints },
    { id: "accessories", name: "Accessories", icon: Crown },
  ]

  const filteredProducts = availableProducts.filter((product) =>
    activeCategory === "all" ? true : product.category === activeCategory,
  )

  const totalSpent = selectedProducts.reduce((sum, product) => sum + product.price, 0)
  const remainingCash = shoppingCash - totalSpent

  const canAfford = (price: number) => remainingCash >= price

  const isProductSelected = (productId: string) => selectedProducts.some((p) => p.id === productId)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Budget Display */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-green-800">Shopping Budget</h3>
              <p className="text-green-600">Build your perfect outfit within budget</p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-2xl font-bold text-green-700">${remainingCash}</div>
              <div className="text-sm text-green-600">
                ${totalSpent} spent of ${shoppingCash}
              </div>
            </div>
          </div>
          <div className="mt-4 bg-green-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(totalSpent / shoppingCash) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Your Outfit ({selectedProducts.length} items)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedProducts.map((product) => (
                <div key={product.id} className="relative bg-gray-50 rounded-lg p-4">
                  <Button
                    onClick={() => onProductRemove(product.id)}
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-green-600 font-bold">${product.price}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Categories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-1">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const selected = isProductSelected(product.id)
                const affordable = canAfford(product.price)

                return (
                  <Card
                    key={product.id}
                    className={`transition-all duration-200 ${
                      selected
                        ? "ring-2 ring-green-500 bg-green-50"
                        : affordable
                          ? "hover:shadow-lg cursor-pointer"
                          : "opacity-50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="relative mb-3">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        {selected && <Badge className="absolute top-2 right-2 bg-green-500">Selected</Badge>}
                        {!affordable && !selected && (
                          <Badge variant="destructive" className="absolute top-2 right-2">
                            Can't Afford
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm">{product.name}</h3>
                        <p className="text-xs text-gray-600">{product.shopName}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg text-green-600">${product.price}</span>
                          <Button
                            onClick={() => (selected ? onProductRemove(product.id) : onProductSelect(product))}
                            disabled={!selected && !affordable}
                            size="sm"
                            variant={selected ? "destructive" : "default"}
                            className="h-8"
                          >
                            {selected ? (
                              <>
                                <Minus className="w-3 h-3 mr-1" />
                                Remove
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3 mr-1" />
                                Add
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No products found in this category</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
