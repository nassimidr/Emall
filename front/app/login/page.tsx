"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = () => {
    // Mock Google login
    alert("Google login would be implemented here")
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    const result = await login(email, password)
    
    if (result.success) {
      window.location.href = "/"
    } else {
      alert(result.error || 'Login failed')
    }
    
    setIsLoading(false)
  }

  const handleGuestAccess = () => {
    // Mock guest access
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center">
              <span className="text-black font-bold">LX</span>
            </div>
            <span className="text-2xl font-light tracking-wider text-gray-900 dark:text-white">LUXE</span>
          </Link>
          <h2 className="text-3xl font-thin text-gray-900 dark:text-white tracking-wide">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 font-light">
            Sign in to access exclusive luxury collections
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 premium-shadow-lg rounded-lg elegant-shadow p-8 luxury-border">
          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full mb-6 h-12 bg-transparent border-gold-500/50 text-gold-400 hover:bg-gold-500/10 font-light"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-800 text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 mt-1"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember-me" className="ml-2 text-sm">
                  Remember me
                </Label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full gold-gradient text-black hover:opacity-90 font-medium" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          {/* Guest Access */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleGuestAccess} variant="ghost" className="w-full">
              Continue as Guest
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
