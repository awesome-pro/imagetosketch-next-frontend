import CTA from '@/components/cta'
import Footer from '@/components/footer'
import Header from '@/components/header'
import React from 'react'

function PublicLayout(
    { children }: { children: React.ReactNode }
) {
  return (
    <main>
        <Header />
        { children }
        <CTA />
        <Footer />
    </main>
  )
}

export default PublicLayout
