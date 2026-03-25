"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function generateCurvedPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    const offset = (i % 2 === 0 ? 1 : -1) * 18;
    d += ` C ${prev.x + offset} ${midY}, ${curr.x - offset} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

type Project = {
  id: string;
  name: string;
  image: string;
  description: string;
  year: number;
};

type GroupedProjects = Record<string, Project[]>;

export default function ProjectsPage() {
  const pageRef   = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgRef    = useRef<SVGSVGElement>(null);
  const pathRef   = useRef<SVGPathElement>(null);
  const dotMap    = useRef<Map<number, HTMLDivElement>>(new Map());
  const yearRefs  = useRef<Map<string, HTMLElement>>(new Map());

  const [projects, setProjects]   = useState<GroupedProjects>({});
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [pathD, setPathD]         = useState("");
  const [activeYear, setActiveYear] = useState<string>("");

  // Fetch from Express backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data.Projects ?? {});
        const firstYear = Object.keys(data.Projects ?? {})[0];
        if (firstYear) setActiveYear(firstYear);
      } catch (err) {
        setError("Could not load projects. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const years = Object.keys(projects);

  // Flat list for global indexing
  const allProjects: { year: string; project: Project; globalIdx: number }[] = [];
  let gi = 0;
  for (const [year, list] of Object.entries(projects)) {
    for (const project of list) {
      allProjects.push({ year, project, globalIdx: gi++ });
    }
  }

  const computePath = useCallback(() => {
    const svg      = svgRef.current;
    const scroller = scrollRef.current;
    if (!svg || !scroller) return;
    const svgRect = svg.getBoundingClientRect();
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < dotMap.current.size; i++) {
      const dot = dotMap.current.get(i);
      if (!dot) continue;
      const r = dot.getBoundingClientRect();
      points.push({
        x: r.left + r.width / 2 - svgRect.left,
        y: r.top + r.height / 2 - svgRect.top + scroller.scrollTop,
      });
    }
    if (points.length > 1) setPathD(generateCurvedPath(points));
  }, []);

  useEffect(() => {
    if (loading) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(computePath));
    return () => cancelAnimationFrame(id);
  }, [computePath, loading, projects]);

  // Direct scroll listener for line draw — no GSAP scrub lag
  useEffect(() => {
    const scroller = scrollRef.current;
    const path     = pathRef.current;
    if (!scroller || !path || !pathD) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const updateLine = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      const maxScroll = scrollHeight - clientHeight;
      const progress  = maxScroll > 0 ? scrollTop / maxScroll : 0;
      path.style.strokeDashoffset = String(length * (1 - progress));
    };

    updateLine();
    scroller.addEventListener("scroll", updateLine, { passive: true });
    return () => scroller.removeEventListener("scroll", updateLine);
  }, [pathD]);

  // GSAP card + dot entrance animations
  useEffect(() => {
    const scroller = scrollRef.current;
    const page     = pageRef.current;
    if (!scroller || !page || loading) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".proj-card").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 40, duration: 0.5, ease: "power3.out",
          scrollTrigger: {
            trigger: el, scroller,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".proj-dot").forEach((el) => {
        gsap.from(el, {
          scale: 0, opacity: 0, duration: 0.4, ease: "back.out(2)",
          scrollTrigger: {
            trigger: el, scroller,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });

      years.forEach((year) => {
        const el = yearRefs.current.get(year);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el, scroller,
          start: "top 40%", end: "bottom 40%",
          onEnter:     () => setActiveYear(year),
          onEnterBack: () => setActiveYear(year),
        });
      });
    }, page);

    return () => ctx.revert();
  }, [pathD, years, loading]);

  const jumpToYear = (year: string) => {
    const el = yearRefs.current.get(year);
    if (!el || !scrollRef.current) return;
    scrollRef.current.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
    setActiveYear(year);
  };

  return (
    <>
      <style>{`
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        .scanline {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(249,115,22,0.05) 50%, transparent 60%);
          animation: scanline 5s linear infinite;
          pointer-events: none;
        }
        .proj-dot-ring {
          position: absolute; inset: -6px; border-radius: 50%;
          border: 2px solid #f97316;
          opacity: 0; transform: scale(0.6);
          transition: all 0.3s ease;
        }
        .proj-dot-wrap:hover .proj-dot-ring { opacity: 1; transform: scale(1); }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(249,115,22,0.1);
          border-color: rgba(249,115,22,0.4);
        }
        section::-webkit-scrollbar { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }
      `}</style>

      <div ref={pageRef} className="h-screen overflow-hidden flex bg-black text-white">

        {/* ── LEFT PANEL ── */}
        <aside className="w-[300px] shrink-0 flex flex-col px-10 py-16 border-r border-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: "linear-gradient(rgba(249,115,22,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
          <div className="scanline" />

          <div className="relative z-10 mb-12">
            <p className="text-orange-500 text-xs tracking-[0.3em] uppercase font-medium mb-4">— Portfolio</p>
            <h1 className="text-5xl font-black leading-none tracking-tight">
              Our<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Work</span>
            </h1>
            <div className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-5" />
            <p className="text-zinc-500 text-sm leading-relaxed mt-4">
              A timeline of projects built across the years.
            </p>
          </div>

          {/* Year filter nav */}
          <nav className="relative z-10 flex flex-col gap-2">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.25em] mb-3">Jump to year</p>
            {loading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-zinc-900/60 animate-pulse" />
                ))}
              </div>
            ) : (
              years.map((year) => {
                const count    = projects[year].length;
                const isActive = activeYear === year;
                return (
                  <button
                    key={year}
                    onClick={() => jumpToYear(year)}
                    className={`group flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 text-left ${
                      isActive
                        ? "bg-orange-500/10 border-orange-500/40"
                        : "border-transparent hover:border-zinc-800 hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-1 h-6 rounded-full transition-all duration-300 ${
                        isActive ? "bg-orange-500" : "bg-zinc-800 group-hover:bg-zinc-600"
                      }`} />
                      <span className={`text-2xl font-black tracking-tight transition-colors duration-300 ${
                        isActive ? "text-orange-400" : "text-zinc-500 group-hover:text-zinc-300"
                      }`}>{year}</span>
                    </div>
                    <span className={`text-xs font-mono transition-colors duration-300 ${
                      isActive ? "text-orange-400" : "text-zinc-700 group-hover:text-zinc-500"
                    }`}>
                      {count} project{count !== 1 ? "s" : ""}
                    </span>
                  </button>
                );
              })
            )}
          </nav>

          {/* Stats */}
          <div className="relative z-10 mt-auto pt-6 border-t border-zinc-800 flex gap-8">
            <div>
              <div className="text-2xl font-black text-orange-400">{allProjects.length}</div>
              <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono">Projects</div>
            </div>
            <div>
              <div className="text-2xl font-black text-orange-400">{years.length}</div>
              <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono">Years</div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT SCROLLABLE PANEL ── */}
        <section ref={scrollRef} className="flex-1 relative overflow-y-auto px-16" style={{ scrollbarWidth: "none" }}>
          <svg
            ref={svgRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-10"
            style={{ height: "100%", overflow: "visible", position: "absolute" }}
          >
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#f97316" stopOpacity="0.2" />
                <stop offset="50%"  stopColor="#f97316" stopOpacity="1"   />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path ref={pathRef} d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <div className="pt-36 pb-32">

            {/* LOADING STATE */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-zinc-800 border-t-orange-500 spinner" />
                <p className="text-zinc-600 text-sm font-mono">Loading projects...</p>
              </div>
            )}

            {/* ERROR STATE */}
            {error && (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                <div className="text-4xl">⚠️</div>
                <p className="text-red-400 font-semibold">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs font-mono text-orange-500 border border-orange-500/30 px-4 py-2 rounded-lg hover:bg-orange-500/10 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* PROJECTS */}
            {!loading && !error && (
              <ul className="relative space-y-24">
                {Object.entries(projects).map(([year, list]) => (
                  <li key={year} ref={(el) => { if (el) yearRefs.current.set(year, el); }}>

                    {/* Year marker */}
                    <div className="flex items-center justify-center mb-16 relative z-20">
                      <div className="px-6 py-2 rounded-full border border-orange-500/30 bg-black text-orange-400 font-black text-2xl tracking-tight shadow-lg shadow-orange-900/20">
                        {year}
                      </div>
                    </div>

                    <ul className="space-y-20">
                      {list.map((item, index) => {
                        const globalIdx = allProjects.findIndex(
                          (p) => p.year === year && p.project.id === item.id
                        );
                        const isLeft = index % 2 === 0;

                        return (
                          <li key={item.id} className="relative grid grid-cols-[1fr_48px_1fr] items-center proj-card">

                            {/* LEFT CARD */}
                            <div className={isLeft ? "pr-8" : "opacity-0 pointer-events-none"}>
                              {isLeft && (
                                <div className="card-hover bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
                                  <div className="relative h-36 w-full">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                                    <span className="absolute top-3 right-3 text-[10px] font-mono text-orange-400/70 border border-orange-500/20 bg-black/60 px-2 py-0.5 rounded">
                                      #{String(globalIdx + 1).padStart(2, "0")}
                                    </span>
                                  </div>
                                  <div className="p-5 text-right">
                                    <h3 className="text-base font-black text-white">{item.name}</h3>
                                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.description}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* CENTER DOT */}
                            <div className="flex items-center justify-center relative z-20">
                              <div ref={(el) => { if (el) dotMap.current.set(globalIdx, el); }} className="proj-dot proj-dot-wrap relative">
                                <div className="proj-dot-ring" />
                                <div className="w-4 h-4 rounded-full bg-zinc-900 border-2 border-orange-500 transition-all duration-300 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/40" />
                              </div>
                            </div>

                            {/* RIGHT CARD */}
                            <div className={!isLeft ? "pl-8" : "opacity-0 pointer-events-none"}>
                              {!isLeft && (
                                <div className="card-hover bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
                                  <div className="relative h-36 w-full">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                                    <span className="absolute top-3 left-3 text-[10px] font-mono text-orange-400/70 border border-orange-500/20 bg-black/60 px-2 py-0.5 rounded">
                                      #{String(globalIdx + 1).padStart(2, "0")}
                                    </span>
                                  </div>
                                  <div className="p-5">
                                    <h3 className="text-base font-black text-white">{item.name}</h3>
                                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.description}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </>
  );
}