import React from 'react';
import { FaGithub,FaLinkedin } from "react-icons/fa"; // or your icon set

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black/80 text-white px-6 py-5 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        
        <div>&copy; 2025 Avatar AI. All rights reserved.</div>
        
        <div className="flex space-x-6">
          {/* GitHub */}
          <a
            href="https://github.com/SantoshNecroville"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors"
          >
            <FaGithub size={20} />
          </a>
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/santosh-siddartha-manthineedi-0310ba205/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors"
          >
            <FaLinkedin size={20} />
          </a>
          
        </div>
      </div>  
    </footer>
  );
};

export default Footer;
