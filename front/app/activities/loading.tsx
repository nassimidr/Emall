import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function ActivitiesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-16 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-[600px] mx-auto" />
        </div>

        {/* Tabs Skeleton */}
        <div className="w-full max-w-md mx-auto mb-8">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-12 w-80 mx-auto mb-4" />
              <Skeleton className="h-6 w-[500px] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-12 w-12 mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full" />
                </Card>
              ))}
            </div>

            <Card className="p-8">
              <Skeleton className="h-8 w-64 mx-auto mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-12 w-48 mx-auto" />
            </Card>
          </Card>
        </div>
      </div>
    </div>
  )
}
