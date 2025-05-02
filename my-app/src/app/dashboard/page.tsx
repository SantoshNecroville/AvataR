"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import {
  Inbox,
  Download,
  GalleryHorizontal,
  User,
  AudioLines,
  Moon,
  Sun,
} from "lucide-react";
import TextToAudio from "./TextToAudio";
import FrontPage from "./FrontPage";
import { useAuthStore } from "../user/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Create theme context
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

// Theme provider component
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  // Check for saved theme preference or system preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
const useTheme = () => useContext(ThemeContext);

// Define sidebar items
const sidebarItems = [
  {
    title: "Create Avatar",
    url: "createAvatar",
    icon: User,
    id: "avatar-nav-item",
  },
  {
    title: "Convert Text to Audio",
    url: "textToAudio",
    icon: AudioLines,
    id: "audio-nav-item",
  },
  {
    title: "Demo",
    url: "demo",
    icon: Inbox,
    id: "demo-nav-item",
  },
  {
    title: "Saved Projects",
    url: "savedProjects",
    icon: Download,
    id: "projects-nav-item",
  },
  {
    title: "Gallery",
    url: "gallery",
    icon: GalleryHorizontal,
    id: "gallery-nav-item",
  },
];

function FloatingSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState("createAvatar");
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const {user, checkAuth, isCheckingAuth} = useAuthStore();
  const router = useRouter();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let timeout = null;
    if (expanded) {
      timeout = setTimeout(() => {
        setTextVisible(true);
      }, 200);
    } else {
      setTextVisible(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [expanded]);

  useEffect(() => {
		checkAuth(); // refetch auth status from backend
	}, []);

  useEffect(() => {
    if (!isCheckingAuth && !user) {
      router.replace("/user/login");
    }
  }, [isCheckingAuth, user]);

  if (isCheckingAuth) {
		return (
			<div className="text-center mt-10 font-bold text-purple-500">Checking session...</div>
		);
	}
  if (!user) return null;

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
    <div
      id="main-container"
      className="flex min-h-screen w-full bg-white dark:bg-black transition-colors duration-300"
    >
      {/* Mobile menu button */}
      {isMobile && (
        <button
          id="mobile-menu-button"
          className="fixed top-4 left-4 z-20 bg-purple-800 dark:bg-purple-950 text-white p-2 rounded-lg shadow-lg"
          onClick={toggleSidebar}
        >
          {expanded ? "✕" : "☰"}
        </button>
      )}

      {/* Fixed sidebar with improved transition */}
      <div
        id="sidebar-container"
        className={`
          fixed flex flex-col h-screen shadow-xl transition-all duration-300 ease-out z-10 
          bg-purple-800 dark:bg-purple-950
          ${expanded ? "w-64" : "w-16"}
          ${isMobile && !expanded ? "-translate-x-full" : "translate-x-0"}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          id="sidebar-header"
          className="flex items-center justify-between p-1 border-b border-purple-600 dark:border-purple-800"
        >
          {/* Header section with user and theme toggle */}
          <div className="flex items-center">
            <div className="m-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg text-gray-600 dark:text-gray-300 transition duration-200 cursor-pointer hover:scale-105">
              <User className="w-6 h-6 rounded-lg" />
            </div>
            {expanded && textVisible && (
              <span className="text-2xl font-bold ml-2 cursor-pointer text-white transition-all duration-300 ease-in-out">
                {user.name}
              </span>
            )}
          </div>

          {/* Theme toggle button - only show when expanded */}
          {/* {expanded && textVisible && (
            <button
              onClick={toggleTheme}
              className="mr-2 p-2 rounded-full hover:bg-purple-700 dark:hover:bg-purple-800 text-white transition-colors duration-200"
              title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          )} */}
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
                    ${
                      currentItem === item.url
                        ? "bg-white dark:bg-purple-900 text-purple-800 dark:text-white shadow-lg"
                        : "text-white hover:bg-purple-600 dark:hover:bg-purple-800 hover:text-white"
                    }
                    transform hover:translate-x-1
                  `}
                  title={!expanded ? item.title : ""}
                  id={`${item.id}-link`}
                >
                  <item.icon
                    size={20}
                    className={`
                      ${
                        currentItem === item.url
                          ? "text-purple-800 dark:text-white"
                          : "text-white"
                      }
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

        {/* Theme toggle in footer when collapsed */}
        {!expanded && (
          <div className="p-3 border-t border-purple-600 dark:border-purple-800">
            <button
              onClick={toggleTheme}
              className="w-full flex justify-center p-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 text-white transition-colors duration-200"
              title={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        )}
      </div>

      {/* Main Content with smooth transition */}
      <div
        id="main-content"
        className={`
          flex-1 transition-all duration-300 ease-out
          ${isMobile ? "ml-0 pt-16" : expanded ? "ml-64" : "ml-16"}
        `}
      >
        {currentItem === "textToAudio" && <TextToAudio />}
        {currentItem === "createAvatar" && (
          <FrontPage setCurrentItem={setCurrentItem} />
        )}

        {!["createAvatar", "textToAudio"].includes(currentItem) && (
          <div
            id="coming-soon-container"
            className="flex flex-col items-center justify-center h-full"
          >
            <div
              id="coming-soon-icon"
              className="text-purple-800 dark:text-purple-400 text-5xl mb-4"
            >
              {(() => {
                const IconComponent = sidebarItems.find(
                  (item) => item.url === currentItem
                )?.icon;
                return IconComponent ? <IconComponent size={64} /> : null;
              })()}
            </div>
            <p
              id="coming-soon-text"
              className="text-2xl font-semibold bg-gradient-to-r from-purple-800 to-purple-500 dark:from-purple-500 dark:to-purple-300 bg-clip-text text-transparent"
            >
              Coming Soon:{" "}
              {sidebarItems.find((item) => item.url === currentItem)?.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the component wrapped with ThemeProvider
export default function AppWithTheme() {
  return (
    <ThemeProvider>
      <FloatingSidebar />
    </ThemeProvider>
  );
}
