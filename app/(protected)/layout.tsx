import { AuthProvider } from '@/hooks/use-auth'
import React from 'react'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        {children}
    </AuthProvider>
  )
}

export default ProtectedLayout
