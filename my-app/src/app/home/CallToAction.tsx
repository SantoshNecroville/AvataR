// src/app/home/CallToAction.tsx
'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-purple-600 to-purple-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Transform Your Digital Identity Today
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who have already elevated their online presence with our AI-powered avatars.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#signup" 
              className="group px-8 py-3 bg-white text-purple-700 font-medium rounded-md shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              Get Started Now
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            
            <a 
              href="/demo" 
              className="px-8 py-3 bg-transparent text-white font-medium rounded-md shadow-md hover:shadow-lg border border-white/30 hover:bg-white/10 transition-all duration-300"
            >
              See Live Demo
            </a>
          </div>
          
          <p className="mt-6 text-sm text-purple-200">
            No credit card required. Free trial available.
          </p>
        </div>
      </div>
    </section>
  )
}

export default CallToAction