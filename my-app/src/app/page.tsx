"use client";

import React from "react";
// src/app/page.tsx
import Hero from "./home/Hero1";
import Features from "./home/Features";
import Showcase from "./home/Showcase";
import Testimonials from "./home/Testimonials";
// import Pricing from './home/Pricing'
import CallToAction from "./home/CallToAction";
import Footer from "./home/Footer";
// import Header from './home/Header'
import Navbar from "./home/Navbar";
// import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      {/* <button
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }>
      </button> */}
      <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
        <Navbar />

        <main>
          <Hero />
          <Features />
          <Showcase />
          <Testimonials />
          {/* <Pricing /> */}
          <CallToAction />
        </main>

        <Footer />
      </div>
    </div>
  );
}
