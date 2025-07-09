"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, User, Menu, X, Moon, Sun, Globe, BookOpen, Sparkles, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md premium-shadow sticky top-0 z-50 transition-all duration-300 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-gray-900 font-semibold text-sm">EM</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">EMALL</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search malls, shops, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400/20 dark:focus:ring-gray-500/20"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/malls"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              Malls
            </Link>
            <Link
              href="/shops"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              Shops
            </Link>
            <Link
              href="/activities"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium flex items-center space-x-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Activities</span>
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium flex items-center space-x-1"
            >
              <BookOpen className="w-4 h-4" />
              <span>Style Blog</span>
            </Link>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                  <Globe className="w-4 h-4 mr-1" />
                  EN
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {}}>EN</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>FR</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>AR</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white bg-transparent"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user?.fullName || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href="/profile" passHref legacyBehavior>
                    <DropdownMenuItem asChild>
                      <a>
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </a>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white bg-transparent"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </form>
            <div className="space-y-2">
              <Link
                href="/malls"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Malls
              </Link>
              <Link
                href="/shops"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Shops
              </Link>
              <Link
                href="/activities"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center space-x-1"
              >
                <Sparkles className="w-4 h-4" />
                <span>Activities</span>
              </Link>
              <Link
                href="/blog"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center space-x-1"
              >
                <BookOpen className="w-4 h-4" />
                <span>Style Blog</span>
              </Link>
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="py-2 text-gray-700 dark:text-gray-300">
                    Welcome, {user?.fullName}
                  </div>
                  <button
                    onClick={logout}
                    className="block py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
