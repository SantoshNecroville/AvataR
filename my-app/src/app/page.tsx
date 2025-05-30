"use client";

import React from "react";
import Hero from "./home/Hero1";
import Features from "./home/Features";
import Showcase from "./home/Showcase";
import Testimonials from "./home/Testimonials";
import CallToAction from "./home/CallToAction";
import Footer from "./home/Footer";
import Navbar from "./home/Navbar";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <Navbar />

        <main>
          <Hero />
          <Features />
          <Showcase />
          <Testimonials />
          <CallToAction />
        </main>

        <Footer />
      </div>
    </div>
  );
}
