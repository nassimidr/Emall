"use client"

import { useState } from "react"
import { MapPin, Navigation, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InteractiveMapProps {
  address: string
  name: string
  coordinates?: {
    lat: number
    lng: number
  }
  className?: string
}

export default function InteractiveMap({ address, name, coordinates, className = "" }: InteractiveMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  // Default coordinates (can be customized per location)
  const defaultCoords = coordinates || { lat: 40.7128, lng: -74.006 }

  const handleGetDirections = () => {
    const encodedAddress = encodeURIComponent(address)
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
    window.open(googleMapsUrl, "_blank")
  }

  const handleViewOnMap = () => {
    const encodedAddress = encodeURIComponent(address)
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(googleMapsUrl, "_blank")
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl premium-shadow elegant-border ${className}`}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h3>

        {/* Interactive Map Container */}
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            {/* Map Placeholder with Interactive Elements */}
            <div className="relative w-full h-full">
              {/* Simulated Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
                {/* Grid Pattern to simulate map */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-300 dark:border-gray-500"></div>
                    ))}
                  </div>
                </div>

                {/* Simulated Streets */}
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-400 dark:bg-gray-500 opacity-60"></div>
                <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-400 dark:bg-gray-500 opacity-60"></div>
                <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-gray-400 dark:bg-gray-500 opacity-60"></div>
                <div className="absolute top-0 bottom-0 right-1/3 w-1 bg-gray-400 dark:bg-gray-500 opacity-60"></div>
              </div>

              {/* Location Pin */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Pin Shadow */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-sm"></div>

                  {/* Main Pin */}
                  <div className="relative bg-red-500 rounded-full p-3 shadow-lg animate-bounce">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>

                  {/* Info Popup */}
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 min-w-max border border-gray-200 dark:border-gray-600">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 max-w-32 truncate">{address}</div>
                    {/* Arrow pointing down */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                  </div>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-1">
                <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 shadow-sm">
                  <span className="text-lg font-bold">+</span>
                </button>
                <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 shadow-sm">
                  <span className="text-lg font-bold">−</span>
                </button>
              </div>

              {/* Map Type Toggle */}
              <div className="absolute bottom-4 left-4">
                <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 shadow-sm">
                  Satellite
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Address Info */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{address}</p>
              {coordinates && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4">
          <Button onClick={handleGetDirections} className="flex-1" size="sm">
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
          <Button onClick={handleViewOnMap} variant="outline" className="flex-1 bg-transparent" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Maps
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Click "Get Directions" to open in Google Maps
        </div>
      </div>
    </div>
  )
}
