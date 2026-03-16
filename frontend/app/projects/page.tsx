"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "../../data/Projects.json";

gsap.registerPlugin(ScrollTrigger);

function generateCurvedPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    const offset = (Math.random() - 0.5) * 40;

    d += `
      C ${prev.x + offset} ${midY},
        ${curr.x - offset} ${midY},
        ${curr.x} ${curr.y}
    `;
  }

  return d;
}

export default function ProjectsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRefs = useRef<HTMLSpanElement[]>([]);
  const [pathD, setPathD] = useState("");

  useEffect(() => {
    const scroller = scrollRef.current;
    const svg = svgRef.current;
    if (!scroller || !svg) return;

    dotRefs.current = [];

    const svgRect = svg.getBoundingClientRect();
    const points = dotRefs.current.map((dot) => {
      const r = dot.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - svgRect.left,
        y: r.top + r.height / 2 - svgRect.top,
      };
    });

    if (points.length > 1) {
      setPathD(generateCurvedPath(points));
    }

    const ctx = gsap.context(() => {
      const path = pathRef.current;
      if (path) {
        const length = path.getTotalLength();

        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: scroller,
            scroller,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }
      gsap.utils.toArray<HTMLElement>(".project-item").forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 60,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            scroller,
            start: "top 85%",
            end: "top 40%",
            scrub: true,
          },
        });
      });
      gsap.utils.toArray<HTMLElement>(".timeline-dot").forEach((dot) => {
        gsap.to(dot, {
          scale: 0,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: dot,
            scroller,
            start: "top 85%",
            end: "top 40%",
            scrub: true,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="h-screen overflow-hidden flex">
      {/* LEFT FIXED TITLE */}
      <aside className="w-1/3 flex flex-col justify-center px-20 border-r">
        <h1 className="text-6xl font-black mb-6">Projects</h1>
        <p className="text-gray-600 max-w-md">
          These are the main projects and their respective years.
        </p>
      </aside>

      {/* RIGHT SCROLLABLE CONTENT */}
      <section
        ref={scrollRef}
        className="w-2/3 relative overflow-y-auto px-24 py-32"
      >
        {/* ORANGE SVG LINE (RIGHT SIDE) */}
        <svg
          ref={svgRef}
          className="absolute top-0 right-12 h-full w-[120px] pointer-events-none"
        >
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <ul className="relative space-y-40">
          {Object.entries(data.Projects).map(([year, projects]) => (
            <li key={year}>
              <h2 className="mb-28 text-center text-3xl font-black">
                {year}
              </h2>

              <ul className="space-y-40">
                {projects.map((item, index) => {
                  const isRight = index % 2 === 0;

                  return (
                    <li
                      key={`${year}-${index}`}
                      className="relative flex project-item"
                    >
                      <div
                        className={`w-1/2 pr-20 text-right ${
                          isRight && "opacity-0"
                        }`}
                      >
                        {!isRight && (
                          <>
                            <img src={item.image} alt={item.name} />
                            <h3 className="text-lg font-black">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="absolute right-12 top-2 z-10">
                        <span
                        ref={(el) => {
                          if (el) {
                            if (!dotRefs.current.includes(el)) {
                              dotRefs.current.push(el);
                            }
                          }
                        }}
                          className="timeline-dot block h-5 w-5 rounded-full bg-black border-4 border-orange-500 shadow-lg"
                        />
                      </div>

                      <div
                        className={`w-1/2 pl-20 ${
                          !isRight && "opacity-0"
                        }`}
                      >
                        {isRight && (
                          <>
                            <img src={item.image} alt={item.name} />
                            <h3 className="text-lg font-black">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
