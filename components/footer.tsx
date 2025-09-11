import { PencilIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <footer className="py-16 bg-white lg:px-7 text-sm text-slate-600 ">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className='space-y-2'>
              <Link href="/" className='text-2xl font-semibold font-serif text-primary flex items-center gap-2'>
                Sketchify<PencilIcon className='w-6 h-6' /> 
              </Link>
              <p className='text-black/80'>Transform your photos into stunning sketches with our AI-powered platform.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-3 text-slate-400">
                <Link href="/features" className="block hover:text-primary transition-colors">Features</Link>
                <Link href="/pricing" className="block hover:text-primary transition-colors">Pricing</Link>
                <Link href="/gallery" className="block hover:text-primary transition-colors">Gallery</Link>
                <Link href="/api" className="block hover:text-primary transition-colors">API</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-3 text-slate-400">
                <Link href="/about" className="block hover:text-primary transition-colors">About Us</Link>
                <Link href="/blog" className="block hover:text-primary transition-colors">Blog</Link>
                <Link href="/careers" className="block hover:text-primary transition-colors">Careers</Link>
                <Link href="/contact" className="block hover:text-primary transition-colors">Contact</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-3 text-slate-400">
                <Link href="/help" className="block hover:text-primary transition-colors">Help Center</Link>
                <Link href="/privacy" className="block hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block hover:text-primary transition-colors">Terms of Service</Link>
                <Link href="/status" className="block hover:text-primary transition-colors">Status</Link>
              </div>
            </div>
          </div>
          
          <div className="pt-8 mt-5 border-t border-slate-300 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600">
              © {new Date().getFullYear()} Sketchify. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-primary text-sm">
              <span>Made with ❤️ for creators</span>
            </div>
          </div>
      </footer>
  )
}

export default Footer
