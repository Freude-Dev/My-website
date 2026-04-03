"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Github, Twitter, Mail } from "lucide-react";
import { SiCisco, SiFigma, SiFramer, SiLinux, SiNextdotjs, SiExpress } from "react-icons/si";

export default function TeamMember() {
  const skills = [SiCisco, SiFigma, SiFramer, SiLinux, SiNextdotjs, SiExpress];

  return (
    <section className="relative py-24 md:py-32 w-full max-w-7xl mx-auto px-6 overflow-hidden">
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg) rotateX(-70deg); }
          to { transform: rotate(0deg) rotateX(-70deg); }
        }
        .animate-orbit { animation: spin-slow 20s linear infinite; }
        .animate-orbit-reverse { animation: spin-slow-reverse 20s linear infinite; }
        
        .orbit-item { transform: rotate(var(--angle)) translateY(-160px); }
        @media (min-width: 768px) {
          .orbit-item { transform: rotate(var(--angle)) translateY(-230px); }
        }
      `}</style>
      
      {/* Background elements */}
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute left-10 top-20 w-[300px] h-[300px] bg-orange-600/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 mt-10 md:mt-0">
        
        {/* Left: Founder's Image & Orbit */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[50%] relative flex justify-center items-center py-12 md:py-24"
          style={{ perspective: "1200px" }}
        >
          {/* 3D Wrapper */}
          <div className="relative w-[320px] h-[320px] md:w-[460px] md:h-[460px] pointer-events-none" style={{ transformStyle: "preserve-3d", transform: "translateY(80px) rotateX(70deg)" }}>
            
            {/* Orbit System */}
            <div className="absolute inset-0 rounded-full animate-orbit" style={{ transformStyle: "preserve-3d" }}>
              {/* The Trail */}
              <div className="absolute inset-0 rounded-full border border-orange-500/10" />

              {/* The Icons */}
              {skills.map((Skill, i) => {
                const angle = (i / skills.length) * 360;
                return (
                  <div 
                    key={i} 
                    className="absolute top-1/2 left-1/2 w-10 h-10 md:w-12 md:h-12 -ml-5 -mt-5 md:-ml-6 md:-mt-6 orbit-item" 
                    style={{ transformStyle: "preserve-3d", '--angle': `${angle}deg` } as React.CSSProperties}
                  >
                    <div style={{ transformStyle: "preserve-3d", transform: `rotate(-${angle}deg)` }} className="w-full h-full">
                      <div className="relative w-full h-full animate-orbit-reverse bg-zinc-950/90 border border-orange-500/50 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                        <Skill className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-orange-400" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Inner Image (un-tilted to face the camera) */}
            <div 
              className="absolute top-1/2 left-1/2 w-[220px] md:w-[280px] aspect-[4/5] -ml-[110px] md:-ml-[140px] -mt-[137.5px] md:-mt-[175px] rounded-[2rem] overflow-hidden border-2 border-zinc-800 bg-zinc-900 shadow-[0_0_40px_rgba(249,115,22,0.2)] group pointer-events-auto"
              style={{ transformStyle: "preserve-3d", transform: "rotateX(-70deg) translateY(-80px)" }}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />
              
              <Image
                src="/images/CEO.png"
                alt="Fofie Jounewe Joel Freude"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl md:text-2xl font-black text-white mb-1">Fofie Jounewe Joel Freude</h3>
                <p className="text-orange-400 font-mono text-xs md:text-sm uppercase tracking-widest drop-shadow-md">Founder & CEO</p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Right: Founder's Info */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full lg:w-[50%] flex flex-col items-start"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-orange-500" />
            <span className="text-orange-500 text-xs tracking-[0.3em] uppercase font-bold">Leadership</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
            Visionary thinking.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
              Technical precision.
            </span>
          </h2>

          <div className="space-y-6 text-zinc-400 text-base leading-relaxed mb-10">
            <p>
              As the founder of FreudeDev, <strong className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Fofie Jounewe Joel Freude</strong> brings a relentless passion for solving complex digital problems. With a deep background spanning network infrastructure, IT support, and modern web development, he built FreudeDev to be a one-stop powerhouse for businesses relying on seamless tech.
            </p>
            <p className="border-l-2 border-orange-500/50 pl-5 italic text-zinc-300 py-1">
              "Our mission is simple: to provide uncompromising quality. Whether we're securing an enterprise network or designing a high-conversion landing page, we approach every challenge with the same level of precision and dedication."
            </p>
          </div>

          
        </motion.div>
      </div>
    </section>
  );
}