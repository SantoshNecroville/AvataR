"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Mic, PlayCircle, Smile } from "lucide-react";

const Showcase: React.FC = () => {
  return (
    <section
      id="showcase"
      className="relative py-16 md:py-24 bg-white dark:bg-black transition-colors duration-300 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full animate-pulse delay-200">
              <div className="absolute inset-1 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-purple-500" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Experience{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-200 animate-pulse">
              AI Avatars
            </span>{" "}
            in Action
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See our revolutionary technology through interactive demonstrations
          </p>
        </div>


        <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="aspect-video relative">

            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent flex items-center justify-center">
              <div className="text-white text-center p-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">
                  Lifelike AI Avatars
                </h3>
                <p className="text-lg mb-6 max-w-lg text-black dark:text-white">
                  Experience realistic expressions, natural head movements, and
                  perfect lip synchronization
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Ready to see more?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Check out our complete demo library
              </p>
            </div>
            <Link
              href="/demo"
              className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              View Full Demos
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-16 relative">
          <div className="mb-10 relative">

            <h2 className="text-3xl md:text-4xl font-bold text-center relative z-10">
              <span className="inline-block relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-200">
                  Key
                </span>
              </span>{" "}
              <span className="relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-purple-600 after:to-purple-400 after:rounded-full after:opacity-80 after:blur-sm">
                Features
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100 dark:border-purple-900/50 hover:scale-[1.03] group">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-[1.21] transition-all ease-linear">
                <Smile className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Realistic Avatars
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Photorealistic AI avatars that capture human expressions with
                stunning detail.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100 dark:border-purple-900/50 hover:scale-[1.03] group">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-[1.21] transition-all ease-linear">
                <Mic className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Voice Cloning
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Zero-shot voice cloning technology that reproduces any voice
                with just a short sample.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100 dark:border-purple-900/50 hover:scale-[1.03] group">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-[1.21] transition-all ease-linear">
                <PlayCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Lip Sync & Movement
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Perfect synchronization between speech and lip movements with
                natural head positioning.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <Link
            href="/demo"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
          >
            Explore All Demos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
