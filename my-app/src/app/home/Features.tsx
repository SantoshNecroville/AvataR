// src/app/home/Features.tsx
"use client";

import React from "react";
import { Sparkles, Wand2, Shield, ZoomIn, Clock, Download } from "lucide-react";
import { motion } from "framer-motion";


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
      }}
      className="p-6 bg-white dark:bg-black rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 relative z-10 group hover:scale-[1.03]"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mb-4 relative group-hover:scale-[1.21] transition-all ease-linear">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 relative">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 relative">{description}</p>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Sparkles size={24} />,
      title: "Hyper-Realistic Output",
      description:
        "Our advanced AI generates avatars so realistic they're indistinguishable from professional photography.",
    },
    {
      icon: <Wand2 size={24} />,
      title: "One-Click Generation",
      description:
        "Transform your photos into stunning professional avatars with just a single click.",
    },
    {
      icon: <ZoomIn size={24} />,
      title: "High Resolution",
      description:
        "Get Crystal-clear avatars in High resolution, perfect for any platform or print media.",
    },
    {
      icon: <Shield size={24} />,
      title: "Privacy First",
      description:
        "Your photos are processed securely and never stored or shared with third parties.",
    },
    {
      icon: <Clock size={24} />,
      title: "Lightning Fast",
      description:
        "Get your realistic avatars in seconds, not minutes or hours like other services.",
    },
    {
      icon: <Download size={24} />,
      title: "Multiple Formats",
      description:
        "Download your avatars in various formats including PNG, JPEG, and SVG for different use cases.",
    },
  ];

  return (
    <section
      id="features"
      className="relative py-16 md:py-24 bg-gray-50 mt-5 dark:bg-black transition-colors duration-300 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute w-full h-full top-0 left-0 overflow-hidden -z-10">
        {/* Logo watermark */}
        <div className="absolute bottom-10 right-10 opacity-5 dark:opacity-[0.02]">
          {/* <svg width="200" height="200" viewBox="0 0 100 100" className="text-purple-900 dark:text-purple-300">
            <path d="M50 10 C70 10, 90 30, 90 50 C90 70, 70 90, 50 90 C30 90, 10 70, 10 50 C10 30, 30 10, 50 10 Z" fill="none" stroke="currentColor" strokeWidth="2"></path>
            <path d="M30 40 L45 60 L70 30" fill="none" stroke="currentColor" strokeWidth="3"></path>
          </svg> */}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Advanced{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-200">
              Features
            </span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to create stunning, professional realistic
            avatars
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
