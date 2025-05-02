"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Heart,
  ImageIcon,
  PenTool,
  Settings,
  MessageCircle,
  LogIn,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import NavDropdown from "./NavDropdown";
import Image from "next/image";
import Link from "next/link";

type MobileNavLinkProps = {
  href: string;
  icon: React.ReactNode;
  text: string;
  isButton?: boolean;
  onClick?: () => void;
};

type NavLinkProps = {
  href: string;
  icon: React.ReactNode;
  text: string;
  activePage: string;
  setActivePage: (page: string) => void;
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle component mount for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Don't render theme toggle until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? "backdrop-blur-lg shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            {/* Placeholder for content while mounting */}
            <div className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 overflow-hidden rounded-lg shadow-lg"></div>
              <h1 className="text-2xl font-light tracking-wider">
                <span className="font-bold">Avatar</span>AI
              </h1>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-lg shadow-lg" : "bg-transparent"
      } ${
        theme === "dark"
          ? "text-white bg-gray-900/80"
          : "text-gray-800 bg-white/80"
      }`}
    >
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 group scale-110">
            <div className="relative w-12 h-12 overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:scale-115 bg-gradient-to-br from-purple-400 to-indigo-500">
              {/* Custom Logo Placeholder */}
              <Link href="/demo">
                <Image
                  src="/ai.png"
                  alt="Company Logo"
                  width={40}
                  height={40}
                  className="mx-auto mt-2"
                  priority
                />
              </Link>
            </div>
            <h1
              className="text-2xl font-light tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 cursor-pointer transition-all duration-500 group-hover:from-purple-500 group-hover:to-indigo-600"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="font-bold">Avatar</span>AI
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavLink
              href="/"
              activePage={activePage}
              setActivePage={setActivePage}
              icon={<Home size={16} />}
              text="Home"
            />
            <NavDropdown />

            {/* Theme Toggle Button */}
            <button
              className={`p-2.5 rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button className="bg-gradient-to-r cursor-pointer from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-600 text-white px-5 py-2 rounded-full font-medium shadow-md flex items-center space-x-2 transition-all duration-300 hover:shadow-lg">
              <LogIn size={16} />
              <Link href="/">
                <span>Get Started</span>
              </Link>
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

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 animate-fadeIn">
            <div
              className={`flex flex-col space-y-3 rounded-xl p-4 shadow-lg justify-center ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <MobileNavLink href="/" icon={<Home size={16} />} text="Home" />
              <MobileNavLink
                href="/gallery"
                icon={<ImageIcon size={16} />}
                text="Gallery"
              />
              <MobileNavLink
                href="dashboard"
                icon={<PenTool size={16} />}
                text="Create"
              />
              <MobileNavLink
                href="settings/privacy"
                icon={<Settings size={16} />}
                text="Settings"
              />
              <MobileNavLink
                href="#"
                icon={<LogIn size={16} />}
                text="Sign Up"
                isButton={true}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({
  href,
  icon,
  text,
  activePage,
  setActivePage,
}: NavLinkProps) => (
  <a
    href={href}
    onClick={() => setActivePage(text)}
    className="flex items-center space-x-3 text-black dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-medium transition-colors px-3 py-2 rounded-full backdrop-blur-sm hover:shadow-sm group"
  >
    <span className="text-purple-400 group-hover:text-indigo-500 transition-colors">
      {icon}
    </span>
    <span className="relative">
      {text}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-300 to-indigo-400 transition-all duration-300 ease-in-out ${
          activePage === text ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
    </span>
  </a>
);

const MobileNavLink = ({
  href,
  icon,
  text,
  isButton,
  onClick,
}: MobileNavLinkProps) => (
  <a
    href={href}
    onClick={onClick}
    className={`flex items-center space-x-3 font-medium transition-colors p-3 rounded-full
          ${
            isButton
              ? "bg-gradient-to-r from-purple-300 to-indigo-400 hover:from-purple-400 hover:to-indigo-500 text-white justify-center shadow-md"
              : "text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-white/70 dark:hover:bg-gray-700/70 backdrop-blur-sm"
          }`}
  >
    <span className={isButton ? "text-white" : "text-purple-400"}>{icon}</span>
    <span>{text}</span>
  </a>
);

export default Navbar;
