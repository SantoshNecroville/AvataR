"use client"
import React, { useState, useEffect } from "react";
import {
  Inbox,
  Download,
  GalleryHorizontal,
  User,
  AudioLines
} from "lucide-react";
import TextToAudio from "./TextToAudio";
import FrontPage from "./FrontPage"

// Define sidebar items
const sidebarItems = [
  {
    title: "Create Avatar",
    url: "createAvatar",
    icon: User,
    id: "avatar-nav-item"
  },
  {
    title: "Convert Text to Audio",
    url: "textToAudio",
    icon: AudioLines,
    id: "audio-nav-item"
  },
  {
    title: "Demo",
    url: "demo",
    icon: Inbox,
    id: "demo-nav-item"
  },
  {
    title: "Saved Projects",
    url: "savedProjects",
    icon: Download,
    id: "projects-nav-item"
  },
  {
    title: "Gallery",
    url: "gallery",
    icon: GalleryHorizontal,
    id: "gallery-nav-item"
  },
];

export default function FloatingSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState("createAvatar");
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Set up event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle delayed text visibility
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (expanded) {
      timeout = setTimeout(() => {
        setTextVisible(true);
      }, 200); // Delay text appearance by 200ms after sidebar expansion
    } else {
      setTextVisible(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [expanded]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setExpanded(false);
    }
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div id="main-container" className="flex min-h-screen w-full bg-white">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          id="mobile-menu-button"
          className="fixed top-4 left-4 z-20 bg-purple-800 text-white p-2 rounded-lg shadow-lg"
          onClick={toggleSidebar}
        >
          {expanded ? "✕" : "☰"}
        </button>
      )}

      {/* Fixed sidebar with improved transition */}

      <div
        id="sidebar-container"
        className={`
          fixed flex flex-col h-screen shadow-xl transition-all duration-300 ease-out z-10 bg-purple-800
          ${expanded ? 'w-64' : 'w-16'}
          ${isMobile && !expanded ? '-translate-x-full' : 'translate-x-0'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div id="sidebar-navigation" className="flex items-center p-1 border-b border-purple-600">
          {/* Header section - empty */}
          <div className="m-2 bg-white rounded-full p-2 shadow-lg text-gray-600 transition duration-200 cursor-pointer hover:scale-105">
            <User className="w-6 h-6 rounded-lg" />
          </div>
          {expanded && textVisible && (
            <span
              className="text-2xl font-bold ml-2 cursor-pointer text-white transition-all duration-300 ease-in-out"
            >
              Username
            </span>
          )}
        </div>

        <div id="sidebar-navigation" className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-3 px-2">
            {sidebarItems.map((item, index) => (
              <li key={index} id={item.id}>
                <a
                  href="#"
                  onClick={() => {
                    setCurrentItem(item.url);
                    if (isMobile) setExpanded(false);
                  }}
                  className={`
                    flex items-center rounded-lg p-3 transition-all duration-200 ease-in-out
                    ${currentItem === item.url
                      ? 'bg-white text-purple-800 shadow-lg'
                      : 'text-white hover:bg-purple-600 hover:text-white'}
                    transform hover:translate-x-1
                  `}
                  title={!expanded ? item.title : ""}
                  id={`${item.id}-link`}
                >
                  <item.icon
                    size={20}
                    className={`
                      ${currentItem === item.url ? "text-purple-800" : "text-white"}
                      transition-colors duration-300
                    `}
                    id={`${item.id}-icon`}
                  />

                  {expanded && textVisible && (
                    <span
                      className="ml-3 transition-all duration-300 ease-in-out"
                      id={`${item.id}-text`}
                    >
                      {item.title}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* <div id="sidebar-footer" className="p-4 border-t border-purple-600">
          {expanded && textVisible && (
            <div 
              id="version-info"
              className="text-xs text-center text-white transition-opacity duration-300 ease-in-out"
            >
              v1.0.0
            </div>
          )}
        </div> */}
      </div>

      {/* Main Content with smooth transition */}
      <div
        id="main-content"
        className={`
          flex-1 transition-all duration-300 ease-out
          ${isMobile ? 'ml-0 p-4 pt-16' : expanded ? 'ml-64 p-6' : 'ml-16 p-6'}
        `}
      >
        {currentItem === "textToAudio" && <TextToAudio />}
        {currentItem === "createAvatar" && <FrontPage setCurrentItem={setCurrentItem} />}

        {!["createAvatar", "textToAudio"].includes(currentItem) && (
          <div id="coming-soon-container" className="flex flex-col items-center justify-center h-full">
            <div id="coming-soon-icon" className="text-purple-800 text-5xl mb-4">
              {(() => {
                const IconComponent = sidebarItems.find(item => item.url === currentItem)?.icon;
                return IconComponent ? <IconComponent size={64} /> : null;
              })()}
            </div>
            <p id="coming-soon-text" className="text-2xl font-semibold bg-gradient-to-r from-purple-800 to-purple-500 bg-clip-text text-transparent">
              Coming Soon: {sidebarItems.find(item => item.url === currentItem)?.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}