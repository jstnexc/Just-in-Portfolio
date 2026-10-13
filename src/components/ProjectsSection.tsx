"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  ArrowUpRight, 
  LayoutGrid, 
  Wrench, 
  Star,
  Gamepad2,
  Play
} from "lucide-react";
import { PROJECTS_DATA, Project } from "@/data/portfolio";
import { FlappyFrostGame } from "@/components/FlappyFrostGame";
import { TimeGuardApp } from "@/components/timeguard/TimeGuardApp";

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Projects");
  const [playingGameId, setPlayingGameId] = useState<string | null>(null);

  const categories = [
    { label: "All Projects", icon: LayoutGrid },
    { label: "Playable Games", icon: Gamepad2 },
    { label: "Tools", icon: Wrench },
  ];

  const filteredProjects =
    selectedCategory === "All Projects"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="relative scroll-mt-20 py-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="relative text-center">
          <p className="font-mono text-[13px] tracking-[0.35em] text-white/70">
            // 02. PROJECTS
          </p>
          <h2 className="font-display mx-auto mt-4 max-w-4xl text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight tracking-tight text-white">
            Projects that solve{" "}
            <span className="text-gradient-tomorrow">real problems.</span>
          </h2>
          <p className="mt-3 text-base text-white/55 sm:text-lg">
            A blend of creativity, technology and purpose.
          </p>

          <span
            aria-hidden="true"
            className="absolute -top-2 right-0 hidden rotate-[8deg] select-none text-right font-mono text-sm italic leading-tight text-violet-400/80 drop-shadow-[0_0_12px_rgba(139,92,246,0.8)] xl:block"
          >
            Ideas<br />
            Code<br />
            Impact
          </span>
        </div>

        {/* Filter Pills */}
        <div
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.label)}
                className={`inline-flex items-center gap-2.5 rounded-full border px-6 py-3 text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "btn-primary-glow border-violet-300/60 bg-violet-600/25 text-white"
                    : "border-white/12 bg-white/[0.03] text-white/65 backdrop-blur-md hover:border-violet-400/40 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border bg-[#0b0620]/70 backdrop-blur-xl transition-all duration-300 border-white/10 hover:border-violet-400/40 hover:shadow-[0_20px_60px_rgba(139,92,246,0.25)]"
            >
              {/* Featured Badge */}
              {project.featured && (
                <span className="glass absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border-violet-300/40 px-3.5 py-1.5 text-xs font-semibold text-violet-100 shadow-[0_0_24px_rgba(139,92,246,0.5)]">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  Featured
                </span>
              )}

              {/* Card Banner / Mock graphic preview */}
              <div 
                onClick={() => {
                  if (project.isPlayable) setPlayingGameId(project.id);
                }}
                className={`relative block aspect-[16/10] overflow-hidden bg-gradient-to-br from-violet-950/80 via-indigo-950/40 to-black/90 p-6 flex flex-col justify-end ${
                  project.isPlayable ? "cursor-pointer group/banner" : ""
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.25),transparent_70%)]"></div>

                {project.isPlayable && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.2),transparent_70%)] opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/60 px-4 py-1.5 text-xs font-semibold text-cyan-200 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover/banner:scale-105 group-hover/banner:border-cyan-300 transition-all">
                      <Play className="h-3.5 w-3.5 fill-current text-cyan-300" />
                      {project.id === "timeguard-system" ? "FUNCTIONAL APP TAB 🛡️" : "PLAYABLE ARCADE DEMO ❄️"}
                    </span>
                  </div>
                )}

                <div className="relative z-10">
                  <span className={`text-[11px] font-mono uppercase tracking-widest ${project.isPlayable ? "text-cyan-300/90" : "text-violet-300/80"}`}>
                    {project.category}
                  </span>
                  <div className="text-xl font-bold font-display text-white mt-1">
                    {project.title}
                  </div>
                </div>

                {project.isPlayable ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingGameId(project.id);
                    }}
                    className="glass absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-cyan-200 transition-all duration-300 group-hover:text-white group-hover:scale-110 group-hover:border-cyan-400/60 cursor-pointer"
                    title={project.id === "timeguard-system" ? "Launch TimeGuard" : "Play Game"}
                  >
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  </button>
                ) : (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="glass absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-all duration-300 group-hover:text-white group-hover:scale-110"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-violet-300/25 bg-violet-500/10 px-3 py-1 text-[11px] font-medium text-violet-200/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-display mt-4 text-[22px] font-bold tracking-tight text-white">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                  {project.description}
                </p>

                {project.metrics && (
                  <div className="mt-4 pt-3 border-t border-white/[0.08] text-xs font-mono text-violet-300/80">
                    {project.metrics}
                  </div>
                )}

                {/* Card Links */}
                <div className="mt-5 flex items-center justify-between">
                  {project.isPlayable ? (
                    <button
                      type="button"
                      onClick={() => setPlayingGameId(project.id)}
                      className="group/link inline-flex items-center gap-2 text-[15px] font-semibold text-cyan-400 transition-colors hover:text-cyan-200 cursor-pointer"
                    >
                      {project.id === "timeguard-system" ? "Launch TimeGuard" : "Play Game"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
                    </button>
                  ) : (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link inline-flex items-center gap-2 text-[15px] font-semibold text-violet-400 transition-colors hover:text-violet-200"
                    >
                      View Project
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
                    </a>
                  )}

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title} source code`}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                      project.isPlayable
                        ? "border-cyan-400/40 text-cyan-200 hover:border-cyan-300 hover:bg-cyan-500/20 hover:text-white hover:shadow-[0_0_24px_rgba(34,211,238,0.5)]"
                        : "border-violet-400/40 text-violet-200 hover:border-violet-300 hover:bg-violet-500/20 hover:text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]"
                    }`}
                  >
                    <ArrowRight className="h-[18px] w-[18px]" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Playable Game Modal */}
      {playingGameId === "flappy-frost-seahorse" && (
        <FlappyFrostGame onClose={() => setPlayingGameId(null)} />
      )}

      {/* TimeGuard Functional Interactive Tab Modal */}
      {playingGameId === "timeguard-system" && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPlayingGameId(null);
          }}
        >
          <div className="relative flex flex-col w-full max-w-6xl h-[92vh] rounded-3xl border border-violet-500/30 bg-[#070414] shadow-[0_0_60px_rgba(139,92,246,0.3)] overflow-hidden">
            <TimeGuardApp onBackToPortfolio={() => setPlayingGameId(null)} />
          </div>
        </div>
      )}
    </section>
  );
};
