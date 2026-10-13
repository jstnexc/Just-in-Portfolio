"use client";

import React from "react";
import { Sparkle, ArrowUpRight, ArrowRight, Heart } from "lucide-react";
import { PROFILE_INFO } from "@/data/portfolio";

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#03010a]">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 bottom-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-8 pt-16 sm:px-8 lg:px-10">
        {/* Banner */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 font-mono text-[11px] tracking-[0.32em] text-white/70 backdrop-blur-md">
            // END OF THE JOURNEY
          </span>
          <h2 className="font-display mt-6 text-[clamp(2.4rem,3.6vw,3.4rem)] font-extrabold leading-[1.1] tracking-tight text-white">
            Thanks for <span className="text-gradient-tomorrow">Visiting!</span>
          </h2>
          <p className="mt-4 max-w-[580px] text-[16.5px] leading-relaxed text-white/70">
            Let's build something amazing together. Stay curious, keep building, and I'll see you around the internet!
          </p>

          <div className="mt-8 flex w-full max-w-[620px] items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/25"></span>
            <Sparkle className="h-4 w-4 shrink-0 fill-violet-400 text-violet-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/25"></span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.15fr] lg:gap-x-10">
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 font-display font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]">
                JA
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight text-white">
                {PROFILE_INFO.name}
              </span>
            </div>
            <p className="mt-3.5 max-w-[290px] text-[15px] leading-relaxed text-white/60">
              Building ideas into reality through code, creativity, and curiosity.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={PROFILE_INFO.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-md transition-all duration-300 hover:border-violet-400/50 hover:bg-violet-500/12 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] font-mono text-sm font-bold text-white"
              >
                GH
              </a>
              <a
                href={PROFILE_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-md transition-all duration-300 hover:border-violet-400/50 hover:bg-violet-500/12 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] font-mono text-sm font-bold text-[#4ea1f3]"
              >
                IN
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:border-l lg:border-white/10 lg:pl-10">
            <h4 className="font-display text-[17px] font-semibold text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="#top" className="group flex items-center justify-between text-[15px] text-white/65 hover:text-white">
                  <span>Home</span>
                  <ArrowUpRight className="h-4 w-4 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a href="#about" className="group flex items-center justify-between text-[15px] text-white/65 hover:text-white">
                  <span>About</span>
                  <ArrowUpRight className="h-4 w-4 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a href="#projects" className="group flex items-center justify-between text-[15px] text-white/65 hover:text-white">
                  <span>Projects</span>
                  <ArrowUpRight className="h-4 w-4 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a href="#skills" className="group flex items-center justify-between text-[15px] text-white/65 hover:text-white">
                  <span>Skills</span>
                  <ArrowUpRight className="h-4 w-4 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a href="#contact" className="group flex items-center justify-between text-[15px] text-white/65 hover:text-white">
                  <span>Contact</span>
                  <ArrowUpRight className="h-4 w-4 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Social & External */}
          <div className="lg:border-l lg:border-white/10 lg:pl-10">
            <h4 className="font-display text-[17px] font-semibold text-white">
              Other Places
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={PROFILE_INFO.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between text-[15px] text-white/65 hover:text-white"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="h-4 w-4 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href={PROFILE_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between text-[15px] text-white/65 hover:text-white"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-4 w-4 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect CTA */}
          <div className="lg:border-l lg:border-white/10 lg:pl-10">
            <h4 className="font-display text-[17px] font-semibold text-white">
              Let's Connect
            </h4>
            <p className="mt-3 max-w-[280px] text-[15px] leading-relaxed text-white/60">
              Open to collaborations, engineering teams, and exciting opportunities.
            </p>
            <a
              href={`mailto:${PROFILE_INFO.email}`}
              className="group mt-5 inline-flex h-12 items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-6 text-[15px] font-semibold text-white shadow-[0_0_30px_rgba(109,80,246,0.45)] transition-all duration-300 hover:brightness-110 active:scale-[0.99]"
            >
              Email Me Directly
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div className="mt-12 flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-[#0a051c]/70 px-5 py-4 backdrop-blur-md sm:flex-row sm:justify-between">
          <p className="text-center text-[13.5px] text-white/55 sm:text-left">
            © 2026 {PROFILE_INFO.fullName}. All rights reserved.
          </p>

          <div className="hidden items-center gap-2 font-mono text-[11.5px] tracking-[0.28em] text-white/60 md:flex">
            <span>IDEAS <span className="text-white/30">✕</span> CODE <span className="text-white/30">✕</span> IMPACT</span>
          </div>

          <p className="flex items-center gap-1.5 text-center text-[13.5px] text-white/55">
            Made with <Heart className="h-3.5 w-3.5 fill-[#ff5c8a] text-[#ff5c8a]" /> in Philippines
          </p>
        </div>
      </div>
    </footer>
  );
};
