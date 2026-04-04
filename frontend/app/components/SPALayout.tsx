"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import About from "../about/page";
import Services from "../services/page";
import Projects from "../projects/page";
import Home from "../page";
import Features from "./Features";
import TeamMember from "./TeamMembers";
import ServiceDetails from "./serviceDetails";
import Footer from "./footer";
import FAQ from "./FAQ";
import RatingStars from "./rating";
import HeroSection from "./HeroSection";
import TechBackground from "./TechBackground";
import test from "../../data/testimonials.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

// Real FreudeDev stats
const STATS = [
  { value: "3+",   label: "Clients Served",           sub: "Businesses we've helped grow" },
  { value: "10+",  label: "Projects Completed",        sub: "Across web, IT & networking" },
  { value: "2+",   label: "Years of Experience",       sub: "Building digital solutions" },
  { value: "100%", label: "Client Satisfaction",       sub: "Our standard, every time" },
];

export default function SPALayout() {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState('home');
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const previousSection = useRef('home');

  // Map URL paths to sections
  useEffect(() => {
    let newSection = 'home';
    
    if (pathname === '/') {
      newSection = 'home';
    } else if (pathname === '/about') {
      newSection = 'about';
    } else if (pathname === '/services') {
      newSection = 'services';
    } else if (pathname === '/projects') {
      newSection = 'projects';
    }

    // Determine slide direction based on navigation order
    const sections = ['home', 'about', 'services', 'projects'];
    const currentIndex = sections.indexOf(previousSection.current);
    const newIndex = sections.indexOf(newSection);
    
    if (newIndex > currentIndex) {
      setDirection('right');
    } else if (newIndex < currentIndex) {
      setDirection('left');
    }

    previousSection.current = newSection;
    setCurrentSection(newSection);
  }, [pathname]);

  // Fade animation variants
  const fadeVariants = {
    enter: {
      opacity: 0,
      scale: 0.98,
    },
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 1.02,
    },
  };

  const fadeTransition = {
    type: 'tween' as const,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
    duration: 0.4,
  };

  // Render the appropriate section
  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <HomeContent />;
      case 'about':
        return <AboutContent />;
      case 'services':
        return <ServicesContent />;
      case 'projects':
        return <ProjectsContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <TechBackground />
      <style jsx global>{`
        .page-transition-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          z-index: 10;
        }
        .page-transition-content {
          position: relative;
          width: 100%;
          min-height: 100vh;
          z-index: 10;
        }
      `}</style>
      <div className="page-transition-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={fadeTransition}
            className="page-transition-content"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Home Section Content
function HomeContent() {
  return (
    <>
      <div className="flex flex-col items-center overflow-x-hidden">
        {/* Hero Section */}
        <HeroSection />

        {/* Testimonials + Stats */}
        <section className="w-full max-w-[85rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-24 mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center">

            {/* LEFT — Testimonials Swiper */}
            <motion.div 
              className="relative w-full"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="text-orange-500 text-xs tracking-[0.3em] uppercase font-medium mb-4">
                — What clients say
              </p>

              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet !bg-orange-500",
                  bulletActiveClass: "!bg-orange-600 !scale-125",
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                className="w-full !pb-12"
              >
                {test.testimonials.map((item: any, i: number) => (
                  <SwiperSlide key={i}>
                    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 text-center">
                      <RatingStars rating={item.testimonial.rating} />
                      <p className="text-white text-lg font-medium mt-4 mb-6 italic">
                        "{item.testimonial.text}"
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
                        />
                        <div className="text-left">
                          <p className="text-white font-semibold">{item.name}</p>
                          <p className="text-zinc-400 text-sm">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            {/* RIGHT — Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-6 mt-12 lg:mt-0"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 text-center hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">
                    {stat.label}
                  </div>
                  <div className="text-zinc-400 text-xs">
                    {stat.sub}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

// About Section Content
function AboutContent() {
  return (
    <div className="py-48 flex flex-col gap-24 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-24 max-md:px-6 px-8">
        {/* Image */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative shadow-2xl shadow-orange-600/30 rounded-2xl overflow-hidden shrink-0"
        >
          <img
            src="/images/AB-Logo.png"
            alt="FreudeDev Logo"
            width={451}
            height={451}
            className="max-w-sm w-full object-contain rounded-2xl"
          />

          {/* Community badge */}
          <div className="flex items-center gap-3 absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg">
            <div className="flex -space-x-3 shrink-0">
              {[
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="community member"
                  className="size-8 rounded-full border-2 border-white object-cover"
                />
              ))}
              <div className="flex items-center justify-center text-[10px] font-bold text-white size-8 rounded-full border-2 border-white bg-orange-600">
                50+
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-700 leading-tight">
              Join our growing client community
            </p>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="max-w-lg"
        >
          <p className="text-orange-500 text-xs tracking-[0.3em] uppercase font-medium mb-4">
            — Who we are
          </p>

          <h1 className="text-5xl md:text-6xl uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300 leading-none mb-4">
            About Us
          </h1>

          <div className="w-20 h-[3px] rounded-full bg-gradient-to-r from-orange-600 to-amber-300 mb-8" />

          <p className="text-white text-sm leading-relaxed mb-4">
            <span className="font-bold text-orange-400">FreudeDev</span> is a digital services company specialising in IT Maintenance, Web Design, and Network Administration — delivering efficient, reliable solutions tailored to each client's needs.
          </p>

          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            Founded with a mission to make professional tech services accessible, we work with startups, SMEs, and institutions to build, maintain, and secure their digital infrastructure.
          </p>

          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Whether you need a sleek landing page, a hardened network architecture, or a full IT audit — we bring precision and dedication to every project.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 border-t border-zinc-800 pt-8">
            {[
              { value: "3+",   label: "Clients" },
              { value: "10+",  label: "Projects" },
              { value: "2+",   label: "Years" },
              { value: "100%", label: "Satisfaction" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                  {s.value}
                </div>
                <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SERVICES CTA BANNER */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl mx-auto px-4 w-full"
      >
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-600 to-amber-500 p-10 md:p-14 text-white text-center">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10">
            <p className="text-orange-100 text-xs tracking-[0.3em] uppercase font-medium mb-3">
              — What we do
            </p>
            <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
              Three services.<br />One reliable team.
            </h2>
            <p className="text-orange-100 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              From diagnosing hardware faults to deploying secure networks and building beautiful websites — FreudeDev covers your full digital needs.
            </p>
            <a
              href="/services"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-black px-8 py-3 rounded-full hover:bg-orange-50 transition-all duration-300 text-sm shadow-lg"
            >
              Explore our services
              <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
                <path d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </motion.section>

      {/* FEATURES + TEAM */}
      <Features />
      <TeamMember />
      <Footer />
    </div>
  );
}

// Services Section Content
function ServicesContent() {
  return (
    <div className="flex flex-col items-center justify-center text-white lg:mt-60 max-w-full max-h-auto my-10 mt-30">
      <ServiceDetails />
      <Footer />
    </div>
  );
}

// Projects Section Content  
function ProjectsContent() {
  return (
    <div>
      <Projects />
      <Footer />
    </div>
  );
}
