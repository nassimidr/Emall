"use client"

import Link from "next/link"
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ImageCarousel from "@/components/ImageCarousel"
import ShopCard from "@/components/ShopCard"
import RatingStars from "@/components/RatingStars"
import InteractiveMap from "@/components/InteractiveMap"
import { useEffect, useState } from "react"
import axios from "axios"
import { use } from "react";

interface MallData {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  images: string[];
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  totalReviews: number;
  tags: string[];
  hours: Record<string, string>;
  socialMedia: Record<string, string>;
}

interface MallShop {
  id: string;
   _id: string; // <-- ajoute ceci
  mallId: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  tags: string[];
  mallName: string;
  productCount: number;
}
export default function MallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [mallData, setMallData] = useState<MallData | null>(null)
  const [mallShops, setMallShops] = useState<MallShop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Validation de l'ID MongoDB
  const validateMongoId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id)
  }

  useEffect(() => {
    const fetchData = async () => {
      const paramsObj = await params
      const id = paramsObj.id

      if (!validateMongoId(id)) {
        setError("ID de centre commercial invalide")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      const baseURL = "http://localhost:5000"

      try {
        const [mallRes, shopsRes] = await Promise.all([
          axios.get(`${baseURL}/api/malls/${id}`),
          axios.get(`${baseURL}/api/shops/mall/${id}`)
        ])

        setMallData(mallRes.data)
        setMallShops(shopsRes.data)
      } catch (err: any) {
        console.error("❌ Erreur Axios :", {
          message: err.message,
          code: err.code,
          response: err.response?.data,
          request: err.request,
        })
        
        if (err.response?.status === 404) {
          setError("Centre commercial non trouvé")
        } else {
          setError("Impossible de charger les données du centre commercial")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <img src="/placeholder-logo.svg" alt="Loading..." className="w-24 h-24 animate-spin" />
      </div>
    )
  }

  if (error || !mallData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Erreur</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || "Données de centre commercial non disponibles"}</p>
          <Link href="/malls">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
              Retour aux centres commerciaux
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
            <span>/</span>
            <Link href="/malls" className="hover:text-blue-600 dark:hover:text-blue-400">
              Malls
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{mallData.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <ImageCarousel images={mallData.images} alt={mallData.name} />
            </div>

            {/* Mall Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{mallData.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <RatingStars rating={mallData.rating} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{mallData.totalReviews} reviews</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {mallData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">{mallData.fullDescription}</p>

              {/* Hours */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Opening Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mallData.hours && typeof mallData.hours === 'object' && mallData.hours !== null &&
                    Object.entries(mallData.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{day}:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{hours}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                    <p className="text-gray-900 dark:text-white">{mallData.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <a href={`tel:${mallData.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {mallData.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <a href={`mailto:${mallData.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {mallData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Website</p>
                    <a
                      href={`https://${mallData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {mallData.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Follow us</p>
                <div className="flex space-x-3">
                  {mallData.socialMedia && mallData.socialMedia.facebook && (
                    <a
                      href={mallData.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {mallData.socialMedia && mallData.socialMedia.instagram && (
                    <a
                      href={mallData.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387z" />
                      </svg>
                    </a>
                  )}
                  {mallData.socialMedia && mallData.socialMedia.twitter && (
                    <a
                      href={mallData.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-500"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <InteractiveMap
              address={mallData.address}
              name={mallData.name}
              coordinates={{ lat: 40.7589, lng: -73.9851 }} // Example coordinates for NYC
            />
          </div>
        </div>

        {/* Shops Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shops in {mallData.name}</h2>
            <Link href="/shops">
              <Button variant="outline">View All Shops</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mallShops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}
