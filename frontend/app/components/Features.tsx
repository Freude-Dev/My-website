"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Wrench } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Proactive Maintenance",
      description: "We ensure your systems run flawlessly 24/7 with continuous monitoring and rapid technical support to minimize downtime.",
      icon: <Wrench strokeWidth={1.5} className="w-8 h-8 text-orange-500" />,
      delay: 0.2
    },
    {
      title: "High-Performance Web",
      description: "We build blazing-fast, responsive, and aesthetically stunning websites tailored to accelerate your business growth.",
      icon: <Zap strokeWidth={1.5} className="w-8 h-8 text-amber-500" />,
      delay: 0.35
    },
    {
      title: "Enterprise-Grade Security",
      description: "Your data's safety is our highest priority. We deploy robust network architectures and uncompromising security protocols.",
      icon: <ShieldCheck strokeWidth={1.5} className="w-8 h-8 text-orange-400" />,
      delay: 0.5
    }
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden max-w-7xl mx-auto px-6 w-full">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center mb-16 md:mb-24">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-orange-500 text-xs tracking-[0.3em] uppercase font-medium mb-4"
        >
          — The FreudeDev Advantage
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white text-center leading-tight mb-6"
        >
          Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Excellence</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2 }}
          className="text-sm text-zinc-400 text-center max-w-2xl mx-auto leading-relaxed"
        >
          We blend technical expertise with creative problem-solving to deliver resilient infrastructure and digital experiences that elevate your business.
        </motion.p>
      </div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: feature.delay, ease: "easeOut" }}
            className="group relative p-8 md:p-10 rounded-[2rem] bg-zinc-950/60 border border-zinc-800/80 hover:border-orange-500/40 hover:bg-zinc-900/80 transition-all duration-500 overflow-hidden"
          >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-start gap-8">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 group-hover:scale-110 group-hover:border-orange-500/30 transition-transform duration-500 shadow-2xl shadow-black/50">
                {feature.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}