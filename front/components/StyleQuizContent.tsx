"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import shopsData from "@/public/shopsData.json"

interface Question {
  id: number
  question: string
  type: "single" | "multiple" | "visual" | "slider"
  options?: string[]
  images?: { src: string; label: string }[]
  min?: number
  max?: number
}

interface StyleProfile {
  name: string
  description: string
  traits: string[]
  recommendations: {
    id: string
    name: string
    price: number
    image: string
    reason: string
    shopName: string
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "How would you describe your personality?",
    type: "single",
    options: [
      "Adventurous and bold",
      "Classic and timeless",
      "Creative and artistic",
      "Minimalist and clean",
      "Romantic and feminine",
    ],
  },
  {
    id: 2,
    question: "What activities do you enjoy most? (Select all that apply)",
    type: "multiple",
    options: [
      "Outdoor adventures",
      "Art galleries and museums",
      "Business meetings",
      "Social parties",
      "Quiet coffee dates",
      "Fitness and sports",
    ],
  },
  {
    id: 3,
    question: "Which color palette speaks to you?",
    type: "visual",
    images: [
      { src: "/placeholder.svg?height=100&width=150&text=Neutral+Tones", label: "Neutral Tones" },
      { src: "/placeholder.svg?height=100&width=150&text=Bold+Brights", label: "Bold & Bright" },
      { src: "/placeholder.svg?height=100&width=150&text=Pastels", label: "Soft Pastels" },
      { src: "/placeholder.svg?height=100&width=150&text=Earth+Tones", label: "Earth Tones" },
      { src: "/placeholder.svg?height=100&width=150&text=Monochrome", label: "Black & White" },
    ],
  },
  {
    id: 4,
    question: "What's your ideal fit for clothing?",
    type: "single",
    options: [
      "Fitted and tailored",
      "Loose and comfortable",
      "Structured and sharp",
      "Flowy and feminine",
      "Edgy and asymmetrical",
    ],
  },
  {
    id: 5,
    question: "How important is following current trends?",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: 6,
    question: "What occasions do you dress for most? (Select all that apply)",
    type: "multiple",
    options: ["Work/Professional", "Casual everyday", "Date nights", "Social events", "Travel", "Working out"],
  },
  {
    id: 7,
    question: "Which style inspiration resonates with you?",
    type: "visual",
    images: [
      { src: "/placeholder.svg?height=120&width=150&text=Parisian+Chic", label: "Parisian Chic" },
      { src: "/placeholder.svg?height=120&width=150&text=Boho+Vibes", label: "Boho Vibes" },
      { src: "/placeholder.svg?height=120&width=150&text=Street+Style", label: "Street Style" },
      { src: "/placeholder.svg?height=120&width=150&text=Classic+Elegance", label: "Classic Elegance" },
      { src: "/placeholder.svg?height=120&width=150&text=Modern+Minimalist", label: "Modern Minimalist" },
    ],
  },
  {
    id: 8,
    question: "How important is sustainability in fashion to you?",
    type: "slider",
    min: 1,
    max: 10,
  },
]

const styleProfiles: Record<string, StyleProfile> = {
  "minimalist-chic": {
    name: "Minimalist Chic",
    description: "You appreciate clean lines, neutral colors, and timeless pieces that never go out of style.",
    traits: ["Clean aesthetic", "Quality over quantity", "Neutral palette", "Timeless pieces"],
    recommendations: [
      {
        id: "1",
        name: "Classic White Button Shirt",
        price: 89,
        image: "/placeholder.svg?height=250&width=200&text=White+Shirt",
        reason: "Perfect for your minimalist aesthetic",
        shopName: "Urban Threads",
      },
      {
        id: "2",
        name: "Tailored Black Trousers",
        price: 129,
        image: "/placeholder.svg?height=250&width=200&text=Black+Trousers",
        reason: "Clean lines match your style",
        shopName: "Fashion District",
      },
      {
        id: "3",
        name: "Structured Blazer",
        price: 199,
        image: "/placeholder.svg?height=250&width=200&text=Blazer",
        reason: "Timeless piece for any occasion",
        shopName: "Urban Threads",
      },
    ],
  },
  "urban-explorer": {
    name: "Urban Explorer",
    description: "You love bold statements, street style, and aren't afraid to experiment with trends.",
    traits: ["Bold choices", "Street style", "Trend-forward", "Experimental"],
    recommendations: [
      {
        id: "4",
        name: "Graphic Streetwear Hoodie",
        price: 79,
        image: "/placeholder.svg?height=250&width=200&text=Hoodie",
        reason: "Perfect for your urban style",
        shopName: "Urban Threads",
      },
      {
        id: "5",
        name: "Distressed Denim Jacket",
        price: 149,
        image: "/placeholder.svg?height=250&width=200&text=Denim+Jacket",
        reason: "Edgy piece for layering",
        shopName: "Fashion District",
      },
      {
        id: "6",
        name: "Statement Sneakers",
        price: 159,
        image: "/placeholder.svg?height=250&width=200&text=Sneakers",
        reason: "Bold footwear for your look",
        shopName: "Urban Threads",
      },
    ],
  },
  "romantic-dreamer": {
    name: "Romantic Dreamer",
    description: "You're drawn to feminine details, soft colors, and pieces that make you feel beautiful.",
    traits: ["Feminine details", "Soft colors", "Romantic silhouettes", "Delicate fabrics"],
    recommendations: [
      {
        id: "7",
        name: "Floral Midi Dress",
        price: 119,
        image: "/placeholder.svg?height=250&width=200&text=Floral+Dress",
        reason: "Romantic florals suit your style",
        shopName: "Fashion District",
      },
      {
        id: "8",
        name: "Lace Detail Blouse",
        price: 89,
        image: "/placeholder.svg?height=250&width=200&text=Lace+Blouse",
        reason: "Feminine details you love",
        shopName: "Urban Threads",
      },
      {
        id: "9",
        name: "Soft Cashmere Cardigan",
        price: 179,
        image: "/placeholder.svg?height=250&width=200&text=Cardigan",
        reason: "Soft and romantic layering",
        shopName: "Fashion District",
      },
    ],
  },
  "classic-elegance": {
    name: "Classic Elegance",
    description: "You prefer sophisticated, timeless pieces that exude confidence and refinement.",
    traits: ["Sophisticated", "Timeless", "Refined", "Professional"],
    recommendations: [
      {
        id: "10",
        name: "Wool Pencil Skirt",
        price: 139,
        image: "/placeholder.svg?height=250&width=200&text=Pencil+Skirt",
        reason: "Classic silhouette for elegance",
        shopName: "Fashion District",
      },
      {
        id: "11",
        name: "Silk Blouse",
        price: 159,
        image: "/placeholder.svg?height=250&width=200&text=Silk+Blouse",
        reason: "Luxurious fabric for sophistication",
        shopName: "Urban Threads",
      },
      {
        id: "12",
        name: "Pearl Accessories Set",
        price: 89,
        image: "/placeholder.svg?height=250&width=200&text=Pearl+Set",
        reason: "Timeless elegance in details",
        shopName: "Fashion District",
      },
    ],
  },
}

export default function StyleQuizContent() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [showResults, setShowResults] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<StyleProfile | null>(null)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateResults = () => {
    // Simple algorithm to determine style profile based on answers
    const scores = {
      "minimalist-chic": 0,
      "urban-explorer": 0,
      "romantic-dreamer": 0,
      "classic-elegance": 0,
    }

    // Score based on personality (Q1)
    const personality = answers[1]
    if (personality === "Minimalist and clean") scores["minimalist-chic"] += 3
    if (personality === "Adventurous and bold") scores["urban-explorer"] += 3
    if (personality === "Romantic and feminine") scores["romantic-dreamer"] += 3
    if (personality === "Classic and timeless") scores["classic-elegance"] += 3

    // Score based on color palette (Q3)
    const colors = answers[3]
    if (colors === "Neutral Tones" || colors === "Black & White") scores["minimalist-chic"] += 2
    if (colors === "Bold & Bright") scores["urban-explorer"] += 2
    if (colors === "Soft Pastels") scores["romantic-dreamer"] += 2
    if (colors === "Earth Tones") scores["classic-elegance"] += 2

    // Score based on fit preference (Q4)
    const fit = answers[4]
    if (fit === "Loose and comfortable") scores["minimalist-chic"] += 1
    if (fit === "Edgy and asymmetrical") scores["urban-explorer"] += 1
    if (fit === "Flowy and feminine") scores["romantic-dreamer"] += 1
    if (fit === "Fitted and tailored" || fit === "Structured and sharp") scores["classic-elegance"] += 1

    // Find the highest scoring profile
    type ProfileKey = keyof typeof scores;
    const topProfile = (Object.keys(scores) as ProfileKey[]).reduce((a, b) => (scores[a] > scores[b] ? a : b));

    setSelectedProfile(styleProfiles[topProfile])
    setShowResults(true)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setSelectedProfile(null)
  }

  if (showResults && selectedProfile) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Results Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Style Profile</h2>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
            <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-2">{selectedProfile.name}</h3>
            <p className="text-lg text-purple-700 dark:text-purple-300 mb-4">{selectedProfile.description}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedProfile.traits.map((trait, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Perfect Matches For You 💎
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedProfile.recommendations.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-700"
              >
                <CardHeader className="pb-2">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="text-sm text-purple-600 dark:text-purple-400">
                    {item.reason}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${item.price}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.shopName}
                    </Badge>
                  </div>
                  <Link href={(() => {
                    const shop = shopsData.find(s => s.name.includes(item.shopName));
                    return shop && shop.id && shop.id !== 'undefined' ? `/shops/${shop.id}` : '#';
                  })()}>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" disabled={!shopsData.find(s => s.name.includes(item.shopName) && s.id && s.id !== 'undefined')}>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      View in Shop
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={resetQuiz} variant="outline" size="lg" className="px-8 py-3 bg-transparent">
              Take Quiz Again
            </Button>
            <Link href="/malls">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3"
              >
                Explore All Collections
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const currentAnswer = answers[question.id]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.type === "single" && (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={currentAnswer === option ? "default" : "outline"}
                  className={`w-full text-left justify-start h-auto p-4 ${
                    currentAnswer === option
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleAnswer(question.id, option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {question.type === "multiple" && (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={currentAnswer?.includes(option) ? "default" : "outline"}
                  className={`w-full text-left justify-start h-auto p-4 ${
                    currentAnswer?.includes(option)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    const current = currentAnswer || []
                    const updated = current.includes(option)
                      ? current.filter((item: string) => item !== option)
                      : [...current, option]
                    handleAnswer(question.id, updated)
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {question.type === "visual" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {question.images?.map((image, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto p-3 flex flex-col space-y-2 ${
                    currentAnswer === image.label
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleAnswer(question.id, image.label)}
                >
                  <img
                    src={image.src || "/placeholder.svg"}
                    alt={image.label}
                    className="w-full h-20 object-cover rounded"
                  />
                  <span className="text-sm font-medium">{image.label}</span>
                </Button>
              ))}
            </div>
          )}

          {question.type === "slider" && (
            <div className="space-y-4">
              <div className="px-4">
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  value={currentAnswer || 5}
                  onChange={(e) => handleAnswer(question.id, Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span>Not Important</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{currentAnswer || 5}/10</span>
                  <span>Very Important</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
          className="px-6 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6"
        >
          {currentQuestion === questions.length - 1 ? "Get Results" : "Next"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
