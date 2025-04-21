'use client';
import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Emily R.",
    feedback: "This is the future! I made a talking avatar of my dog and it actually moved its lips. Mind blown 🤯.",
  },
  {
    name: "Dev Patel",
    feedback: "Incredibly realistic avatars — great for YouTube and storytelling! Love the smooth UI too.",
  },
  {
    name: "Zara L.",
    feedback: "Voice cloning works insanely well. Generated my AI twin Which has Really Realistic Head and Lip Movements!",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-6 md:px-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-14 text-indigo-600 dark:text-indigo-400">
        What People Are Saying 💬
      </h2>

      <div className="grid md:grid-cols-3 gap-10">
        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg hover:scale-[1.03] transition-all ease-linear shadow-md border border-gray-100 dark:border-gray-700"
          >
            <p className="text-lg italic mb-4 text-gray-700 dark:text-gray-300">“{item.feedback}”</p>
            <p className="font-semibold text-right text-gray-900 dark:text-white">— {item.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
