"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ShadowArmyCanvas } from "@/components/ShadowArmyCanvas";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[#05010f] text-[#f4f2ff]">
      {/* Solo Leveling Roaming Shadow Army Interactive Physics Canvas */}
      <ShadowArmyCanvas />

      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section with Justine Jay Arteche Photo & Info */}
      <HeroSection />

      {/* About Section with Education Track & Work Clears */}
      <AboutSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Skills & Toolbox Section */}
      <SkillsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
