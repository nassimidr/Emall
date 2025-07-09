"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Trophy, Star, Clock, Users, Award, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Submission {
  id: string
  name: string
  description: string
  products: Array<{
    id: string
    name: string
    image: string
    price: number
    category: string
    shopName: string
  }>
  totalCost: number
  submittedAt: string
  judgeScore?: number
  judgeComments?: string
  isWinner?: boolean
}

// Mock submissions for demo
const mockSubmissions: Submission[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    description: "A chic casual look perfect for weekend brunch with friends",
    products: [
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
        id: "4",
        name: "White Sneakers",
        image: "/placeholder.svg?height=300&width=300&text=White+Sneakers",
        price: 120,
        category: "footwear",
        shopName: "Urban Threads",
      },
    ],
    totalCost: 225,
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Mike Chen",
    description: "Edgy street style with a modern twist",
    products: [
      {
        id: "3",
        name: "Leather Jacket",
        image: "/placeholder.svg?height=300&width=300&text=Leather+Jacket",
        price: 150,
        category: "outerwear",
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
        id: "2",
        name: "Blue Denim Jeans",
        image: "/placeholder.svg?height=300&width=300&text=Blue+Jeans",
        price: 80,
        category: "bottoms",
        shopName: "Urban Threads",
      },
    ],
    totalCost: 295,
    submittedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    description: "Elegant and sophisticated for a dinner date",
    products: [
      {
        id: "5",
        name: "Black Dress",
        image: "/placeholder.svg?height=300&width=300&text=Black+Dress",
        price: 90,
        category: "tops",
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
      {
        id: "7",
        name: "Sunglasses",
        image: "/placeholder.svg?height=300&width=300&text=Sunglasses",
        price: 45,
        category: "accessories",
        shopName: "Fashion District",
      },
    ],
    totalCost: 275,
    submittedAt: "2024-01-15T16:45:00Z",
  },
]

export default function JudgePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [judgeScore, setJudgeScore] = useState("")
  const [judgeComments, setJudgeComments] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [judgePassword, setJudgePassword] = useState("")

  useEffect(() => {
    // Load submissions from localStorage and merge with mock data
    const savedSubmissions = JSON.parse(localStorage.getItem("competition_submissions") || "[]")
    const allSubmissions = [
      ...mockSubmissions,
      ...savedSubmissions.map((sub: any, index: number) => ({
        ...sub,
        id: `user_${index + 1}`,
      })),
    ]
    setSubmissions(allSubmissions)
  }, [])

  const handleJudgeLogin = () => {
    // Simple password check (in real app, this would be proper authentication)
    if (judgePassword === "judge123") {
      setIsAuthenticated(true)
    } else {
      alert("Invalid password")
    }
  }

  const handleScoreSubmission = () => {
    if (selectedSubmission && judgeScore && Number.parseInt(judgeScore) >= 1 && Number.parseInt(judgeScore) <= 10) {
      const updatedSubmissions = submissions.map((sub) =>
        sub.id === selectedSubmission.id ? { ...sub, judgeScore: Number.parseInt(judgeScore), judgeComments } : sub,
      )
      setSubmissions(updatedSubmissions)
      setSelectedSubmission(null)
      setJudgeScore("")
      setJudgeComments("")
    }
  }

  const handleSelectWinner = (submissionId: string, place: number) => {
    const updatedSubmissions = submissions.map((sub) => ({
      ...sub,
      isWinner: sub.id === submissionId ? place : sub.isWinner === place ? undefined : sub.isWinner,
    }))
    setSubmissions(updatedSubmissions)
  }

  const sortedSubmissions = [...submissions].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      case "oldest":
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      case "highest_score":
        return (b.judgeScore || 0) - (a.judgeScore || 0)
      case "lowest_cost":
        return a.totalCost - b.totalCost
      case "highest_cost":
        return b.totalCost - a.totalCost
      default:
        return 0
    }
  })

  const winners = submissions.filter((sub) => sub.isWinner).sort((a, b) => (a.isWinner || 0) - (b.isWinner || 0))

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Judge Panel Access</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter the judge password to access the competition entries
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Judge Password</Label>
              <Input
                id="password"
                type="password"
                value={judgePassword}
                onChange={(e) => setJudgePassword(e.target.value)}
                placeholder="Enter judge password"
                className="mt-1"
              />
            </div>

            <Button onClick={handleJudgeLogin} className="w-full">
              Access Judge Panel
            </Button>

            <p className="text-xs text-gray-500 text-center">Demo password: judge123</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Competition Judge Panel</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Review and score outfit submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{submissions.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</div>
          </Card>

          <Card className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {submissions.filter((sub) => sub.judgeScore).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Scored</div>
          </Card>

          <Card className="p-6 text-center">
            <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{winners.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Winners Selected</div>
          </Card>

          <Card className="p-6 text-center">
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">7</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Days Remaining</div>
          </Card>
        </div>

        {/* Winners Section */}
        {winners.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Selected Winners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {winners.map((winner) => (
                <div key={winner.id} className="text-center">
                  <div
                    className={`p-4 rounded-lg ${
                      winner.isWinner === 1
                        ? "bg-yellow-100 dark:bg-yellow-900/20"
                        : winner.isWinner === 2
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "bg-orange-100 dark:bg-orange-900/20"
                    }`}
                  >
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {winner.isWinner === 1 ? "🥇 1st Place" : winner.isWinner === 2 ? "🥈 2nd Place" : "🥉 3rd Place"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{winner.name}</div>
                    {winner.judgeScore && <div className="text-sm font-medium">Score: {winner.judgeScore}/10</div>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Submissions</h2>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest_score">Highest Score</SelectItem>
                    <SelectItem value="lowest_cost">Lowest Cost</SelectItem>
                    <SelectItem value="highest_cost">Highest Cost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {sortedSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedSubmission?.id === submission.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{submission.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {submission.products.length} items • ${submission.totalCost}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {submission.judgeScore && <Badge variant="secondary">{submission.judgeScore}/10</Badge>}
                        {submission.isWinner && (
                          <Badge className="bg-yellow-500 text-white">
                            {submission.isWinner === 1 ? "1st" : submission.isWinner === 2 ? "2nd" : "3rd"} Place
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 mb-3">
                      {submission.products.slice(0, 4).map((product) => (
                        <div
                          key={product.id}
                          className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden"
                        >
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {submission.products.length > 4 && (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-medium">
                          +{submission.products.length - 4}
                        </div>
                      )}
                    </div>

                    {submission.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{submission.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Submission Details & Scoring */}
          <div className="lg:col-span-1">
            {selectedSubmission ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSubmission.name}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(null)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                {/* Outfit Preview */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Outfit Items</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedSubmission.products.map((product) => (
                      <div key={product.id} className="text-center">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-2">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">${product.price}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-center">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Total: ${selectedSubmission.totalCost}
                    </span>
                  </div>
                </div>

                {selectedSubmission.description && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedSubmission.description}</p>
                  </div>
                )}

                {/* Scoring */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="score">Score (1-10)</Label>
                    <Input
                      id="score"
                      type="number"
                      min="1"
                      max="10"
                      value={judgeScore}
                      onChange={(e) => setJudgeScore(e.target.value)}
                      placeholder="Enter score"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      value={judgeComments}
                      onChange={(e) => setJudgeComments(e.target.value)}
                      placeholder="Judge comments..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleScoreSubmission}
                    disabled={!judgeScore || Number.parseInt(judgeScore) < 1 || Number.parseInt(judgeScore) > 10}
                    className="w-full"
                  >
                    Submit Score
                  </Button>

                  {/* Winner Selection */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Select as Winner</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={selectedSubmission.isWinner === 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSelectWinner(selectedSubmission.id, 1)}
                      >
                        1st
                      </Button>
                      <Button
                        variant={selectedSubmission.isWinner === 2 ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSelectWinner(selectedSubmission.id, 2)}
                      >
                        2nd
                      </Button>
                      <Button
                        variant={selectedSubmission.isWinner === 3 ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSelectWinner(selectedSubmission.id, 3)}
                      >
                        3rd
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedSubmission.judgeScore && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-sm font-medium text-green-800 dark:text-green-200">
                      Current Score: {selectedSubmission.judgeScore}/10
                    </div>
                    {selectedSubmission.judgeComments && (
                      <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {selectedSubmission.judgeComments}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Submission</h3>
                <p className="text-gray-600 dark:text-gray-300">Click on a submission to view details and score it</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
