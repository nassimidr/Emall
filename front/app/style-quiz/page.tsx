"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Sparkles, User, Palette, Eye, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface QuizQuestion {
  id: string
  type: "single" | "multiple" | "visual" | "slider"
  category: "personality" | "lifestyle" | "visual" | "preferences"
  question: string
  description?: string
  options?: Array<{
    id: string
    label: string
    image?: string
    value: string
  }>
  min?: number
  max?: number
  step?: number
}

interface QuizResult {
  styleProfile: string
  personality: string[]
  preferences: string[]
  recommendations: Array<{
    id: string
    name: string
    image: string
    price: number
    shopName: string
    matchReason: string
    category: string
  }>
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "1",
    type: "single",
    category: "personality",
    question: "How would you describe your personality?",
    description: "Choose the option that best represents you",
    options: [
      { id: "adventurous", label: "Adventurous & Bold", value: "adventurous" },
      { id: "classic", label: "Classic & Timeless", value: "classic" },
      { id: "creative", label: "Creative & Artistic", value: "creative" },
      { id: "minimalist", label: "Minimalist & Clean", value: "minimalist" },
      { id: "romantic", label: "Romantic & Feminine", value: "romantic" },
      { id: "edgy", label: "Edgy & Alternative", value: "edgy" },
    ],
  },
  {
    id: "2",
    type: "multiple",
    category: "lifestyle",
    question: "What activities do you enjoy most?",
    description: "Select all that apply",
    options: [
      { id: "work", label: "Professional work", value: "work" },
      { id: "social", label: "Social events & parties", value: "social" },
      { id: "outdoor", label: "Outdoor activities", value: "outdoor" },
      { id: "travel", label: "Travel & exploration", value: "travel" },
      { id: "fitness", label: "Fitness & sports", value: "fitness" },
      { id: "arts", label: "Arts & culture", value: "arts" },
      { id: "casual", label: "Casual hangouts", value: "casual" },
      { id: "family", label: "Family time", value: "family" },
    ],
  },
  {
    id: "3",
    type: "visual",
    category: "visual",
    question: "Which color palette speaks to you?",
    description: "Choose your favorite color combination",
    options: [
      {
        id: "neutral",
        label: "Neutral Tones",
        value: "neutral",
        image: "/placeholder.svg?height=120&width=120&text=Beige+White+Gray",
      },
      {
        id: "bold",
        label: "Bold & Bright",
        value: "bold",
        image: "/placeholder.svg?height=120&width=120&text=Red+Blue+Yellow",
      },
      {
        id: "earth",
        label: "Earth Tones",
        value: "earth",
        image: "/placeholder.svg?height=120&width=120&text=Brown+Green+Orange",
      },
      {
        id: "monochrome",
        label: "Black & White",
        value: "monochrome",
        image: "/placeholder.svg?height=120&width=120&text=Black+White",
      },
      {
        id: "pastel",
        label: "Soft Pastels",
        value: "pastel",
        image: "/placeholder.svg?height=120&width=120&text=Pink+Lavender+Mint",
      },
      {
        id: "jewel",
        label: "Jewel Tones",
        value: "jewel",
        image: "/placeholder.svg?height=120&width=120&text=Emerald+Ruby+Sapphire",
      },
    ],
  },
  {
    id: "4",
    type: "visual",
    category: "visual",
    question: "Which style inspiration resonates with you?",
    description: "Pick the aesthetic that draws you in",
    options: [
      {
        id: "bohemian",
        label: "Bohemian Chic",
        value: "bohemian",
        image: "/placeholder.svg?height=150&width=150&text=Boho+Style",
      },
      {
        id: "streetwear",
        label: "Urban Streetwear",
        value: "streetwear",
        image: "/placeholder.svg?height=150&width=150&text=Street+Style",
      },
      {
        id: "preppy",
        label: "Preppy Classic",
        value: "preppy",
        image: "/placeholder.svg?height=150&width=150&text=Preppy+Look",
      },
      {
        id: "glamour",
        label: "Hollywood Glamour",
        value: "glamour",
        image: "/placeholder.svg?height=150&width=150&text=Glamour+Style",
      },
      {
        id: "scandinavian",
        label: "Scandinavian Minimal",
        value: "scandinavian",
        image: "/placeholder.svg?height=150&width=150&text=Minimal+Nordic",
      },
      {
        id: "vintage",
        label: "Vintage Retro",
        value: "vintage",
        image: "/placeholder.svg?height=150&width=150&text=Vintage+Style",
      },
    ],
  },
  {
    id: "5",
    type: "single",
    category: "preferences",
    question: "What's your comfort level with fashion trends?",
    options: [
      { id: "trendsetter", label: "I love being first to try new trends", value: "trendsetter" },
      { id: "early-adopter", label: "I follow trends when they become popular", value: "early-adopter" },
      { id: "selective", label: "I pick and choose trends that suit me", value: "selective" },
      { id: "classic-lover", label: "I prefer timeless, classic pieces", value: "classic-lover" },
      { id: "trend-resistant", label: "I avoid trends and stick to my style", value: "trend-resistant" },
    ],
  },
  {
    id: "6",
    type: "single",
    category: "preferences",
    question: "How do you prefer your clothes to fit?",
    options: [
      { id: "fitted", label: "Fitted and tailored", value: "fitted" },
      { id: "relaxed", label: "Relaxed and comfortable", value: "relaxed" },
      { id: "oversized", label: "Oversized and loose", value: "oversized" },
      { id: "mixed", label: "Mix of fitted and loose pieces", value: "mixed" },
    ],
  },
  {
    id: "7",
    type: "multiple",
    category: "preferences",
    question: "What occasions do you dress for most often?",
    description: "Select all that apply",
    options: [
      { id: "work-formal", label: "Formal work environment", value: "work-formal" },
      { id: "work-casual", label: "Casual work environment", value: "work-casual" },
      { id: "date-night", label: "Date nights", value: "date-night" },
      { id: "weekend", label: "Weekend casual", value: "weekend" },
      { id: "parties", label: "Parties & events", value: "parties" },
      { id: "travel", label: "Travel & vacation", value: "travel" },
      { id: "everyday", label: "Everyday errands", value: "everyday" },
      { id: "special-events", label: "Special occasions", value: "special-events" },
    ],
  },
  {
    id: "8",
    type: "slider",
    category: "preferences",
    question: "How important is sustainability in your fashion choices?",
    description: "Rate from 1 (not important) to 10 (very important)",
    min: 1,
    max: 10,
    step: 1,
  },
]

// Mock product recommendations based on quiz results
const generateRecommendations = (answers: Record<string, any>): QuizResult => {
  // This would be a sophisticated algorithm in a real app
  const personality = answers["1"] || "classic"
  const lifestyle = answers["2"] || []
  const colorPalette = answers["3"] || "neutral"
  const styleInspiration = answers["4"] || "preppy"

  let styleProfile = ""
  let recommendations = []

  // Determine style profile
  if (personality === "minimalist" && colorPalette === "neutral") {
    styleProfile = "Minimalist Chic"
    recommendations = [
      {
        id: "1",
        name: "Essential White Button Shirt",
        image: "/placeholder.svg?height=300&width=300&text=White+Button+Shirt",
        price: 89,
        shopName: "Urban Threads",
        matchReason: "Perfect for your minimalist aesthetic",
        category: "Tops",
      },
      {
        id: "2",
        name: "Tailored Black Trousers",
        image: "/placeholder.svg?height=300&width=300&text=Black+Trousers",
        price: 120,
        shopName: "Fashion District",
        matchReason: "Clean lines match your style",
        category: "Bottoms",
      },
      {
        id: "3",
        name: "Minimalist Leather Bag",
        image: "/placeholder.svg?height=300&width=300&text=Leather+Bag",
        price: 150,
        shopName: "Luxury Galleria",
        matchReason: "Timeless design you'll love",
        category: "Accessories",
      },
    ]
  } else if (personality === "adventurous" && styleInspiration === "streetwear") {
    styleProfile = "Urban Explorer"
    recommendations = [
      {
        id: "4",
        name: "Oversized Graphic Hoodie",
        image: "/placeholder.svg?height=300&width=300&text=Graphic+Hoodie",
        price: 75,
        shopName: "Urban Threads",
        matchReason: "Bold graphics match your adventurous spirit",
        category: "Tops",
      },
      {
        id: "5",
        name: "Cargo Pants",
        image: "/placeholder.svg?height=300&width=300&text=Cargo+Pants",
        price: 95,
        shopName: "Urban Threads",
        matchReason: "Functional style for your active lifestyle",
        category: "Bottoms",
      },
      {
        id: "6",
        name: "High-Top Sneakers",
        image: "/placeholder.svg?height=300&width=300&text=High+Top+Sneakers",
        price: 140,
        shopName: "Urban Threads",
        matchReason: "Street-ready footwear",
        category: "Footwear",
      },
    ]
  } else if (personality === "romantic" && colorPalette === "pastel") {
    styleProfile = "Romantic Dreamer"
    recommendations = [
      {
        id: "7",
        name: "Floral Midi Dress",
        image: "/placeholder.svg?height=300&width=300&text=Floral+Dress",
        price: 110,
        shopName: "Fashion District",
        matchReason: "Feminine florals suit your romantic nature",
        category: "Dresses",
      },
      {
        id: "8",
        name: "Delicate Gold Necklace",
        image: "/placeholder.svg?height=300&width=300&text=Gold+Necklace",
        price: 65,
        shopName: "Jewelry Palace",
        matchReason: "Soft elegance matches your style",
        category: "Jewelry",
      },
      {
        id: "9",
        name: "Pastel Cardigan",
        image: "/placeholder.svg?height=300&width=300&text=Pastel+Cardigan",
        price: 85,
        shopName: "Fashion District",
        matchReason: "Soft colors in your preferred palette",
        category: "Outerwear",
      },
    ]
  } else {
    styleProfile = "Classic Elegance"
    recommendations = [
      {
        id: "10",
        name: "Classic Trench Coat",
        image: "/placeholder.svg?height=300&width=300&text=Trench+Coat",
        price: 200,
        shopName: "Luxury Galleria",
        matchReason: "Timeless piece for your classic style",
        category: "Outerwear",
      },
      {
        id: "11",
        name: "Silk Blouse",
        image: "/placeholder.svg?height=300&width=300&text=Silk+Blouse",
        price: 130,
        shopName: "Fashion District",
        matchReason: "Elegant and versatile",
        category: "Tops",
      },
      {
        id: "12",
        name: "Pearl Earrings",
        image: "/placeholder.svg?height=300&width=300&text=Pearl+Earrings",
        price: 90,
        shopName: "Jewelry Palace",
        matchReason: "Classic sophistication",
        category: "Jewelry",
      },
    ]
  }

  return {
    styleProfile,
    personality: [personality],
    preferences: lifestyle,
    recommendations,
  }
}

export default function StyleQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [sliderValue, setSliderValue] = useState(5)

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const question = quizQuestions[currentQuestion]

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      if (question.type === "slider") {
        setSliderValue(5) // Reset slider for next question
      }
    } else {
      // Quiz completed
      const quizResult = generateRecommendations(answers)
      setResult(quizResult)
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const canProceed = () => {
    const answer = answers[question.id]
    if (question.type === "multiple") {
      return answer && answer.length > 0
    }
    return answer !== undefined
  }

  if (isCompleted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Results Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Your Style Profile</h1>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">{result.styleProfile}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Based on your responses, we've curated a personalized selection of items that match your unique style
                and personality.
              </p>
            </div>
          </div>

          {/* Style Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <User className="w-8 h-8 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Personality</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {result.personality.map((trait) => (
                  <Badge key={trait} variant="secondary" className="capitalize">
                    {trait}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6 text-center">
              <Palette className="w-8 h-8 text-pink-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Style Preferences</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {result.preferences.slice(0, 3).map((pref) => (
                  <Badge key={pref} variant="outline" className="capitalize">
                    {pref.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6 text-center">
              <ShoppingBag className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recommendations</h3>
              <p className="text-2xl font-bold text-blue-600">{result.recommendations.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Curated items</p>
            </Card>
          </div>

          {/* Recommended Products */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Your Personalized Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {result.recommendations.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-64">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white">Perfect Match</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.matchReason}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">from {product.shopName}</p>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      View Product
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                asChild
              >
                <Link href="/shops">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Explore All Shops
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setCurrentQuestion(0)
                  setAnswers({})
                  setIsCompleted(false)
                  setResult(null)
                }}
              >
                Retake Quiz
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Save your results and get personalized recommendations in your account
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4">
              <Eye className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Discover Your Style</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Take our personalized style quiz to get curated fashion recommendations that match your personality and
            preferences.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Badge variant="outline" className="mr-3 capitalize">
                {question.category}
              </Badge>
              <Badge variant="secondary">
                {question.type === "single"
                  ? "Choose One"
                  : question.type === "multiple"
                    ? "Choose Multiple"
                    : question.type === "visual"
                      ? "Visual Choice"
                      : "Rate"}
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">{question.question}</h2>
            {question.description && <p className="text-gray-600 dark:text-gray-400">{question.description}</p>}
          </div>

          {/* Question Options */}
          <div className="space-y-4">
            {question.type === "single" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      answers[question.id] === option.value
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                  </button>
                ))}
              </div>
            )}

            {question.type === "multiple" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options?.map((option) => {
                  const isSelected = answers[question.id]?.includes(option.value) || false
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        const currentAnswers = answers[question.id] || []
                        const newAnswers = isSelected
                          ? currentAnswers.filter((a: string) => a !== option.value)
                          : [...currentAnswers, option.value]
                        handleAnswer(question.id, newAnswers)
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {question.type === "visual" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {question.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className={`group relative overflow-hidden rounded-xl border-4 transition-all duration-200 ${
                      answers[question.id] === option.value
                        ? "border-purple-500 scale-105"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={option.image || "/placeholder.svg"}
                        alt={option.label}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {answers[question.id] === option.value && (
                        <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                          <div className="bg-purple-500 rounded-full p-2">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {question.type === "slider" && (
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    step={question.step}
                    value={sliderValue}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      setSliderValue(value)
                      handleAnswer(question.id, value)
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>Not Important</span>
                    <span className="font-bold text-lg text-purple-600">{answers[question.id] || sliderValue}</span>
                    <span>Very Important</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-transparent"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {currentQuestion === quizQuestions.length - 1 ? (
              <>
                Get My Results
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
