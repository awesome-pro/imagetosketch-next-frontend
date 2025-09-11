import { Clock, Heart, ImageIcon, Shield } from 'lucide-react';
import React from 'react'

function Stats() {
    const stats = [
        { number: "50K+", label: "Photos Transformed", icon: <ImageIcon className="w-6 h-6" /> },
        { number: "98%", label: "Satisfaction Rate", icon: <Heart className="w-6 h-6" /> },
        { number: "2.5s", label: "Average Process Time", icon: <Clock className="w-6 h-6" /> },
        { number: "24/7", label: "Available", icon: <Shield className="w-6 h-6" /> }
      ];
  return (
    <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container px-4 mx-auto">
            <div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
                {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                    <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                    </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.number}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                    </div>
                </div>
                ))}
            </div>
        </div>
  </section>
  )
}

export default Stats
