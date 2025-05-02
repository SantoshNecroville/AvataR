// src/app/home/Hero.tsx
"use client";

import React from "react";
// import Image from 'next/image';
import SplineViewer from "../components/SplineViewer";

const Hero1: React.FC = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-sm font-medium">
              Next-Gen AI Avatar Creation
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Transform Your
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-200">
                {" "}
                Digital Identity
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Create stunning, hyper-realistic avatars powered by cutting-edge
              AI. Express yourself like never before with our advanced avatar
              generation technology.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* <a
                href="#signup"
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </a> */}
              <a
                href="#signup"
                className="group relative px-8 py-3 bg-purple-600 hover:bg-transparent text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300 border-2 border-purple-600 hover:text-purple-600 hover:border-purple-600 hover:scale-[1.07]"
              >
                Get Started
                <div className="star-1 absolute w-6 h-6 top-1/2 left-0.5 z-0 opacity-0 group-hover:opacity-100 group-hover:-translate-x-8 group-hover:-translate-y-4 transition-all duration-1000">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    version="1.1"
                    viewBox="0 0 784.11 815.53"
                  >
                    <path
                      className="fill-purple-600"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    />
                  </svg>
                </div>
                <div className="star-2 absolute w-4 h-4 top-1/2 left-1/4 z-0 opacity-0 group-hover:opacity-100 group-hover:-translate-y-6 group-hover:-translate-x-6 transition-all duration-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    version="1.1"
                    viewBox="0 0 784.11 815.53"
                  >
                    <path
                      className="fill-purple-600"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    />
                  </svg>
                </div>
                <div className="star-3 absolute w-3 h-3 top-3/4 left-1/4 z-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 group-hover:-translate-x-6 transition-all duration-1000">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    version="1.1"
                    viewBox="0 0 784.11 815.53"
                  >
                    <path
                      className="fill-purple-600"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    />
                  </svg>
                </div>
                <div className="star-4 absolute w-2 h-2 top-1/2 right-1/4 z-0 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 group-hover:translate-x-6 transition-all duration-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    version="1.1"
                    viewBox="0 0 784.11 815.53"
                  >
                    <path
                      className="fill-purple-600"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    />
                  </svg>
                </div>
                <div className="star-5 absolute w-4 h-4 top-1/2 right-0 z-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-8 transition-all duration-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    version="1.1"
                    viewBox="0 0 784.11 815.53"
                  >
                    <path
                      className="fill-purple-600"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    />
                  </svg>
                </div>
                <div className="star-6 absolute w-3 h-3 top-3/4 right-1/4 z-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 group-hover:translate-x-6 transition-all duration-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    version="1.1"
                    viewBox="0 0 784.11 815.53"
                  >
                    <path
                      className="fill-purple-600"
                      d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                    />
                  </svg>
                </div>
              </a>

              <a
                href="/demo"
                className="px-8 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-medium rounded-md shadow-md hover:shadow-lg border border-purple-400 dark:border-purple-800 dark:hover:bg-purple-600  dark:hover:text-black transition-all duration-300"
              >
                Try Demo
              </a>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 md:h-96 lg:h-full">
            <div className="absolute inset-0 bg-purple-200 dark:bg-purple-900 rounded-2xl overflow-hidden shadow-xl transition-colors duration-300">
              <div className="p-4 h-full flex items-center justify-center">
                {/* Hero image - realistic avatar */}
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-transparent rounded-xl">
                    {/* <SplineViewer url="https://prod.spline.design/fJ2ptJKzT-sDkpfO/scene.splinecode" /> */}
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;
