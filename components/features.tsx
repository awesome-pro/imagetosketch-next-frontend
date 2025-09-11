"use client";

import { motion } from 'framer-motion'
import { Badge } from './ui/badge'
import React from 'react'
import { Award, CpuIcon, DownloadCloud, PaletteIcon, Shield, Users2Icon, ZapIcon } from 'lucide-react';

function Features() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-900">
    <div className="container px-4 mx-auto">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Badge variant="outline" className="mb-4 px-4 py-2 bg-primary/10 border-primary/20">
          <Award className="w-4 h-4 mr-2" />
          Premium Features
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Why Choose <span className="text-primary">Sketchify</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          Industry-leading technology meets intuitive design. Experience the difference with our premium sketch conversion platform.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: <CpuIcon className="w-8 h-8" />,
            title: "Advanced AI Engine",
            description: "State-of-the-art neural networks trained on millions of artistic sketches for unmatched quality.",
            gradient: "from-blue-500 to-cyan-500"
          },
          {
            icon: <ZapIcon className="w-8 h-8" />,
            title: "Lightning Fast",
            description: "Process images in under 3 seconds with our optimized cloud infrastructure.",
            gradient: "from-yellow-500 to-orange-500"
          },
          {
            icon: <PaletteIcon className="w-8 h-8" />,
            title: "Multiple Art Styles",
            description: "Choose from 12+ artistic styles including pencil, charcoal, ink, and watercolor effects.",
            gradient: "from-purple-500 to-pink-500"
          },
          {
            icon: <Shield className="w-8 h-8" />,
            title: "Privacy Protected",
            description: "Your images are automatically deleted after processing. We never store your personal photos.",
            gradient: "from-green-500 to-emerald-500"
          },
          {
            icon: <DownloadCloud className="w-8 h-8" />,
            title: "HD Downloads",
            description: "Get high-resolution outputs up to 4K. Perfect for printing and professional use.",
            gradient: "from-indigo-500 to-blue-500"
          },
          {
            icon: <Users2Icon className="w-8 h-8" />,
            title: "Batch Processing",
            description: "Upload and process multiple images simultaneously to save time on large projects.",
            gradient: "from-red-500 to-pink-500"
          }
        ].map((feature, index) => (
          <motion.div 
            key={index}
            className="group relative bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 hover:bg-white dark:hover:bg-slate-750 transition-all duration-300 border border-primary/10 dark:border-slate-700/50 hover:border-primary hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  )
}

export default Features
