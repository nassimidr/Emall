"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Gift, Sparkles } from "lucide-react"

interface SpinWheelProps {
  onSpinComplete: (amount: number) => void
  hasSpun?: boolean
}

export default function SpinWheel({ onSpinComplete, hasSpun = false }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [wonAmount, setWonAmount] = useState<number | null>(null)

  const prizes = [50, 100, 150, 200, 300, 500]
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]

  const handleSpin = () => {
    if (isSpinning || hasSpun || wonAmount) return

    setIsSpinning(true)

    // Calculate random rotation (multiple full spins + random final position)
    const spins = 5 + Math.random() * 5 // 5-10 full rotations
    const finalRotation = Math.random() * 360 // Random final position
    const totalRotation = rotation + spins * 360 + finalRotation

    setRotation(totalRotation)

    // Determine winner after animation
    setTimeout(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)]
      setWonAmount(randomPrize)
      setIsSpinning(false)
      onSpinComplete(randomPrize)
    }, 3000)
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        {/* SVG Wheel with rotation */}
        <svg
          width="320"
          height="320"
          className="drop-shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 3s cubic-bezier(0.23, 1, 0.32, 1)" : "none",
          }}
        >
          <g transform="translate(160,160)">
            {prizes.map((prize, index) => {
              const angle = (360 / prizes.length) * index
              const nextAngle = (360 / prizes.length) * (index + 1)
              const startAngleRad = (angle * Math.PI) / 180
              const endAngleRad = (nextAngle * Math.PI) / 180

              const x1 = Math.cos(startAngleRad) * 150
              const y1 = Math.sin(startAngleRad) * 150
              const x2 = Math.cos(endAngleRad) * 150
              const y2 = Math.sin(endAngleRad) * 150

              const largeArcFlag = nextAngle - angle <= 180 ? "0" : "1"

              const pathData = ["M", 0, 0, "L", x1, y1, "A", 150, 150, 0, largeArcFlag, 1, x2, y2, "Z"].join(" ")

              // Text position (middle of the segment)
              const textAngle = (angle + nextAngle) / 2
              const textAngleRad = (textAngle * Math.PI) / 180
              const textX = Math.cos(textAngleRad) * 100
              const textY = Math.sin(textAngleRad) * 100

              return (
                <g key={index}>
                  <path d={pathData} fill={colors[index]} stroke="white" strokeWidth="3" />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="20"
                    fontWeight="bold"
                    style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.8))" }}
                  >
                    ${prize}
                  </text>
                </g>
              )
            })}
          </g>

          {/* Center circle */}
          <circle cx="160" cy="160" r="30" fill="#2D3748" stroke="white" strokeWidth="4" />

          {/* Center sparkles icon */}
          <g transform="translate(160,160)">
            <circle cx="0" cy="0" r="15" fill="#4A5568" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16">
              ✨
            </text>
          </g>
        </svg>

        {/* Static Pointer (doesn't rotate with wheel) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-10">
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-red-500 drop-shadow-lg"></div>
        </div>

        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-800 dark:border-white pointer-events-none"></div>
      </div>

      {/* Win announcement */}
      {wonAmount && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-center max-w-md">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="text-3xl">🎉</div>
            <h3 className="text-2xl font-bold text-green-800">Congratulations!</h3>
          </div>
          <p className="text-green-700 text-lg">
            You won <span className="font-bold text-3xl text-green-600">${wonAmount}</span> shopping cash!
          </p>
          <p className="text-sm text-green-600 mt-2">Use it to build your perfect outfit below</p>
        </Card>
      )}

      {/* Spin button */}
      <Button
        onClick={handleSpin}
        disabled={isSpinning || hasSpun || wonAmount !== null}
        size="lg"
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSpinning ? (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Spinning...
          </>
        ) : wonAmount ? (
          <>
            <Gift className="w-5 h-5 mr-2" />
            Prize Won!
          </>
        ) : hasSpun ? (
          "Already Spun!"
        ) : (
          <>
            <Gift className="w-5 h-5 mr-2" />
            Spin to Win!
          </>
        )}
      </Button>

      {(hasSpun || wonAmount) && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
          You can spin once per competition. Come back for the next competition!
        </p>
      )}
    </div>
  )
}
