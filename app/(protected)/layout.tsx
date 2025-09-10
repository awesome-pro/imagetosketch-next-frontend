import { AuthProvider } from '@/hooks/use-auth'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   <AuthProvider>
    {children}
   </AuthProvider>
  )
}