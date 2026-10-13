"use client";

import React from "react";
import { 
  GraduationCap, 
  MapPin, 
  CalendarDays, 
  Sparkles, 
  Brain, 
  CodeXml, 
  Target, 
  Cpu, 
  Rocket, 
  Boxes,
  Briefcase,
  CheckCircle2,
  Phone,
  Mail
} from "lucide-react";
import { PROFILE_INFO, WORK_EXPERIENCE, EDUCATION_TIMELINE } from "@/data/portfolio";

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative scroll-mt-20 py-24 sm:py-32 border-t border-white/[0.06]">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-5 sm:px-8">
        <div className="grid flex-1 items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: About Details & Education */}
          <div className="min-w-0">
            <p className="font-mono text-[13px] tracking-[0.35em] text-white/70">
              // 01. ABOUT ME & BACKGROUND
            </p>
            <h2 className="font-display mt-5 text-[clamp(2.3rem,4.5vw,3.6rem)] font-extrabold leading-[1.1] tracking-tight text-white">
              Disciplined mind.<br className="hidden sm:inline" /> Relentless{" "}
              <span className="text-gradient-tomorrow">adaptability.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              I'm <span className="text-white font-semibold">{PROFILE_INFO.fullName}</span>, 19 years old, from {PROFILE_INFO.location}. Pursuing a Bachelor of Science in Computer Engineering at {PROFILE_INFO.school}. My background blends hard-working real-world service discipline, fast learning capabilities, and passion for software & digital systems.
            </p>

            {/* 3 Quick Facts Cards from Resume */}
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              <div className="glass rounded-2xl px-4 py-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/85">
                  <GraduationCap className="h-[18px] w-[18px]" />
                </span>
                <p className="mt-3 text-[14px] font-bold leading-tight text-white">
                  {PROFILE_INFO.education}
                </p>
                <p className="mt-1 text-xs leading-snug text-white/50">
                  {PROFILE_INFO.school}
                </p>
              </div>

              <div className="glass rounded-2xl px-4 py-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/85">
                  <MapPin className="h-[18px] w-[18px]" />
                </span>
                <p className="mt-3 text-[14px] font-bold leading-tight text-white">
                  San Juan City
                </p>
                <p className="mt-1 text-xs leading-snug text-white/50">
                  #89 2nd West Crame
                </p>
              </div>

              <div className="glass rounded-2xl px-4 py-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/85">
                  <CalendarDays className="h-[18px] w-[18px]" />
                </span>
                <p className="mt-3 text-[14px] font-bold leading-tight text-white">
                  19 Years Old
                </p>
                <p className="mt-1 text-xs leading-snug text-white/50">
                  Born April 17, 2005
                </p>
              </div>
            </div>

            {/* Work Experience Clears */}
            <div className="mt-10 space-y-4">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-cyan-400" />
                Work Experience & Operational Discipline
              </h3>

              <div className="space-y-3">
                {WORK_EXPERIENCE.map((exp, idx) => (
                  <div
                    key={idx}
                    className="glass rounded-2xl p-4 border border-white/10 hover:border-violet-400/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-white text-sm">
                        {exp.role} <span className="text-violet-300">@ {exp.company}</span>
                      </span>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-violet-500/10 text-cyan-300 border border-violet-400/25">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="mt-2.5 space-y-1">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-xs text-white/65 flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Handwritten Quote */}
            <figure className="mt-9">
              <blockquote className="font-hand text-[28px] leading-tight text-white lg:text-[32px]">
                {PROFILE_INFO.quoteAbout}
              </blockquote>
            </figure>
          </div>

          {/* Right: Skills & Core Competencies Card */}
          <div className="space-y-6">
            <div className="glass w-full rounded-3xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] border border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white font-display">
                  Core Character & Skills
                </h3>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 shadow-[0_0_16px_rgba(139,92,246,0.3)]">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>

              {/* Skills from resume */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 font-mono text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Fast Learner
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  High Adaptability
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Creative Thinker
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Strong Teamwork
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Communication
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Organizational Precision
                </div>
                <div className="col-span-2 p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-between text-cyan-300 font-bold">
                  <span>Computer Engineering Systems</span>
                  <span className="text-[10px] bg-cyan-400/10 px-2 py-0.5 rounded text-cyan-400">MAX</span>
                </div>
              </div>
            </div>

            {/* Education Track */}
            <div className="glass w-full rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-violet-400" />
                Educational Milestones
              </h3>

              <div className="space-y-3 font-mono text-xs">
                {EDUCATION_TIMELINE.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <div className="flex justify-between text-white font-bold">
                      <span>{item.level}</span>
                      <span className="text-cyan-400">{item.period}</span>
                    </div>
                    <div className="text-violet-300 mt-0.5">{item.course}</div>
                    <div className="text-white/50 text-[11px] mt-0.5">{item.institution}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
