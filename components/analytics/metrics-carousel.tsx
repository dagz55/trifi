"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Users, CreditCard, TrendingUp, Briefcase, ShieldCheck, ShoppingCart } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

// TODO: Replace with real metric data fetched from your database/API
const metrics: any[] = []

export function MetricsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Width calculation for visible cards in the carousel (3.5 cards visible by default)
  const cardWidth = 100 / 3.5

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % metrics.length)
    }
  }

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prevIndex) => (prevIndex - 1 + metrics.length) % metrics.length)
    }
  }

  useEffect(() => {
    if (carouselRef.current) {
      const transitionEndHandler = () => {
        setIsAnimating(false)
        if (currentIndex === metrics.length - 1) {
          carouselRef.current!.style.transition = "none"
          setCurrentIndex(0)
          setTimeout(() => {
            carouselRef.current!.style.transition = "transform 0.3s ease-in-out"
          }, 50)
        } else if (currentIndex === 0) {
          carouselRef.current!.style.transition = "none"
          setCurrentIndex(metrics.length - 1)
          setTimeout(() => {
            carouselRef.current!.style.transition = "transform 0.3s ease-in-out"
          }, 50)
        }
      }

      carouselRef.current.addEventListener("transitionend", transitionEndHandler)

      return () => {
        carouselRef.current?.removeEventListener("transitionend", transitionEndHandler)
      }
    }
  }, [currentIndex])

  const renderMetrics = () => {
    if (metrics.length === 0) {
      return (
        <div className="flex items-center justify-center w-full h-[200px] text-muted-foreground">
          <p className="text-sm">No metrics available</p>
        </div>
      )
    }

    const items = [...metrics, ...metrics, ...metrics]
    return items.map((metric, index) => (
      <div key={index} className="flex-shrink-0" style={{ width: `${cardWidth}%` }}>
        <Card className="h-full mx-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {metric.icon && <metric.icon className="h-8 w-8 text-primary" />}
              {metric.change && (
                <span
                  className={`text-sm font-semibold ${metric.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                >
                  {metric.change}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold mb-2">{metric.title}</h3>
            <p className="text-2xl font-extrabold mb-4">{metric.value}</p>
            {metric.description && <p className="text-sm text-muted-foreground">{metric.description}</p>}
          </CardContent>
        </Card>
      </div>
    ))
  }

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="icon" onClick={prevSlide} className="z-10">
          &lt;
        </Button>
        <div className="flex-grow overflow-hidden">
          <div
            ref={carouselRef}
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}%)`,
              width: `${metrics.length * 3 * cardWidth}%`,
            }}
          >
            {renderMetrics()}
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={nextSlide} className="z-10">
          &gt;
        </Button>
      </div>
    </div>
  )
}
