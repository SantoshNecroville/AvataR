'use client';
import React from 'react';
import { motion } from 'framer-motion';

const LiveDemoTeaser = () => {
  return (
    <section className="relative py-20 px-6 md:px-20 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          🎥 Experience the Magic Live
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          Type a prompt, watch the avatar talk — all in real time. No setup, no hassle. Just click and be amazed.
        </p>
        <a
          href="/generate"
          className="inline-block bg-purple-600 hover:bg-purple-700 hover:scale-[1.03] transition-all px-6 py-3 text-lg font-medium rounded-full shadow-lg"
        >
          Try the Demo 🚀
        </a>
      </motion.div>
    </section>
  );
};

export default LiveDemoTeaser;
