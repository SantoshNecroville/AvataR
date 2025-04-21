"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import {
  ImageIcon, PenTool, Settings, ChevronDown, Sparkles,
  Camera, UserPlus, Palette, Sliders, Shield, CloudCog
} from 'lucide-react';

type SubItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

type ItemType = {
  id: string;
  title: string;
  icon: React.ReactNode;
  image: string;
  description: string;
  items: SubItem[];
};

const NavDropdown = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const dropdownItems: ItemType[] = [
    {
      id: 'gallery',
      title: 'Gallery',
      icon: <ImageIcon size={18} />,
      image: "/",
      description: "Explore and curate your personal reflections",
      items: [
        { icon: <Camera size={16} />, title: "Your Collection", description: "View your saved persona reflections" },
        { icon: <Sparkles size={16} />, title: "Featured Mirrors", description: "Discover trending reflections" },
        { icon: <UserPlus size={16} />, title: "Shared With You", description: "Reflections shared by connections" }
      ]
    },
    {
      id: 'dashboard',
      title: 'Create',
      icon: <PenTool size={18} />,
      image: "/createAvatar.avif",
      description: "Express your authentic digital self",
      items: [
        { icon: <Palette size={16} />, title: "Create Avatar", description: "Create avatar video using image" },
        { icon: <Camera size={16} />, title: "Text To Speech", description: "transform your text into speech" },
        // { icon: <Sparkles size={16} />, title: "Emotion Templates", description: "Start with feeling-based presets" }
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings size={18} />,
      image: "/",
      description: "Personalize your mirror experience",
      items: [
        { icon: <Sliders size={16} />, title: "Preferences", description: "Customize your reflection settings" },
        { icon: <Shield size={16} />, title: "Privacy", description: "Control your digital boundaries" },
        // { icon: <CloudCog size={16} />, title: "Mirror Sync", description: "Manage your persona across devices" }
      ]
    }
  ];

  const handleMouseEnter = (id: string) => setActiveDropdown(id);
  const handleMouseLeave = () => setActiveDropdown(null);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="hidden md:flex items-center space-x-6">
      {dropdownItems.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <button className="flex items-center space-x-3 text-gray-500 dark:text-gray-300 hover:text-gray-200 dark:hover:text-white cursor-pointer font-medium transition-colors px-3 py-2 rounded-full backdrop-blur-sm hover:shadow-sm group">
            <span className="text-purple-400 group-hover:text-indigo-500 transition-colors">{item.icon}</span>
            <span className="relative">
              {item.title}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-300 to-indigo-400 group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
          </button>

          {activeDropdown === item.id && (
            <div className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden transition-all duration-300 z-50 border border-purple-100 dark:border-gray-700`}>
              <div className="p-4">
                <div className="relative rounded-lg overflow-hidden mb-4 shadow-md">
                  <div className="h-50 relative w-full">
                    <Image
                      src={item.image}
                      alt="Background"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <p className="text-sm opacity-90">{item.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {item.items.map((subItem, index) => (
                    <a
                      key={index}
                      href={`/${item.id}Avatar`}
                      onClick={() => console.log(item.id)}
                      className="flex items-start p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="mr-3 text-purple-400 group-hover:text-indigo-500 transition-colors mt-0.5">
                        {subItem.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 transition-colors">
                          {subItem.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{subItem.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-t border-purple-100 dark:border-gray-700">
                <a
                  href="#"
                  className="text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center"
                >
                  <span>View all {item.title.toLowerCase()} options →</span>
                  
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavDropdown;
