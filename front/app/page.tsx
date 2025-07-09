"use client"
import Link from "next/link"
import { ArrowRight, TrendingUp, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import MallCard from "@/components/MallCard"
import ShopCard from "@/components/ShopCard"
import ProductCard from "@/components/ProductCard"
import Image from "next/image"
import { useEffect, useState } from "react"
import axios from "axios";

// Ajouter le type Mall
interface Mall {
  _id: string;
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  rating: number;
  tags: string[];
  shopCount: number;
}

interface TrendingShop {
  id: string;
   _id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  tags: string[];
  mallName: string;
  productCount: number;
}

interface HotDeal {
  id: string;
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  tags: string[];
  shopName: string;
  shopId: string;
}

export default function HomePage() {
  const [featuredMalls, setFeaturedMalls] = useState<Mall[]>([])
  const [trendingShops, setTrendingShops] = useState<TrendingShop[]>([])
  const [hotDeals, setHotDeals] = useState<HotDeal[]>([])
  const [allShops, setAllShops] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
 
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [mallsRes, shopsRes, productsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/malls"),
        axios.get("http://localhost:5000/api/shops"),
        axios.get("http://localhost:5000/api/products"),
      ]);

      setFeaturedMalls(mallsRes.data);
      setTrendingShops(shopsRes.data.slice(0, 6)); // ou autre logique pour trending
      setAllShops(shopsRes.data);
      // Filtrer les produits en promotion
      const deals = productsRes.data.filter((p: any) => p.discount && p.discount > 0);
      setHotDeals(deals);
    } catch (err: any) {
      console.error("❌ Erreur Axios :", err.message);
      if (err.response) {
        console.error("Détails serveur :", err.response.data);
        setError("Erreur de communication avec le serveur");
      } else if (err.request) {
        console.error("❌ Aucun serveur n'a répondu :", err.request);
        setError("Impossible de se connecter au serveur");
      } else {
        console.error("❌ Erreur inconnue :", err);
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <img src="/placeholder-logo.svg" alt="Loading..." className="w-24 h-24 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Erreur de connexion</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Clothing Image */}
      <section className="relative text-white min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/luxury-shopping-hero.png"
            alt="Luxury clothing shopping background"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
        </div>

        {/* Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-purple-900/40 to-black/75 z-10"></div>

        {/* Additional Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/45 z-15"></div>

        {/* Animated Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-pulse z-20"></div>

        {/* Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium text-white/95 border border-white/25 mb-4">
                ✨ Premium Fashion Marketplace
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Discover
              </span>
              <span className="block text-white/98 font-light mt-2 drop-shadow-xl">Your Perfect Style</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/95 leading-relaxed drop-shadow-lg">
              Discover a world of luxury fashion and exceptional shopping experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/malls">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link href="/activities">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/35 text-white hover:bg-white/15 hover:text-white bg-white/8 backdrop-blur-sm shadow-xl hover:shadow-white/15 transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg"
                >
                  Take Style Quiz
                </Button>
              </Link>
            </div>

            {/* Clickable Feature Highlights */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link href="/malls" className="group">
                <div className="bg-white/12 backdrop-blur-sm rounded-lg p-4 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl">
                  <div className="text-2xl mb-2">👗</div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-purple-200 transition-colors">
                    Premium Clothing
                  </h3>
                  <p className="text-white/85 text-sm group-hover:text-white/95 transition-colors">
                    Curated fashion collections from top brands
                  </p>
                  <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white mt-2 transition-all duration-300 group-hover:translate-x-1" />
                </div>
              </Link>

              <Link href="/activities?tab=quiz" className="group">
                <div className="bg-white/12 backdrop-blur-sm rounded-lg p-4 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-purple-200 transition-colors">
                    Style Quiz
                  </h3>
                  <p className="text-white/85 text-sm group-hover:text-white/95 transition-colors">
                    AI-powered personalized clothing recommendations
                  </p>
                  <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white mt-2 transition-all duration-300 group-hover:translate-x-1" />
                </div>
              </Link>

              <Link href="/activities?tab=competition" className="group">
                <div className="bg-white/12 backdrop-blur-sm rounded-lg p-4 border border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl">
                  <div className="text-2xl mb-2">🏆</div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-purple-200 transition-colors">
                    Fashion Competitions
                  </h3>
                  <p className="text-white/85 text-sm group-hover:text-white/95 transition-colors">
                    Win prizes in clothing style challenges
                  </p>
                  <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white mt-2 transition-all duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Fashion Elements */}
        <div
          className="absolute top-20 left-10 w-3 h-3 bg-pink-400/50 rounded-full animate-bounce z-25"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-2 h-2 bg-purple-400/50 rounded-full animate-bounce z-25"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-20 w-4 h-4 bg-white/40 rounded-full animate-pulse z-25"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 right-32 w-2 h-2 bg-pink-300/50 rounded-full animate-ping z-25"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </section>

      {/* Featured Malls */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Featured Destinations
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover premium shopping destinations with the finest brands and exceptional experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMalls.map((mall) => (
            <MallCard key={mall._id} mall={mall} />
          ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/malls">
              <Button variant="outline" size="lg" className="border-gray-300 dark:border-gray-600 bg-transparent">
                View All Destinations
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Shops */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                <TrendingUp className="inline-block w-8 h-8 mr-3 text-gray-600 dark:text-gray-400" />
                Trending Now
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">Most popular shops this week</p>
            </div>
            <Link href="/shops">
              <Button variant="outline" className="border-gray-300 dark:border-gray-600 bg-transparent">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

       

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            
          {trendingShops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
          


          </div>
        </div>
      </section>

      {/* Hot Discounts */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                <Percent className="inline-block w-8 h-8 mr-3 text-red-500" />
                Special Offers
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">Limited time deals you don't want to miss</p>
            </div>
            <Link href="/search?discounted=true">
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                View All Deals
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotDeals.map((product) => (
              <ProductCard key={product._id} product={{ ...product, shopName: allShops.find(s => s._id === product.shopId)?.name || "Unknown Shop", shopId: product.shopId }} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-lg text-gray-300">Premium Malls</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-lg text-gray-300">Quality Shops</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-lg text-gray-300">Curated Products</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
