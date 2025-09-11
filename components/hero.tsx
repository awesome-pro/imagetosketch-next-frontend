"use client";

import React from 'react'
import { ArrowRight, Camera, ChevronRight, Play, Star } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';

function Hero() {

    const userImages: string[] = [
        '/users/1.webp',
        '/users/2.webp',
        '/users/3.webp',
        '/users/4.webp',
    ];

  return (
    <section className='flex flex-col items-center justify-center h-screen'>
    <div className="container px-4 mx-auto relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div>
           <Button size={'lg'} asChild variant={'outline'} className='rounded-full hover:bg-primary hover:text-white transition-all duration-300 bg-primary/20 text-primary'>
              <Link href={'/app'} className="flex items-center text-xs">
                Try our new modal <ArrowRight className="w-4 h-4 mr-2" />
              </Link>
           </Button>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            Transform Photos into{" "}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Stunning Sketches
            </span>
          </h1>
          
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the magic of AI artistry. Convert any photo into professional-quality pencil sketches, 
            charcoal drawings, or fine line art in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className='rounded-full h-12 w-full md:w-60'
              asChild
            >
              <Link href={'/auth/sign-in'}>
                Start Creating Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              className='rounded-full h-12 w-full md:w-60 bg-primary/10 text-primary'
              variant="outline" 
              asChild
            >
              <Link href={'/gallery'}>
                View Examples
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
              {userImages.map((image, index) => (
                  <div key={index} className="relative">
                    <Image 
                      src={image} 
                      alt={`User ${index + 1}`} 
                      width={48} 
                      height={48} 
                      className="rounded-full border-3 border-white shadow-lg"
                    />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">50,000+</span> creators trust us
                </p>
              </div>
            </div>
            

          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Hero
