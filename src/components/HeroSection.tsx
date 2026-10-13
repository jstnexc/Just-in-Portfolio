"use client";

import React from "react";
import { ArrowRight, Download, MapPin, Mail, Phone, CodeXml, Sparkles, Terminal } from "lucide-react";
import { PROFILE_INFO } from "@/data/portfolio";

export const HeroSection: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background Ambience & Gradient Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[140px]"></div>
        <div className="absolute right-10 top-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))]"></div>
      </div>

      <section
        id="top"
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-24 pt-[130px] sm:px-8 lg:pb-24"
      >
        <div className="w-full">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left Content */}
            <div>
              <div className="max-w-2xl">
                {/* Eyebrow */}
                <p className="mb-3 font-mono text-[13px] tracking-[0.35em] text-violet-300/90 flex items-center">
                  <span>// WELCOME TO MY CORNER</span>
                  <span className="ml-1 inline-block h-4 w-[2px] translate-y-[1px] bg-cyan-400 animate-pulse"></span>
                </p>

                {/* Display Names */}
                <div>
                  <h1 className="font-display text-gradient-name cursor-default text-[clamp(3.2rem,8vw,5.6rem)] font-extrabold leading-[0.95] tracking-tight">
                    {PROFILE_INFO.fullName}
                  </h1>
                  <h2 className="font-display mt-3 text-[clamp(1.5rem,3.8vw,2.4rem)] font-bold leading-[1.1] tracking-tight text-white">
                    Computer Engineering & <br />
                    Web Solutions for a <span className="text-gradient-tomorrow">better tomorrow.</span>
                  </h2>
                </div>

                {/* Bio text */}
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-base">
                  {PROFILE_INFO.careerObjective}
                </p>

                {/* CTAs */}
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <a
                    href="#projects"
                    className="btn-primary-glow shimmer-sweep group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-500 px-7 py-3.5 text-[15px] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    View My Work
                    <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1.5" />
                  </a>

                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/[0.03] px-7 py-3.5 text-[15px] font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/60 hover:bg-violet-500/10 hover:text-white hover:shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
                  >
                    <Mail className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-y-0.5" />
                    Get In Touch
                  </a>
                </div>

                {/* Direct info chips */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${PROFILE_INFO.phone}`}
                    className="glass flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-white/80 hover:text-white hover:border-violet-400/50 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{PROFILE_INFO.phone}</span>
                  </a>

                  <a
                    href={`mailto:${PROFILE_INFO.email}`}
                    className="glass flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-white/80 hover:text-white hover:border-violet-400/50 transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-violet-400" />
                    <span>{PROFILE_INFO.email}</span>
                  </a>

                  <a
                    href={PROFILE_INFO.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="glass flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-white/80 hover:text-white hover:border-violet-400/50 transition-colors"
                  >
                    <span className="font-bold text-[#4ea1f3] text-[11px]">IN</span>
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={PROFILE_INFO.github}
                    target="_blank"
                    rel="noreferrer"
                    className="glass flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono text-white/80 hover:text-white hover:border-violet-400/50 transition-colors"
                  >
                    <span className="font-bold text-white text-[11px]">GH</span>
                    <span>jstnexc</span>
                  </a>

                  <span className="flex items-center gap-2 px-3 py-2 text-xs text-white/70">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                    </span>
                    Open to opportunities
                  </span>
                </div>

                {/* Location indicator */}
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/50 font-mono">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-violet-400" />
                    {PROFILE_INFO.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Aakash-style Floating Mindset & Engineering Terminal Card */}
            <div className="hidden lg:block" aria-hidden="true">
              <div className="animate-float-slow glass ml-auto max-w-[280px] rounded-2xl border-violet-400/25 p-[1px]">
                <div className="rounded-2xl bg-[#0a0618]/70 px-6 py-5 shadow-[0_0_40px_rgba(139,92,246,0.25)] space-y-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-violet-300/70 flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                      // mindset
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">
                      Build <span className="text-violet-300">·</span> Learn{" "}
                      <span className="text-violet-300">·</span> Adapt{" "}
                      <span className="text-violet-300">·</span> Expand
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-white/60">
                      <span>DISCIPLINE</span>
                      <span className="text-violet-300">BS CpE</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>STATUS</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        AVAILABLE
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-400/20 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>Shadow Army Domain Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
