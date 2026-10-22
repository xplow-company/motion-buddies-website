"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Tv,
  Move,
  CheckCircle2,
  Mail,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>("3D Product Launch");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const capabilities = [
    {
      id: "cap-3d",
      title: "3D Product Animation",
      icon: Cpu,
      description:
        "Hyper-detailed spatial renders, kinetic exploded views, and cinematic lighting designed to showcase complex hardware and digital ecosystems with surgical precision.",
      deliverables: ["Keynote Reveal Films", "Photorealistic CGI", "Exploded Hardware Views"],
      metric: "94% Higher Retention",
    },
    {
      id: "cap-ui",
      title: "Interactive UI & WebGL",
      icon: Layers,
      description:
        "Living interfaces with fluid micro-interactions, Rive animations, and high-performance WebGL shaders that make digital software feel tangible and delight users.",
      deliverables: ["Rive & Lottie Runtimes", "Interactive WebGL Shaders", "Design System Tokens"],
      metric: "3.2x Engagement Time",
    },
    {
      id: "cap-brand",
      title: "Brand Motion Systems",
      icon: Move,
      description:
        "Comprehensive kinetic guidelines, morphing logomarks, and expressive typography systems that unify your brand voice across every screen and billboard.",
      deliverables: ["Living Brand Guidelines", "Kinetic Typography", "Motion Design Kits"],
      metric: "100% Brand Consistency",
    },
    {
      id: "cap-film",
      title: "Commercials & Spatial",
      icon: Tv,
      description:
        "Story-first commercial narratives, high-resolution anamorphic billboard installations, and product trailers engineered to stop feeds and capture market attention.",
      deliverables: ["Commercial Spots", "3D Anamorphic Displays", "Social Campaign Bundles"],
      metric: "45M+ Combined Views",
    },
  ];

  const studioStats = [
    { label: "Views Driven", value: "50M+" },
    { label: "Client Satisfaction", value: "99.4%" },
    { label: "Global Tech Brands", value: "40+" },
    { label: "Industry Accolades", value: "14" },
  ];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inquiryEmail.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#08090d] text-[#f4f5f8] overflow-hidden flex flex-col justify-between selection:bg-purple-600/30 selection:text-white">
      {/* Background Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-cyan-500/10 blur-[130px] rounded-full animate-pulse-glow -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[35%] -left-32 w-[480px] h-[480px] bg-purple-700/10 blur-[140px] rounded-full -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[55%] -right-32 w-[520px] h-[520px] bg-cyan-600/10 blur-[150px] rounded-full -z-10"
      />

      {/* Navigation Header */}
      <header
        id="main-nav"
        className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#08090d]/70 border-b border-white/[0.06] transition-all"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a
            href="#hero"
            id="nav-brand-logo"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <div className="w-full h-full bg-[#0d0e15] rounded-[11px] flex items-center justify-center">
                <span className="font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                  MB
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-base text-white group-hover:text-purple-300 transition-colors">
                MOTION BUDDIES
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">
                Creative Studio
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
            <a
              href="#showreel"
              id="nav-link-showreel"
              className="hover:text-white transition-colors"
            >
              Showreel
            </a>
            <a
              href="#capabilities"
              id="nav-link-capabilities"
              className="hover:text-white transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#stats"
              id="nav-link-stats"
              className="hover:text-white transition-colors"
            >
              Impact
            </a>
            <a
              href="#contact"
              id="nav-link-contact"
              className="hover:text-white transition-colors"
            >
              Inquire
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available Q1/Q2</span>
            </div>
            <a
              href="#contact"
              id="nav-cta-btn"
              className="relative inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Start Project
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 flex flex-col items-center text-center"
        >
          {/* Studio Announcement Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-medium text-zinc-300 backdrop-blur-md mb-8 hover:border-purple-500/40 transition-colors cursor-default">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="tracking-wide">NEXT-GEN MOTION DESIGN & INTERACTIVE STUDIO</span>
          </div>

          {/* Core Heading and Tagline */}
          <h1 className="max-w-4xl text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400">
              MOTION BUDDIES
            </span>
            <span className="block mt-2 text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
              Make your product move people.
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-xl text-zinc-400 leading-relaxed font-normal mb-10">
            We architect cinematic 3D motion, kinetic brand systems, and tactile digital experiences that convert passive spectators into brand believers.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="#contact"
              id="hero-cta-primary"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 rounded-xl hover:opacity-95 shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Book Strategy Call</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#showreel"
              id="hero-cta-reel"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 text-sm font-medium text-zinc-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] rounded-xl backdrop-blur-md transition-all hover:scale-[1.01]"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/40" />
              <span>Preview 2026 Reel</span>
            </a>
          </div>

          {/* Tech Stack / Workflow Tags */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-zinc-400 font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              Cinema 4D / Octane
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              Spline 3D & WebGL
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              Rive & Lottie Runtimes
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              Next.js & React 19
            </span>
          </div>
        </section>

        {/* Showreel Preview Showcase */}
        <section
          id="showreel"
          className="max-w-6xl mx-auto px-6 py-12"
        >
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-purple-500/30 via-indigo-500/10 to-transparent shadow-2xl shadow-purple-900/20">
            <div className="relative rounded-[15px] bg-[#0c0e14] overflow-hidden border border-white/[0.08]">
              {/* Media Container */}
              <div className="relative w-full aspect-[16/9] max-h-[560px] overflow-hidden bg-black flex items-center justify-center group">
                <Image
                  src="/images/motion_showreel_poster.jpg"
                  alt="MOTION BUDDIES 3D Motion Showreel Preview"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-black/20 to-transparent" />

                {/* Simulated Play Overlay Button */}
                <button
                  id="showreel-play-toggle"
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="relative z-20 flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:scale-110 hover:bg-white/20 active:scale-95 transition-all shadow-2xl shadow-purple-500/40 group-hover:border-purple-400"
                  aria-label={isPlaying ? "Pause Showreel" : "Play Showreel"}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-white" />
                  ) : (
                    <Play className="w-8 h-8 fill-white translate-x-0.5" />
                  )}
                </button>

                {/* Floating Top Reel Status Bar */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>STUDIO REEL 2026 [4K 60FPS]</span>
                  </div>

                  <button
                    id="showreel-mute-toggle"
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white transition-colors"
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Muted</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Sound On</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bottom Timeline Bar */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-2 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between text-xs text-zinc-300 font-mono">
                    <span className="text-white font-medium">Kinetic Brand Physics & Spatial Launch</span>
                    <span className="text-purple-300">01:42 / 02:30</span>
                  </div>

                  {/* Scrubber Bar */}
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-500 ${
                        isPlaying ? "w-[68%]" : "w-[45%]"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Reel Card Footer Details */}
              <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0a0c12]">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Dynamic Physics & Kinetic Storytelling
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Featured at Awwwards Annual Conference • Curated by Motion Buddies Design Lab
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300">
                    4K Ultra HD
                  </span>
                  <span className="px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-300">
                    Dolby Spatial Audio
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact / Stats Section */}
        <section
          id="stats"
          className="max-w-7xl mx-auto px-6 py-16"
        >
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8 md:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
              {studioStats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center text-center ${
                    idx !== 0 ? "pt-6 lg:pt-0" : ""
                  }`}
                >
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 mb-2">
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium text-zinc-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section
          id="capabilities"
          className="max-w-7xl mx-auto px-6 py-20"
        >
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 tracking-wider uppercase mb-4">
              Core Disciplines
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl">
              Engineered to make every interaction memorable.
            </h2>
            <p className="text-zinc-400 mt-4 max-w-xl text-base">
              From early product reveal teasers to interactive production design systems, we craft every frame with obsessive attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap) => {
              const IconComp = cap.icon;
              return (
                <div
                  key={cap.id}
                  id={cap.id}
                  className="group relative p-8 rounded-2xl bg-[#0f1118]/80 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-white/[0.04] text-cyan-300 border border-cyan-500/20">
                        {cap.metric}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/[0.06]">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-3">
                      Key Deliverables
                    </span>
                    <ul className="space-y-2">
                      {cap.deliverables.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Project Inquiry / CTA Section */}
        <section
          id="contact"
          className="max-w-5xl mx-auto px-6 py-20"
        >
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-[#12141f] to-[#0c0e15] border border-white/[0.1] shadow-2xl overflow-hidden text-center">
            <div
              aria-hidden="true"
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"
            />

            <span className="inline-block text-xs font-mono uppercase tracking-widest text-purple-400 mb-3">
              Let&apos;s Build Together
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to make your product move people?
            </h2>
            <p className="max-w-lg mx-auto text-zinc-400 mt-4 text-sm sm:text-base leading-relaxed">
              Tell us about your upcoming launch, design overhaul, or product milestone. We typically respond within 24 hours.
            </p>

            {/* Quick Tag Selector */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8 mb-8">
              {[
                "3D Product Launch",
                "UI Motion System",
                "App Micro-Interactions",
                "Keynote Film",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTag === tag
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Interactive Email Form */}
            {isSubmitted ? (
              <div className="max-w-md mx-auto p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! We will reach out shortly to discuss {selectedTag}.</span>
              </div>
            ) : (
              <form
                id="inquiry-form"
                onSubmit={handleInquirySubmit}
                className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    id="inquiry-email-input"
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="Enter your work email..."
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/[0.12] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  id="inquiry-submit-btn"
                  type="submit"
                  className="px-6 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                >
                  <span>Connect</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <p className="text-xs text-zinc-500 mt-6">
              Or email directly:{" "}
              <a
                href="mailto:hello@motionbuddies.com"
                className="text-zinc-300 hover:text-white underline decoration-zinc-600 underline-offset-4"
              >
                hello@motionbuddies.com
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="main-footer"
        className="w-full border-t border-white/[0.06] bg-[#07080b] py-12 px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm tracking-tight text-white">
              MOTION BUDDIES
            </span>
            <span className="text-zinc-600">•</span>
            <span>Make your product move people.</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              Twitter / X
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              Dribbble
            </a>
            <a
              href="https://vimeo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition-colors"
            >
              Vimeo
            </a>
          </div>

          <div>
            &copy; 2026 MOTION BUDDIES Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
