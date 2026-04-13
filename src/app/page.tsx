"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, ExternalLink, Code2 } from "lucide-react";

import HeroCanvas from "@/components/HeroCanvas";
import GlassCard from "@/components/GlassCard";
import MagneticButton from "@/components/MagneticButton";
import OutlineFillText from "@/components/OutlineFillText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const skillsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!skillsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skill-tag",
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 80%",
          }
        }
      );
    }, skillsRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative w-full bg-[var(--color-background-base)] selection:bg-[var(--color-accent)] selection:text-black">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">
        <HeroCanvas />
        <div className="z-10 flex flex-col items-center text-center px-6 pointer-events-none mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-[12rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 mb-6 drop-shadow-2xl">
              ABINDAS
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <p className="text-xl md:text-3xl font-sans text-[var(--color-text-secondary)] mb-12 max-w-2xl font-light">
              Building at the intersection of <span className="text-white font-medium">AI</span> and the <span className="text-[var(--color-accent)] font-medium text-stroke">web</span>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
            className="pointer-events-auto"
          >
            <MagneticButton onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
              View Projects
            </MagneticButton>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="relative py-32 px-6 md:px-12 lg:px-24 mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row gap-16 items-start"
        >
          <div className="lg:w-1/2">
            <h2 className="text-sm font-sans tracking-[0.2em] text-[var(--color-accent)] uppercase mb-6">/ About</h2>
            <div className="mb-8 flex flex-col gap-2">
              <OutlineFillText text="Sophomore" className="text-5xl md:text-7xl lg:text-[5rem]" />
              <OutlineFillText text="Engineer &" className="text-5xl md:text-7xl lg:text-[5rem]" />
              <OutlineFillText text="Architect." className="text-5xl md:text-7xl lg:text-[5rem]" />
            </div>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] font-sans leading-relaxed">
              I am a CS student at AIT Pune, specializing in Full Stack Development and AI-driven System Design. Currently the Lead Developer for a national-level SIH '25 Finalist platform. I excel at building real-world solutions using AWS serverless architectures, robust backend engines, and modern frontend frameworks.
            </p>
          </div>
          
          <div className="lg:w-1/2 w-full" ref={skillsRef}>
            <h2 className="text-sm font-sans tracking-[0.2em] text-[var(--color-text-secondary)] uppercase mb-8">Core Arsenal</h2>
            <div className="flex flex-wrap gap-4">
              {['React', 'Next.js', 'FastAPI', 'Python', 'PyTorch', 'AWS (Bedrock, CDK)', 'MongoDB', 'Docker', 'Hyprland'].map((skill, i) => (
                <div key={i} className="skill-tag px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors cursor-crosshair">
                  <span className="font-sans text-sm text-gray-300 tracking-wide">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. PROJECTS SECTION */}
      <section id="projects" className="relative py-32 px-6 md:px-12 lg:px-24 mx-auto max-w-7xl">
        <h2 className="text-sm font-sans tracking-[0.2em] text-[var(--color-accent)] uppercase mb-16 text-center">/ Featured Work</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <Code2 className="w-10 h-10 text-[var(--color-accent)] opacity-80" />
                <a href="https://github.com/DasAbin/YatraMind" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors"><ExternalLink className="w-5 h-5 text-white/50 hover:text-white" /></a>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">YatraMind Platform</h3>
              <p className="text-[var(--color-text-secondary)] font-sans text-sm mb-6 leading-relaxed">
                SIH '25 Finalist. Architected an AI-driven planning platform for Kochi Metro using FastAPI and MongoDB. Engineered an optimization engine using Google OR-Tools.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-6">
              {['FastAPI', 'MongoDB', 'PyTorch', 'Socket.io'].map((t) => (
                <span key={t} className="text-xs font-sans text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">{t}</span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <Code2 className="w-10 h-10 text-[var(--color-accent-secondary)] opacity-80" />
                <a href="https://github.com/DasAbin/Saarthi.AI" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors"><ExternalLink className="w-5 h-5 text-white/50 hover:text-white" /></a>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Saarthi.AI</h3>
              <p className="text-[var(--color-text-secondary)] font-sans text-sm mb-6 leading-relaxed">
                Production-ready, multilingual civic assistant using Next.js and AWS CDK. Highly-available RAG pipeline with AWS Bedrock for querying complex government schemes.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-6">
              {['Next.js', 'AWS CDK', 'AWS Bedrock', 'Textract'].map((t) => (
                <span key={t} className="text-xs font-sans text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">{t}</span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <Code2 className="w-10 h-10 text-white opacity-80" />
                <a href="https://github.com/DasAbin/DecodX-LLM" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors"><ExternalLink className="w-5 h-5 text-white/50 hover:text-white" /></a>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">DecodX-LLM</h3>
              <p className="text-[var(--color-text-secondary)] font-sans text-sm mb-6 leading-relaxed">
                HackRx '25 Finalist. Built a modular RAG service utilizing Gemini 1.5-Flash and FAISS for context-aware analysis of unstructured document datasets.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-6">
              {['Gemini 1.5', 'FAISS', 'FastAPI', 'Python'].map((t) => (
                <span key={t} className="text-xs font-sans text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">{t}</span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <Code2 className="w-10 h-10 text-[var(--color-accent)] opacity-80" />
                <a href="https://github.com/DasAbin/LearnTrace-Personal-Learning-History-Tracker.git" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors"><ExternalLink className="w-5 h-5 text-white/50 hover:text-white" /></a>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">LearnTrace</h3>
              <p className="text-[var(--color-text-secondary)] font-sans text-sm mb-6 leading-relaxed">
                Personal Learning History Tracker. Keep track of specific learnings, articles read, courses, and create your own curated learning history map.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-6">
              {['Next.js', 'React', 'Tailwind', 'TypeScript'].map((t) => (
                <span key={t} className="text-xs font-sans text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">{t}</span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <Code2 className="w-10 h-10 text-[var(--color-accent-secondary)] opacity-80" />
                <a href="https://github.com/DasAbin/Internship-Scrapper.git" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors"><ExternalLink className="w-5 h-5 text-white/50 hover:text-white" /></a>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Internship Scrapper</h3>
              <p className="text-[var(--color-text-secondary)] font-sans text-sm mb-6 leading-relaxed">
                Automated platform scrapper built to quickly discover and aggregate fresh internship opportunities from multiple job boards out there.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-6">
              {['Python', 'Web Scraping', 'Automation'].map((t) => (
                <span key={t} className="text-xs font-sans text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">{t}</span>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 4. CONTACT SECTION */}
      <section className="relative py-32 px-6 border-t border-white/5 mt-20 overflow-hidden group">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-12 flex items-center justify-center gap-4 flex-wrap">
            LET'S <span className="text-stroke inline-block">CONNECT</span>
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
            <MagneticButton className="!bg-white !text-black hover:!bg-gray-200 border-none" onClick={() => window.open('mailto:abindasp2006@gmail.com', '_blank')}>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>abindasp2006@gmail.com</span>
              </div>
            </MagneticButton>
            
            <a href="https://github.com/DasAbin" target="_blank" rel="noopener noreferrer" className="group/git relative overflow-hidden text-lg font-sans text-white/70 hover:text-white transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              <span>github.com/DasAbin</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-accent)] origin-left scale-x-0 group-hover/git:scale-x-100 transition-transform duration-300"></span>
            </a>

            <a href="https://linkedin.com/in/abindasp" target="_blank" rel="noopener noreferrer" className="group/in relative overflow-hidden text-lg font-sans text-white/70 hover:text-white transition-colors flex items-center gap-2">
              <span className="font-bold border border-white/70 rounded px-1.5 py-0.5 text-xs group-hover/in:border-white">in</span>
              <span>linkedin.com/in/abindasp</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-accent)] origin-left scale-x-0 group-hover/in:scale-x-100 transition-transform duration-300"></span>
            </a>
          </div>
        </div>
      </section>
      
    </main>
  );
}
