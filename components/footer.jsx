import React from "react";
import Link from "next/link";

const Facebook = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
};

const Github = ({ className, ...rest }) => {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} {...rest}>
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38
  0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
  -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
  .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
  0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82
  .64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82
  .44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15
  0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
  0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8
  c0-4.42-3.58-8-8-8z"/>
    </svg>
  );
};

const Instagram = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white py-12 border-t border-[#27272A]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Logo and Tagline */}
        <div className="text-center md:text-left">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-widest mb-2">NEXUS</h2>
          <p className="text-gray-400 text-sm">Where connections come to life.</p>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 font-heading text-lg uppercase tracking-wider text-gray-300">
          <Link href="/explore" className="hover:text-[#CCFF00] transition-colors">Browse</Link>
          <Link href="/create-event" className="hover:text-[#CCFF00] transition-colors">Create</Link>
          <Link href="/about" className="hover:text-[#CCFF00] transition-colors">About</Link>
        </div>

        {/* Socials & Credits */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-5 items-center">
            <a
              href="https://github.com/Asif259"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#CCFF00] transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/ashraful.asif260/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#CCFF00] transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/ashraful.asif260/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#CCFF00] transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <div className="text-sm text-gray-400 font-mono tracking-wider">
            Made by <Link href="https://ashrafulasif.vercel.app/" target="_blank" className="text-white hover:text-[#CCFF00] transition-colors">Ashraful Asif</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;