"use client"

import { useState } from "react"
import SpinWheel from "./SpinWheel"
import OutfitBuilder from "./OutfitBuilder"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Shirt, Star, Users } from "lucide-react"

interface Product {
  id: string
  name: string
  image: string
  price: number
  category: string
  shopName: string
}

export default function CompetitionContent() {
  const [currentStep, setCurrentStep] = useState<"spin" | "build" | "submit">("spin")
  const [shoppingCash, setShoppingCash] = useState(0)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [hasSpun, setHasSpun] = useState(false)

  // Mock products data with proper default
  const availableProducts: Product[] = [
    {
      id: "1",
      name: "Classic White T-Shirt",
      image: "/placeholder.svg?height=200&width=200",
      price: 25,
      category: "tops",
      shopName: "Urban Style",
    },
    {
      id: "2",
      name: "Denim Jeans",
      image: "/placeholder.svg?height=200&width=200",
      price: 80,
      category: "bottoms",
      shopName: "Denim Co",
    },
    {
      id: "3",
      name: "Leather Jacket",
      image: "/placeholder.svg?height=200&width=200",
      price: 150,
      category: "outerwear",
      shopName: "Leather Works",
    },
    {
      id: "4",
      name: "Sneakers",
      image: "/placeholder.svg?height=200&width=200",
      price: 120,
      category: "footwear",
      shopName: "Shoe Palace",
    },
    {
      id: "5",
      name: "Baseball Cap",
      image: "/placeholder.svg?height=200&width=200",
      price: 30,
      category: "accessories",
      shopName: "Hat Store",
    },
    {
      id: "6",
      name: "Summer Dress",
      image: "/placeholder.svg?height=200&width=200",
      price: 65,
      category: "tops",
      shopName: "Fashion Hub",
    },
    {
      id: "7",
      name: "Chino Pants",
      image: "/placeholder.svg?height=200&width=200",
      price: 55,
      category: "bottoms",
      shopName: "Casual Wear",
    },
    {
      id: "8",
      name: "Wool Sweater",
      image: "/placeholder.svg?height=200&width=200",
      price: 90,
      category: "tops",
      shopName: "Cozy Knits",
    },
  ]

  const handleSpinComplete = (amount: number) => {
    setShoppingCash(amount)
    setHasSpun(true)
    setCurrentStep("build")
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProducts([...selectedProducts, product])
  }

  const handleProductRemove = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId))
  }

  const handleSubmitOutfit = () => {
    setCurrentStep("submit")
  }

  const resetCompetition = () => {
    setCurrentStep("spin")
    setShoppingCash(0)
    setSelectedProducts([])
    setHasSpun(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Style Competition
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Spin the wheel to win shopping cash, then build the perfect outfit within your budget!
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center space-x-8">
        <div
          className={`flex items-center space-x-2 ${currentStep === "spin" ? "text-purple-600" : currentStep === "build" || currentStep === "submit" ? "text-green-600" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "spin" ? "bg-purple-100 border-2 border-purple-600" : currentStep === "build" || currentStep === "submit" ? "bg-green-100 border-2 border-green-600" : "bg-gray-100 border-2 border-gray-300"}`}
          >
            1
          </div>
          <span className="font-medium">Spin Wheel</span>
        </div>
        <div
          className={`flex items-center space-x-2 ${currentStep === "build" ? "text-purple-600" : currentStep === "submit" ? "text-green-600" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "build" ? "bg-purple-100 border-2 border-purple-600" : currentStep === "submit" ? "bg-green-100 border-2 border-green-600" : "bg-gray-100 border-2 border-gray-300"}`}
          >
            2
          </div>
          <span className="font-medium">Build Outfit</span>
        </div>
        <div
          className={`flex items-center space-x-2 ${currentStep === "submit" ? "text-purple-600" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "submit" ? "bg-purple-100 border-2 border-purple-600" : "bg-gray-100 border-2 border-gray-300"}`}
          >
            3
          </div>
          <span className="font-medium">Submit Entry</span>
        </div>
      </div>

      {/* Content based on current step */}
      {currentStep === "spin" && (
        <div className="flex justify-center">
          <SpinWheel onSpinComplete={handleSpinComplete} hasSpun={hasSpun} />
        </div>
      )}

      {currentStep === "build" && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Build Your Outfit</h2>
            <p className="text-gray-600 dark:text-gray-300">
              You have <span className="font-bold text-green-600">${shoppingCash}</span> to spend. Choose wisely!
            </p>
          </div>

          <OutfitBuilder
            availableProducts={availableProducts}
            shoppingCash={shoppingCash}
            onProductSelect={handleProductSelect}
            onProductRemove={handleProductRemove}
            selectedProducts={selectedProducts}
          />

          {selectedProducts.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleSubmitOutfit}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3"
              >
                <Shirt className="w-5 h-5 mr-2" />
                Submit My Outfit
              </Button>
            </div>
          )}
        </div>
      )}

      {currentStep === "submit" && (
        <Card className="p-8 text-center space-y-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-bold text-green-800">Outfit Submitted!</h2>
            </div>
            <p className="text-green-700 text-lg">Your amazing outfit has been entered into the competition!</p>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <p className="text-gray-700 mb-2">
                <strong>Items:</strong> {selectedProducts.length}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Total Cost:</strong> ${selectedProducts.reduce((sum, p) => sum + p.price, 0)}
              </p>
              <p className="text-gray-700">
                <strong>Remaining Cash:</strong> ${shoppingCash - selectedProducts.reduce((sum, p) => sum + p.price, 0)}
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={resetCompetition} variant="outline" size="lg" className="px-6 bg-transparent">
              <Trophy className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6"
            >
              <Users className="w-5 h-5 mr-2" />
              View All Entries
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
