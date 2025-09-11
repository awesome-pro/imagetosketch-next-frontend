'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { LoaderIcon, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import authApi from '@/services/auth.service'
import { UserStatus } from '@/types'
import Link from 'next/link'

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const hasProcessedRef = useRef(false)

  useEffect(() => {
    // Prevent multiple executions using ref (survives re-renders)
    if (hasProcessedRef.current) return

    const handleCallback = async () => {
      try {
        hasProcessedRef.current = true // Mark as processed immediately
        
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const state = searchParams.get('state')

        if (error) {
          throw new Error(error === 'access_denied' ? 'Google authentication was cancelled' : 'Google authentication failed')
        }

        if (!code) {
          throw new Error('No authorization code received from Google')
        }

        // Send the code to our backend
        const { data: user } = await authApi.googleOAuthCallback({ code, state: state || undefined })

        if (user) {
          setStatus('success')
          toast.success('Successfully signed in with Google!')
          
          setTimeout(() => {
            switch(user.status) {
              case UserStatus.ACTIVE:
                 window.location.href = '/app'
                break
              case UserStatus.INACTIVE:
                window.location.href = '/auth/inactive'
                break
              default:
                window.location.href = '/auth/status'
                break
            }
          }, 1000)
        }

      } catch (error: any) {
        console.error('Google OAuth callback error:', error)
        setStatus('error')
        const message = error?.response?.data?.detail || error?.message || 'Authentication failed'
        setErrorMessage(message)
        toast.error(message)
        
        // Redirect to sign-in page after a delay
        setTimeout(() => {
          window.location.href = '/auth/sign-in?error=oauth_failed'
        }, 3000)
      }
    }

    handleCallback()
  }, [searchParams])  

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 dark:bg-gradient-to-br from-slate-700 to-slate-900">
      <Card className="w-[400px] mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            {status === 'loading' && (
              <>
                <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
                <div className="text-center">
                  <h2 className="text-lg font-semibold">Completing Sign In</h2>
                  <p className="text-sm text-muted-foreground">
                    This may take a few seconds as it depends on Google&apos;s servers 😅
                  </p>
                </div>

                <div className="text-center mt-7">
                
                  <h6 className="text-sm text-muted-foreground">
                    BTW, you may look at my other products on <Link href="https://abhinandan.pro" target="_blank" className="text-primary ml-2">abhinandan.pro</Link>
                  </h6>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-green-600">Success!</h2>
                  <p className="text-sm text-muted-foreground">
                    Redirecting you to the dashboard...
                  </p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle className="h-8 w-8 text-red-500" />
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-red-600">Authentication Failed</h2>
                  <p className="text-sm text-muted-foreground">
                    {errorMessage}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Redirecting you back to sign in...
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
