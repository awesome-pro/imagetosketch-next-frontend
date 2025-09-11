"use client";

import { motion } from 'framer-motion'
import React from 'react'
import { Button } from './ui/button'
import { ArrowRight, TrendingUp, CheckCircle, Clock10Icon, Shield, Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link';

function CTA() {
  return (
    <section className="flex flex-col items-center text-center justify-center min-h-[70vh] bg-gradient-to-r from-rose-200 via-white to-rose-100">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary z-20">
            Ready to Create Amazing Art?
          </h2>
          <p className="text-sm lg:text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join over 50,000 creators who have transformed millions of photos into stunning sketches. Start your artistic journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              asChild
              className='rounded-full h-12 w-full md:w-60'
            >
              <Link href={'/app'}>
                Start Creating Now
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button
              size="lg"
              asChild
              variant="outline"
              className='rounded-full h-12 w-full md:w-60 border-2 border-primary text-primary'
            >
              <Link href={'/app'}>
                 Contact Us
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center items-center gap-8 text-sm text-rose-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock10Icon className="w-4 h-4" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Premium Quality</span>
            </div>
          </div>
  </section>
  )
}

export default CTA
