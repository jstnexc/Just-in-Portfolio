"use client";

import React, { useState } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { SKILLS_DATA, SkillItem } from "@/data/portfolio";

export const SkillsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const categories = [
    "All",
    "Programming",
    "Frontend",
    "Backend",
    "API",
    "Databases",
    "Developer Tools"
  ];

  const filteredSkills =
    activeFilter === "All"
      ? SKILLS_DATA
      : SKILLS_DATA.filter((s) => s.category === activeFilter);

  return (
    <section id="skills" className="relative scroll-mt-20 py-24 border-t border-white/[0.06] bg-[#05010f]/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3.5 py-1 text-[13px] font-medium text-violet-200">
            <Zap className="h-3.5 w-3.5 fill-violet-400 text-violet-400" />
            My Toolbox
          </span>
          <h2 className="font-display mx-auto mt-3 max-w-4xl text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight text-white">
            Skills that build <span className="text-gradient-tomorrow">possibilities</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/55 sm:text-base">
            A curated set of technologies, tools and skills I use to turn ideas into reality.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isSelected = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "btn-primary-glow border-violet-300/60 bg-gradient-to-r from-violet-600 to-indigo-500 text-white"
                    : "border-white/12 bg-white/[0.03] text-white/65 backdrop-blur-md hover:border-violet-400/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Count Note */}
        <p className="mt-4 text-center text-xs text-white/60">
          Showing {filteredSkills.length} of {SKILLS_DATA.length} skills — select a category to explore everything.
        </p>

        {/* Skills Cards Grid */}
        <div className="mt-8 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="group relative flex min-w-0 flex-col rounded-2xl border border-white/10 bg-[#0b0620]/70 p-4 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/40 hover:shadow-[0_16px_50px_rgba(139,92,246,0.22)]"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ color: skill.color }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] font-mono text-xs font-bold transition-colors duration-300 group-hover:bg-white/[0.08]"
                >
                  {skill.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="font-mono text-xs text-white/60">
                  {skill.percentage}%
                </span>
              </div>

              <div className="mt-3 flex items-start justify-between gap-2">
                <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-white">
                  {skill.name}
                </span>
              </div>

              {/* Progress bar */}
              <span className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-violet-500 via-violet-400 to-indigo-400 shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-500"
                  style={{ width: `${skill.percentage}%` }}
                ></span>
              </span>

              <span className="mt-2 block text-[11px] text-white/50">
                {skill.category}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12">
          <a
            href="#projects"
            className="group relative flex min-w-0 items-center justify-between gap-4 overflow-hidden rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-600/25 via-[#0b0620]/80 to-indigo-600/20 p-5 backdrop-blur-xl transition-all hover:border-violet-300/60 hover:shadow-[0_20px_60px_rgba(139,92,246,0.35)]"
          >
            <span className="font-hand text-[28px] font-semibold leading-[1.05] text-violet-300">
              Better<br />
              Projects<br />
              Ahead...
            </span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-violet-300/50 text-white transition-all duration-300 group-hover:bg-violet-500/25 group-hover:shadow-[0_0_24px_rgba(139,92,246,0.6)]">
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
