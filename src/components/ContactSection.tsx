"use client";

import React, { useState } from "react";
import { Mail, ArrowUpRight, MapPin, Send, ArrowRight, RadioTower, CheckCircle2, Phone } from "lucide-react";
import { PROFILE_INFO } from "@/data/portfolio";

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Job Opportunity",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative scroll-mt-20 py-24 border-t border-white/[0.06]">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-y-12 lg:flex-row lg:items-start lg:justify-between lg:gap-x-12">
          {/* Left Column */}
          <div className="min-w-0 lg:w-[45%]">
            <p className="font-mono text-[13px] tracking-[0.35em] text-white/70">
              // 04. CONTACT & TRANSMISSION
            </p>
            <h2 className="font-display mt-6 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              Let's Build<br />
              Something<br />
              Amazing <span className="text-gradient-tomorrow">Together.</span>
            </h2>
            <p className="mt-4 max-w-[480px] text-[16px] leading-relaxed text-white/75">
              Available for junior web developer roles, technical apprenticeships, electronics/IoT integrations, and collaborative engineering projects.
            </p>

            {/* Contact Cards Grid with verified resume details */}
            <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <a
                href={`mailto:${PROFILE_INFO.email}`}
                className="group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-md transition-all duration-300 hover:border-violet-400/45 hover:bg-violet-500/10 shadow-[0_0_30px_rgba(124,58,237,0.22)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                  <Mail className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block pr-6 text-[14px] font-bold text-white">
                    Email
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-white/55">
                    {PROFILE_INFO.email}
                  </span>
                </span>
                <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-200" />
              </a>

              <a
                href={`tel:${PROFILE_INFO.phone}`}
                className="group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-md transition-all duration-300 hover:border-violet-400/45 hover:bg-violet-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                  <Phone className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block pr-6 text-[14px] font-bold text-white">
                    Phone / Mobile
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-white/55">
                    {PROFILE_INFO.phone}
                  </span>
                </span>
                <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-200" />
              </a>

              <a
                href={PROFILE_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-md transition-all duration-300 hover:border-violet-400/45 hover:bg-violet-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-mono font-bold text-xs">
                  in
                </span>
                <span className="min-w-0">
                  <span className="block pr-6 text-[14px] font-bold text-white">
                    LinkedIn
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-white/55">
                    justine-jay-arteche
                  </span>
                </span>
                <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-white/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-200" />
              </a>

              <div className="group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 backdrop-blur-md shadow-[0_0_30px_rgba(124,58,237,0.22)]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                  <MapPin className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold text-white">
                    Location & Residence
                  </span>
                  <span className="mt-0.5 block text-[12px] text-white/65">
                    {PROFILE_INFO.address}
                  </span>
                </span>
              </div>
            </div>

            {/* Handwritten Quote */}
            <figure className="mt-9">
              <blockquote className="font-hand text-[28px] leading-tight text-white sm:text-[32px]">
                {PROFILE_INFO.quoteFooter}
              </blockquote>
              <footer className="mt-2 font-mono text-[11px] tracking-[0.3em] text-white/55">
                — {PROFILE_INFO.fullName.toUpperCase()}
              </footer>
            </figure>
          </div>

          {/* Right Column: Transmission Form */}
          <div className="min-w-0 lg:w-[50%]">
            <div className="w-full rounded-3xl border border-violet-300/15 bg-[#0a051c]/75 p-6 shadow-[0_0_70px_-15px_rgba(139,92,246,0.4)] backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300 shadow-[0_0_16px_rgba(139,92,246,0.4)]">
                  <RadioTower className="h-3.5 w-3.5" />
                </span>
                <span className="font-mono text-[11.5px] tracking-[0.3em] text-white/70">
                  SEND A MESSAGE
                </span>
              </div>

              <h3 className="font-display mt-3 text-[clamp(1.85rem,2.6vw,2.6rem)] font-extrabold leading-tight tracking-tight text-white">
                I'm all <span className="text-gradient-tomorrow">ears!</span>
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/60">
                Fill out the form below and I'll get back to you directly at {PROFILE_INFO.email}.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-violet-500/20 border border-violet-400 flex items-center justify-center text-violet-300 shadow-[0_0_24px_rgba(139,92,246,0.5)]">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-white">
                    Message Dispatched!
                  </h4>
                  <p className="text-xs text-white/60 max-w-sm mx-auto font-mono">
                    Thank you for reaching out. Justine Jay Arteche will respond promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "Job Opportunity", message: "" });
                    }}
                    className="mt-4 px-4 py-2 text-xs font-mono text-violet-300 border border-violet-500/40 rounded-full hover:bg-violet-900/40 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[13.5px] font-medium text-white/75">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hiring Manager"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-[14px] text-white placeholder:text-white/35 outline-none transition focus:border-violet-400/60 focus:bg-black/55 focus:ring-1 focus:ring-violet-400/30"
                      />
                    </div>
                    <div>
                      <label className="block text-[13.5px] font-medium text-white/75">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="company@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-[14px] text-white placeholder:text-white/35 outline-none transition focus:border-violet-400/60 focus:bg-black/55 focus:ring-1 focus:ring-violet-400/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-medium text-white/75">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-[14px] text-white outline-none transition focus:border-violet-400/60 focus:bg-black/55 focus:ring-1 focus:ring-violet-400/30"
                    >
                      <option value="Job Opportunity" className="bg-[#0a051c] text-white">Job Opportunity</option>
                      <option value="Project Collaboration" className="bg-[#0a051c] text-white">Project Collaboration</option>
                      <option value="Technical Interview" className="bg-[#0a051c] text-white">Technical Interview</option>
                      <option value="General Question" className="bg-[#0a051c] text-white">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13.5px] font-medium text-white/75">
                      Message
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Detail your requirements, project scope, or opportunity..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white placeholder:text-white/35 outline-none transition focus:border-violet-400/60 focus:bg-black/55 focus:ring-1 focus:ring-violet-400/30 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 flex h-11 w-full items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-[15px] font-semibold text-white shadow-[0_0_30px_rgba(109,80,246,0.45)] transition-all duration-300 hover:brightness-110 active:scale-[0.99] cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
