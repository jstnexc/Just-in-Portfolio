"use client";

import React, { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { PROFILE_INFO } from "@/data/portfolio";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-[#05010f]/80 backdrop-blur-md border-b border-white/[0.06]">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white font-display font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            JA
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-white">
            {PROFILE_INFO.name}
          </span>
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-9 lg:flex">
          <li>
            <a
              href="#top"
              className="group relative text-[15px] transition-colors font-medium text-violet-300"
            >
              Home
              <span className="absolute -bottom-2 left-0 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-300 w-full shadow-[0_0_12px_rgba(139,92,246,0.9)]"></span>
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="group relative text-[15px] transition-colors text-white/70 hover:text-white"
            >
              About
              <span className="absolute -bottom-2 left-0 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-300 w-0 group-hover:w-full"></span>
            </a>
          </li>
          <li>
            <a
              href="#projects"
              className="group relative text-[15px] transition-colors text-white/70 hover:text-white"
            >
              Projects
              <span className="absolute -bottom-2 left-0 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-300 w-0 group-hover:w-full"></span>
            </a>
          </li>
          <li>
            <a
              href="#skills"
              className="group relative text-[15px] transition-colors text-white/70 hover:text-white"
            >
              Skills
              <span className="absolute -bottom-2 left-0 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-300 w-0 group-hover:w-full"></span>
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="group relative text-[15px] transition-colors text-white/70 hover:text-white"
            >
              Contact
              <span className="absolute -bottom-2 left-0 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-300 w-0 group-hover:w-full"></span>
            </a>
          </li>
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <a
            href={`mailto:${PROFILE_INFO.email}`}
            className="group btn-primary-glow shimmer-sweep inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-600/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-violet-300/70 hover:bg-violet-600/25"
          >
            Let's Connect
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          className="glass flex h-11 w-11 items-center justify-center rounded-xl text-white lg:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#070214]/95 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-3">
            <a
              href="#top"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-violet-300"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-white/75 hover:text-white"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-white/75 hover:text-white"
            >
              Projects
            </a>
            <a
              href="#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-white/75 hover:text-white"
            >
              Skills
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-white/75 hover:text-white"
            >
              Contact
            </a>
            <a
              href={`mailto:${PROFILE_INFO.email}`}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/40 bg-violet-600/20 py-2.5 text-sm font-medium text-white"
            >
              Let's Connect
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
