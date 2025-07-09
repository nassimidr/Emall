"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Sparkles, ArrowRight } from "lucide-react"
import CompetitionContent from "@/components/CompetitionContent"
import StyleQuizContent from "@/components/StyleQuizContent"
import { useSearchParams } from "next/navigation"

export default function ActivitiesPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(tabParam || "competition")

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Interactive Activities</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover your style and compete for amazing prizes with our engaging activities
          </p>
        </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-2 w-full max-w-2xl h-16">
              <TabsTrigger
                value="competition"
                className="flex items-center justify-center space-x-3 text-lg font-semibold py-3 px-6 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trophy className="w-6 h-6" />
                <span>Style Competition</span>
                <ArrowRight className="w-4 h-4 opacity-60" />
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                className="flex items-center justify-center space-x-3 text-lg font-semibold py-3 px-6 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Sparkles className="w-6 h-6" />
                <span>Style Quiz</span>
                <ArrowRight className="w-4 h-4 opacity-60" />
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Descriptions */}
          <div className="text-center mb-8">
            {activeTab === "competition" && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4 max-w-2xl mx-auto border border-purple-200 dark:border-purple-700">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  🏆 Fashion Style Competition
                </h3>
                <p className="text-purple-700 dark:text-purple-300">
                  Spin the wheel, build amazing outfits, and compete for exciting prizes!
                </p>
              </div>
            )}
            {activeTab === "quiz" && (
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-4 max-w-2xl mx-auto border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Personal Style Quiz</h3>
                <p className="text-blue-700 dark:text-blue-300">
                  Discover your unique style and get personalized clothing recommendations!
                </p>
              </div>
            )}
          </div>

          <TabsContent value="competition" className="mt-0">
            <CompetitionContent />
          </TabsContent>

          <TabsContent value="quiz" className="mt-0">
            <StyleQuizContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
