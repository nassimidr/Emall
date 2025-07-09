"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageCarouselProps {
  images: string[]
  alt: string
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  if (images.length === 0) return null

  return (
    <div className="relative">
      <div className="relative h-96 rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
        />

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={goToNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex ? "border-blue-500" : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={images[index] || "/placeholder.svg"}
                alt={`${alt} thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
