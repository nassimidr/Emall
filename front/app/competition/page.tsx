"use client"

import { useState, useEffect } from "react"
import { Trophy, Clock, Users, Star, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import SpinWheel from "@/components/SpinWheel"
import OutfitBuilder from "@/components/OutfitBuilder"

// Mock products for the competition
const competitionProducts = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    image: "/placeholder.svg?height=300&width=300&text=White+T-Shirt",
    price: 25,
    category: "tops",
    shopName: "Urban Threads",
  },
  {
    id: "2",
    name: "Blue Denim Jeans",
    image: "/placeholder.svg?height=300&width=300&text=Blue+Jeans",
    price: 80,
    category: "bottoms",
    shopName: "Urban Threads",
  },
  {
    id: "3",
    name: "Leather Jacket",
    image: "/placeholder.svg?height=300&width=300&text=Leather+Jacket",
    price: 150,
    category: "outerwear",
    shopName: "Fashion District",
  },
  {
    id: "4",
    name: "White Sneakers",
    image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
    price: 120,
    category: "footwear",
    shopName: "Urban Threads",
  },
  {
    id: "5",
    name: "Black Dress",
    image: "/placeholder.svg?height=300&width=300&text=Black+Dress",
    price: 90,
    category: "tops",
    shopName: "Fashion District",
  },
  {
    id: "6",
    name: "Baseball Cap",
    image: "/placeholder.svg?height=300&width=300&text=Baseball+Cap",
    price: 30,
    category: "accessories",
    shopName: "Urban Threads",
  },
  {
    id: "7",
    name: "Sunglasses",
    image: "/placeholder.svg?height=300&width=300&text=Sunglasses",
    price: 45,
    category: "accessories",
    shopName: "Fashion District",
  },
  {
    id: "8",
    name: "Hoodie",
    image: "/placeholder.svg?height=300&width=300&text=Hoodie",
    price: 65,
    category: "tops",
    shopName: "Urban Threads",
  },
  {
    id: "9",
    name: "Chino Pants",
    image: "/placeholder.svg?height=300&width=300&text=Chino+Pants",
    price: 70,
    category: "bottoms",
    shopName: "Fashion District",
  },
  {
    id: "10",
    name: "Boots",
    image: "/placeholder.svg?height=300&width=300&text=Boots",
    price: 140,
    category: "footwear",
    shopName: "Fashion District",
  },
]

export default function CompetitionPage() {
  const [currentStep, setCurrentStep] = useState<"welcome" | "spin" | "build" | "submit">("welcome")
  const [shoppingCash, setShoppingCash] = useState(0)
  const [hasSpun, setHasSpun] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<typeof competitionProducts>([])
  const [participantName, setParticipantName] = useState("")
  const [outfitDescription, setOutfitDescription] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Check if user has already participated
  useEffect(() => {
    const hasParticipated = localStorage.getItem("competition_participated")
    const hasSpunWheel = localStorage.getItem("competition_spun")

    if (hasParticipated) {
      setIsSubmitted(true)
      setCurrentStep("submit")
    } else if (hasSpunWheel) {
      setHasSpun(true)
      setShoppingCash(Number.parseInt(localStorage.getItem("shopping_cash") || "0"))
      setCurrentStep("build")
    }
  }, [])

  const handleSpinWin = (amount: number) => {
    setShoppingCash(amount)
    setHasSpun(true)
    localStorage.setItem("competition_spun", "true")
    localStorage.setItem("shopping_cash", amount.toString())
    setTimeout(() => setCurrentStep("build"), 2000)
  }

  const handleProductSelect = (product: (typeof competitionProducts)[0]) => {
    const totalCost = selectedProducts.reduce((sum, p) => sum + p.price, 0) + product.price
    if (totalCost <= shoppingCash) {
      setSelectedProducts([...selectedProducts, product])
    }
  }

  const handleProductRemove = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId))
  }

  const handleSubmitOutfit = () => {
    if (participantName && selectedProducts.length > 0) {
      // Save submission
      const submission = {
        name: participantName,
        description: outfitDescription,
        products: selectedProducts,
        totalCost: selectedProducts.reduce((sum, p) => sum + p.price, 0),
        submittedAt: new Date().toISOString(),
      }

      // Save to localStorage (in real app, this would go to a database)
      const submissions = JSON.parse(localStorage.getItem("competition_submissions") || "[]")
      submissions.push(submission)
      localStorage.setItem("competition_submissions", JSON.stringify(submissions))
      localStorage.setItem("competition_participated", "true")

      setIsSubmitted(true)
      setCurrentStep("submit")
    }
  }

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Style Competition</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Create the perfect outfit and compete for amazing prizes! Spin the wheel to get shopping cash, then build
              your dream outfit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              <Gift className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Spin & Win</h3>
              <p className="text-gray-600 dark:text-gray-300">Spin the wheel to win shopping cash up to $500!</p>
            </Card>

            <Card className="p-6 text-center">
              <Star className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Style Your Outfit</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use your cash to select products and create the perfect look.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Trophy className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Win Prizes</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our judges will select the best outfits for amazing rewards!
              </p>
            </Card>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Competition Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Duration</p>
                  <p className="text-gray-600 dark:text-gray-300">7 days remaining</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Participants</p>
                  <p className="text-gray-600 dark:text-gray-300">1,247 entries so far</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Prizes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">1st Place</div>
                  <div className="text-white">$1,000 Shopping Credit</div>
                </div>
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">2nd Place</div>
                  <div className="text-white">$500 Shopping Credit</div>
                </div>
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">3rd Place</div>
                  <div className="text-white">$250 Shopping Credit</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => setCurrentStep("spin")}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                Start Competition
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "spin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Spin the Wheel!</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Win shopping cash to build your perfect outfit</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
            <SpinWheel onWin={handleSpinWin} hasSpun={hasSpun} />

            {shoppingCash > 0 && (
              <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="text-2xl font-bold text-green-600 mb-2">Congratulations! 🎉</h3>
                <p className="text-lg text-green-700 dark:text-green-300 mb-4">
                  You won ${shoppingCash} in shopping cash!
                </p>
                <Button onClick={() => setCurrentStep("build")} className="bg-green-500 hover:bg-green-600 text-white">
                  Start Building Your Outfit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "build") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Build Your Outfit</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Use your ${shoppingCash} shopping cash to create the perfect style
            </p>
          </div>

          <OutfitBuilder
            availableProducts={competitionProducts}
            shoppingCash={shoppingCash}
            onProductSelect={handleProductSelect}
            onProductRemove={handleProductRemove}
            selectedProducts={selectedProducts}
          />

          {selectedProducts.length > 0 && (
            <Card className="mt-8 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Submit Your Entry</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Outfit Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={outfitDescription}
                    onChange={(e) => setOutfitDescription(e.target.value)}
                    placeholder="Describe your style inspiration..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={handleSubmitOutfit}
                  disabled={!participantName || selectedProducts.length === 0}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Submit My Outfit
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    )
  }

  if (currentStep === "submit" || isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-4">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Thank You for Participating! 🎉</h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Your outfit has been submitted successfully. Our judges will review all entries and announce winners soon!
            </p>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">What's Next?</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Judging Period</h3>
                  <p className="text-gray-600 dark:text-gray-300">Winners will be announced in 7 days</p>
                </div>

                <div className="text-center">
                  <Gift className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Prize Notification</h3>
                  <p className="text-gray-600 dark:text-gray-300">Winners will be contacted via email</p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Button
                onClick={() => (window.location.href = "/")}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white mr-4"
              >
                Explore Our Marketplace
              </Button>

              <Button onClick={() => (window.location.href = "/competition/judge")} variant="outline" size="lg">
                View Judge Panel
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
