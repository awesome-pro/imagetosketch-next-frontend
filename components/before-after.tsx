"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from './ui/badge'
import { Eye } from 'lucide-react'
import { Button } from './ui/button'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link';

function BeforeAfter() {
    const beforeAfterExamples = [
        {
          before: '/sketches/s1.webp',
          after: '/sketches/s1.webp',
          style: 'Classic Pencil'
        },
        {
          before: '/sketches/s2.webp',
          after: '/sketches/s2.webp',
          style: 'Artistic Charcoal'
        },
        {
          before: '/sketches/s4.webp',
          after: '/sketches/s4.webp',
          style: 'Fine Line Art'
        },
        {
          before: '/sketches/s5.webp',
          after: '/sketches/s5.webp',
          style: 'Watercolor'
        },
        {
          before: '/sketches/s6.webp',
          after: '/sketches/s6.webp',
          style: 'Oil'
        },
        {
          before: '/sketches/s8.webp',
          after: '/sketches/s8.webp',
          style: 'Pastel'
        }
      ];

      
  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container px-4 mx-auto">
          <div 
            className="text-center mb-16"
           
          >
            <Badge variant="outline" className="mb-4 px-4 py-2 bg-primary/10 border-primary/20">
              <Eye className="w-4 h-4 mr-2" />
              See the Magic
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Real Photos, <span className="text-primary">Stunning Results</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Witness the transformation power of our AI. From ordinary photos to extraordinary artistic sketches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beforeAfterExamples.map((example, index) => (
              <motion.div 
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image 
                    src={example.before} 
                    alt={`Example ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-white/90 text-slate-900 hover:bg-white">
                      {example.style}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 px-8 py-4 rounded-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              asChild
            >
              <Link href={'/gallery'}>
                <ImageIcon className="w-5 h-5" />
                View Full Gallery
              </Link>
            </Button>
          </div>
        </div>
      </section>

  )
}

export default BeforeAfter
