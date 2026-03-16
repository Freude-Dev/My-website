"use client";

import React, { useEffect, useRef, useState } from "react";
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

export default function Service() {
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [glowVisible, setGlowVisible] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalBoxRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  /* OPEN */
  useEffect(() => {
    if (activeService && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeService]);

  /* CLOSE */
  const handleClose = () => {
    if (!modalRef.current) return;

    gsap.to(modalRef.current, {
      scale: 0.85,
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
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalBoxRef.current || !glowRef.current) return;
    const r = modalBoxRef.current.getBoundingClientRect();

    gsap.to(glowRef.current, {
      x: e.clientX - r.left - 150,
      y: e.clientY - r.top - 150,
      duration: 0.3,
    });
  };

  return (
    <>
      {/* SERVICES */}
      <div
        className={`
          flex flex-col md:flex-row
          gap-6
          w-full max-w-7xl
          mx-auto px-6 md:px-0 mt-10
          ${activeService ? "blur-sm" : ""}
        `}
      >
        {data.services.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveService(item)}
            className="
              relative group
              w-full md:w-56
              h-[220px] md:h-[600px]
              transition-all duration-500
              md:flex-grow md:hover:w-full
            "
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover rounded-2xl"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition rounded-2xl text-white">
              <h2 className="text-2xl md:text-3xl">{item.name}</h2>
              <p className="text-sm mt-1">{item.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* MODAL */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
          />

          <div ref={modalRef} className="relative z-10 w-full px-4">
            <div
              ref={modalBoxRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setGlowVisible(true)}
              onMouseLeave={() => setGlowVisible(false)}
              className="relative max-w-6xl mx-auto rounded-3xl p-px bg-zinc-900 overflow-hidden"
            >
              {/* GLOW */}
              <div
                ref={glowRef}
                className={`pointer-events-none absolute size-[300px] rounded-full blur-3xl transition-opacity
                  ${glowVisible ? "opacity-100" : "opacity-0"}
                  bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500`}
              />

              {/* CONTENT */}
              <div
                className="
                  relative z-10
                  flex flex-col md:grid
                  md:grid-cols-2
                  rounded-[22px]
                  overflow-hidden
                "
              >
                {/* TOP (LEFT ON DESKTOP) */}
                <div className="relative p-8 md:p-10 text-white">
                  <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-xl"
                    style={{}}
                  />
                  <div className="absolute inset-0 bg-black/70" />
                  <div className="relative z-10 flex flex-col items-center align-center py-[30%]">
                    <h2 className="text-3xl md:text-4xl font-bold text-center">
                      {activeService.name}
                    </h2>
                    <p className="mt-4 text-zinc-200 text-center">
                      {activeService.description}
                    </p>
                  </div>
                </div>

                {/* BOTTOM (RIGHT ON DESKTOP) */}
                <div className="p-8 md:p-10 bg-zinc-900/95">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-6">
                    Subservices
                  </h3>

                  {/* TABLE HEADER */}
                  <div className="grid grid-cols-[40px_1fr_100px] text-sm text-zinc-400 border-b border-zinc-700 pb-2 mb-3">
                    <span></span>
                    <span>Service</span>
                    <span className="text-right">Price</span>
                  </div>

                  <ul className="space-y-2">
                    {activeService.subservices.map((sub, index) => {
                      const checked = selected.includes(index);
                      return (
                        <li
                          key={index}
                          onClick={() => toggleSubservice(index)}
                          className={`grid grid-cols-[40px_1fr_100px] items-center px-4 py-3 rounded-xl cursor-pointer transition
                            ${
                              checked
                                ? "bg-orange-500/20 border border-orange-400"
                                : "bg-zinc-800 hover:bg-zinc-700"
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            readOnly
                            className="accent-orange-500"
                          />
                          <span className="text-white">{sub}</span>
                          <span className="text-right text-orange-400">
                            {activeService.prices[index]} FCFA
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <button className="mt-8 w-full rounded-full bg-orange-500 py-3 text-white font-medium hover:bg-orange-600 transition">
                    Submit Selection
                  </button>

                  <button
                    onClick={handleClose}
                    className="mt-4 w-full text-sm text-zinc-400 hover:text-white"
                  >
                    Cancel
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
