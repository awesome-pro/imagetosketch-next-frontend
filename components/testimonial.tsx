"use client";

import { motion } from 'framer-motion'
import React from 'react'
import { Badge } from './ui/badge'
import { Quote, Star } from 'lucide-react'
import Image from 'next/image'


function Testimonial() {

    const testimonials = [
        {
          name: "Sarah Johnson",
          role: "Digital Artist",
          content: "The quality of sketches is absolutely incredible. It's like having a professional artist at your fingertips.",
          avatar: "/users/1.webp",
          rating: 5
        },
        {
          name: "Michael Chen",
          role: "Photographer",
          content: "I use this for all my portrait work. The AI understands facial features better than any other tool I've tried.",
          avatar: "/users/2.webp",
          rating: 5
        },
        {
          name: "Emma Davis",
          role: "Content Creator",
          content: "Perfect for social media content. My followers love the artistic touch it adds to regular photos.",
          avatar: "/users/3.webp",
          rating: 5
        }
      ];

      
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-2 bg-white border-primary/20">
              <Quote className="w-4 h-4 mr-2" />
              Customer Love
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our <span className="text-primary">Creators Say</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join thousands of satisfied artists, photographers, and content creators who trust ImageToSketch.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <Image 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Testimonial
