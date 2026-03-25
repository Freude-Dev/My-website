"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import data from "../../data/ServiceDetails.json";

type ServiceType = {
  id: number;
  name: string;
  image: string;
  description: string;
  subservices: string[];
  prices: number[];
};

const icons: Record<string, JSX.Element> = {
  "IT Maintenance": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
    </svg>
  ),
  "Web Design": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  "Network Administration": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
};

export default function Service() {
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [glowVisible, setGlowVisible] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalBoxRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeService && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" }
      );
    }
  }, [activeService]);

  const handleClose = () => {
    if (!modalRef.current) return;
    gsap.to(modalRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setActiveService(null);
        setSelected([]);
        setGlowVisible(false);
      },
    });
  };

  const toggleSubservice = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalBoxRef.current || !glowRef.current) return;
    const r = modalBoxRef.current.getBoundingClientRect();
    gsap.to(glowRef.current, {
      x: e.clientX - r.left - 150,
      y: e.clientY - r.top - 150,
      duration: 0.4,
    });
  };

  const total = selected.reduce(
    (sum, index) => sum + (activeService?.prices[index] ?? 0),
    0
  );

  const handleSubmit = () => {
    if (selected.length === 0) return;
    alert(
      `Order submitted!\nServices: ${selected.map((i) => activeService?.subservices[i]).join(", ")}\nTotal: ${total.toLocaleString()} FCFA`
    );
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .card-enter { animation: fadeUp 0.6s ease forwards; }
        .scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(249,115,22,0.06) 50%, transparent 60%);
          animation: scanline 4s linear infinite;
          pointer-events: none;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .ticker-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #f97316, transparent);
        }
      `}</style>

      {/* PAGE HEADER */}
      <div className="w-full max-w-7xl mx-auto px-6 mb-16">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-8">
          <div>
            <p className="text-orange-500 text-xs tracking-[0.3em] uppercase font-medium mb-3">
              — What we offer
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
              Our
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                Services
              </span>
            </h1>
          </div>
          <p className="hidden md:block max-w-xs text-zinc-500 text-sm text-right leading-relaxed">
            Select a service below to explore our offerings and build your
            custom package.
          </p>
        </div>
      </div>

      {/* SERVICE CARDS */}
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.services.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActiveService(item)}
            className="card-enter group relative text-left rounded-2xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all duration-500 bg-zinc-950"
            style={{ animationDelay: `${i * 0.12}s`, opacity: 0 }}
          >
            {/* IMAGE */}
            <div className="relative h-56 overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="scanline" />
              <span className="absolute top-4 right-4 text-xs font-mono text-orange-500/60 border border-orange-500/20 px-2 py-1 rounded">
                0{item.id}
              </span>
            </div>

            {/* BODY */}
            <div className="relative p-6 grid-bg">
              <div className="ticker-line" />

              <div className="flex items-start gap-4 mb-4">
                <div className="text-orange-500 mt-0.5 shrink-0">
                  {icons[item.name]}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white leading-tight group-hover:text-orange-400 transition-colors duration-300">
                    {item.name}
                  </h2>
                  <p className="text-zinc-500 text-sm mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* SUBSERVICE PILLS */}
              <div className="flex flex-wrap gap-2 mt-4">
                {item.subservices.slice(0, 3).map((sub, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 border border-zinc-800 group-hover:border-orange-500/30 group-hover:text-orange-300/70 px-2 py-1 rounded transition-all duration-300"
                  >
                    {sub}
                  </span>
                ))}
                {item.subservices.length > 3 && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-orange-500/60 border border-orange-500/20 px-2 py-1 rounded">
                    +{item.subservices.length - 3} more
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-zinc-600 font-mono">
                  From {Math.min(...item.prices).toLocaleString()} FCFA
                </span>
                <div className="flex items-center gap-2 text-orange-500 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>Explore</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* MODAL */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-lg"
            onClick={handleClose}
          />

          <div ref={modalRef} className="relative z-10 w-full max-w-5xl">
            <div
              ref={modalBoxRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setGlowVisible(true)}
              onMouseLeave={() => setGlowVisible(false)}
              className="relative rounded-2xl overflow-hidden border border-zinc-800"
              style={{ background: "#0a0a0a" }}
            >
              {/* GLOW */}
              <div
                ref={glowRef}
                className={`pointer-events-none absolute size-[300px] rounded-full blur-3xl transition-opacity duration-300 ${
                  glowVisible ? "opacity-30" : "opacity-0"
                } bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400`}
              />

              <div className="relative z-10 grid md:grid-cols-[1fr_1.4fr]">

                {/* LEFT — SERVICE IDENTITY */}
                <div className="relative flex flex-col justify-between p-8 md:p-10 overflow-hidden min-h-[340px]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${activeService.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-orange-950/60" />
                  <div className="scanline" />

                  <div className="relative z-10">
                    <span className="text-xs font-mono text-orange-400 tracking-[0.25em] uppercase">
                      Service 0{activeService.id}
                    </span>
                  </div>

                  <div className="relative z-10 mt-auto">
                    <div className="text-orange-500 mb-4">
                      {icons[activeService.name]}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
                      {activeService.name}
                    </h2>
                    <p className="text-zinc-300 text-sm leading-relaxed max-w-xs">
                      {activeService.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex gap-8">
                    <div>
                      <div className="text-2xl font-black text-orange-400">
                        {activeService.subservices.length}
                      </div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">
                        Subservices
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-orange-400">
                        {Math.min(...activeService.prices).toLocaleString()}
                      </div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">
                        Min. FCFA
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — PRICING SELECTOR */}
                <div className="p-8 md:p-10 border-t md:border-t-0 md:border-l border-zinc-800/80">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-white font-black text-xl">
                        Build your package
                      </h3>
                      <p className="text-zinc-500 text-xs mt-1">
                        Select the services you need
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-zinc-600 hover:text-white transition p-2 rounded-lg hover:bg-zinc-800"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* TABLE HEADER */}
                  <div className="grid grid-cols-[1fr_auto] text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 border-b border-zinc-800 pb-3 mb-3 px-1">
                    <span>Service</span>
                    <span>Price (FCFA)</span>
                  </div>

                  {/* SUBSERVICE LIST */}
                  <ul className="space-y-2">
                    {activeService.subservices.map((sub, index) => {
                      const checked = selected.includes(index);
                      return (
                        <li
                          key={index}
                          onClick={() => toggleSubservice(index)}
                          className={`grid grid-cols-[20px_1fr_auto] items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ${
                            checked
                              ? "bg-orange-500/10 border border-orange-500/40"
                              : "border border-transparent hover:border-zinc-700 hover:bg-zinc-900"
                          }`}
                        >
                          {/* CUSTOM CHECKBOX */}
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all duration-200 shrink-0 ${
                              checked
                                ? "border-orange-500 bg-orange-500"
                                : "border-zinc-600"
                            }`}
                          >
                            {checked && (
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>

                          <span
                            className={`text-sm transition-colors duration-200 ${
                              checked ? "text-white font-medium" : "text-zinc-400"
                            }`}
                          >
                            {sub}
                          </span>

                          <span
                            className={`text-sm font-mono font-bold transition-colors duration-200 ${
                              checked ? "text-orange-400" : "text-zinc-600"
                            }`}
                          >
                            {activeService.prices[index].toLocaleString()}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* TOTAL */}
                  <div
                    className={`mt-6 overflow-hidden transition-all duration-300 ${
                      selected.length > 0
                        ? "max-h-24 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                      <div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider font-mono">
                          Total
                        </div>
                        <div className="text-2xl font-black text-white mt-0.5">
                          {total.toLocaleString()}
                          <span className="text-orange-500 text-sm font-mono ml-1">
                            FCFA
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-600 font-mono">
                        {selected.length} item{selected.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button
                    onClick={handleSubmit}
                    disabled={selected.length === 0}
                    className={`mt-6 w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                      selected.length > 0
                        ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-900/40"
                        : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800"
                    }`}
                  >
                    {selected.length === 0
                      ? "Select services to continue"
                      : "Request this package →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}