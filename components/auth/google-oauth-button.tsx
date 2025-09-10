'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FaGoogle } from 'react-icons/fa'
import { toast } from 'sonner'
import authApi from '@/services/auth.service'

interface GoogleOAuthButtonProps {
  mode: 'signin' | 'signup'
  disabled?: boolean
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function GoogleOAuthButton({ 
  mode, 
  disabled = false, 
  onSuccess, 
  onError 
}: GoogleOAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    
    try {
      // Get Google OAuth URL from backend
      const { data } = await authApi.getGoogleAuthUrl()
      
      // Redirect to Google OAuth
      window.location.href = data.auth_url
      
    } catch (error: any) {
      console.error('Google OAuth error:', error)
      toast.error(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      size="lg"
      className="w-full text-white"
      onClick={handleGoogleAuth}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          Connecting...
        </>
      ) : (
        <>
          <FaGoogle className="mr-2 h-4 w-4" />
          {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
        </>
      )}
    </Button>
  )
}
