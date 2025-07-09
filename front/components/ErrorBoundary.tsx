"use client"

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Une erreur s'est produite
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {this.state.error?.message || 'Une erreur inattendue s\'est produite'}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Recharger la page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Composant pour afficher les erreurs d'API
export const ApiErrorDisplay = ({ 
  error, 
  onRetry, 
  title = "Erreur de connexion",
  message 
}: {
  error: string | null
  onRetry?: () => void
  title?: string
  message?: string
}) => {
  if (!error) return null

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message || error}</p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Réessayer
          </Button>
        )}
      </div>
    </div>
  )
} 