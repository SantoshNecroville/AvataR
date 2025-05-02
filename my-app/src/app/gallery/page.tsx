'use client';  // src/app/gallery/page.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, Menu, X } from 'lucide-react';

const GalleryPage = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  
  const featuredCollections = [
    { name: 'Ethereal', icon: '✨', path: '/gallery/collections/ethereal' },
    { name: 'Celestial', icon: '🌠', path: '/gallery/collections/celestial' },
    { name: 'Neon', icon: '💜', path: '/gallery/collections/neon' },
    { name: 'Mystical', icon: '🔮', path: '/gallery/collections/mystical' }
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <div className={`relative w-screen min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} overflow-hidden`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-30 transition duration-300 ${
        isScrolling 
          ? theme === 'dark' 
            ? 'bg-black/80 backdrop-blur-md shadow-lg' 
            : 'bg-white/80 backdrop-blur-md shadow-lg' 
          : ''
      }`}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'} tracking-wider`}>Avatar Lab</h2>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/gallery/collections" className={`${theme === 'dark' ? 'hover:text-purple-300' : 'hover:text-purple-600'} transition-colors`}>Collections</Link>
            <Link href="/gallery/trending" className={`${theme === 'dark' ? 'hover:text-purple-300' : 'hover:text-purple-600'} transition-colors`}>Trending</Link>
            <Link href="/dashboard">
              <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium shadow-md hover:shadow-purple-500/20 transition-all">Create Avatar</button>
            </Link>
            {/* Theme Toggle for Desktop */}
            <button
              className={`p-2 rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
          
          {/* Mobile Menu Controls */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Theme Toggle for Mobile */}
            <button
              className={`p-2 rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            {/* Menu Toggle Button */}
            <button
              className={`p-2 rounded-full transition-colors ${
                theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100/80"
              }`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={24} className="text-indigo-400" />
              ) : (
                <Menu size={24} className="text-indigo-400" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden ${theme === 'dark' ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-md shadow-lg py-4 px-6`}>
            <div className="flex flex-col space-y-4">
              <Link href="/gallery/collections" onClick={toggleMenu} className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'} font-medium py-2`}>
                Collections
              </Link>
              <Link href="/gallery/trending" onClick={toggleMenu} className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'} font-medium py-2`}>
                Trending
              </Link>
              <Link href="/gallery/featured/create" onClick={toggleMenu}>
                <button className="w-full px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium shadow-md transition-all">
                  Create Avatar
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      {/* Background */}
      <img src="/avatars/ai.jpg" alt="Gallery Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className={`absolute inset-0 ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-black/80 via-black/70 to-purple-900/30' 
          : 'bg-gradient-to-b from-white/80 via-white/70 to-purple-100/40'
      } z-10`} />
      
      {/* Hero Section */}
      <div className="relative z-20 flex flex-col items-center justify-center h-screen text-center space-y-8 px-6">
        <div className="space-y-2">
          <h1 className={`text-5xl md:text-7xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} drop-shadow-lg`}>
            <span className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}>Avatar</span> Lab Gallery
          </h1>
          <div className={`h-1 w-24 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-300 to-purple-600' : 'bg-gradient-to-r from-purple-400 to-purple-700'} mx-auto rounded-full`}></div>
        </div>
        <p className={`max-w-2xl text-lg md:text-xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} leading-relaxed`}>
          Dive into a curated collection of expressive avatars—crafted with emotion, design, and voice.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Link href="/gallery/collections">
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium rounded-full shadow-lg hover:shadow-purple-500/50 transition-all">
              Explore Images →
            </button>
          </Link>
          <Link href="/dashboard">
            <button className={`px-8 py-4 ${
              theme === 'dark' 
                ? 'bg-white/10 hover:bg-white/20 border border-purple-300/30' 
                : 'bg-purple-100/60 hover:bg-purple-200/80 border border-purple-300/30'
            } backdrop-blur-sm text-${theme === 'dark' ? 'white' : 'purple-800'} text-lg font-medium rounded-full shadow-lg hover:shadow-purple-300/20 transition-all`}>
              + Create Avatar
            </button>
          </Link>
        </div>
      </div>
      
      {/* Featured Collections Section */}
      <div className={`relative z-20 px-6 py-16 ${
        theme === 'dark' ? 'bg-black/70' : 'bg-white/70'
      } backdrop-blur-lg`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <div className={`h-px w-12 ${theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
            <h2 className={`text-3xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mx-4`}>
              <span className={theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}>Featured</span> Collections
            </h2>
            <div className={`h-px w-12 ${theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featuredCollections.map(({ name, icon, path }) => (
              <Link key={name} href={path}>
                <div className={`group relative ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-purple-900/40 to-black/60 hover:from-purple-800/60 hover:to-purple-900/40 border-purple-500/10 hover:border-purple-500/30'
                    : 'bg-gradient-to-br from-purple-100/70 to-white/70 hover:from-purple-200/80 hover:to-purple-300/30 border-purple-300/20 hover:border-purple-400/60'
                } backdrop-blur-sm rounded-2xl p-8 transition duration-500 shadow-lg border overflow-hidden text-center h-48 flex flex-col items-center justify-center`}>
                  <div className={`absolute -right-6 -top-6 w-24 h-24 ${
                    theme === 'dark' ? 'bg-purple-500/10 group-hover:bg-purple-500/20' : 'bg-purple-300/30 group-hover:bg-purple-400/40'
                  } rounded-full blur-xl transition-all`}></div>
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                  <h3 className={`text-xl font-semibold ${
                    theme === 'dark' 
                      ? 'text-white group-hover:text-purple-200' 
                      : 'text-purple-800 group-hover:text-purple-900'
                  } transition-colors`}>{name}</h3>
                  <div className={`absolute w-full h-1 bg-gradient-to-r from-transparent ${
                    theme === 'dark' ? 'via-purple-500' : 'via-purple-400'
                  } to-transparent bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;