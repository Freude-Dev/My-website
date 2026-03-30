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

type Category = "Web Design" | "Network Administration" | "IT";

type Project = {
  id: string;
  name: string;
  image_url: string | null;
  description: string;
  year: number;
  category: Category;
};

const CATEGORIES: {
  value: Category;
  label: string;
  color: string;
  activeBg: string;
  activeBorder: string;
  lineFrom: string;
  lineTo: string;
  icon: string;
}[] = [
  {
    value: "Web Design",
    label: "Web Design",
    color: "text-orange-400",
    activeBg: "bg-orange-500/10",
    activeBorder: "border-orange-500/40",
    lineFrom: "#f97316",
    lineTo: "#f59e0b",
    icon: "🌐",
  },
  {
    value: "Network Administration",
    label: "Network Admin",
    color: "text-blue-400",
    activeBg: "bg-blue-500/10",
    activeBorder: "border-blue-500/40",
    lineFrom: "#3b82f6",
    lineTo: "#6366f1",
    icon: "🔗",
  },
  {
    value: "IT",
    label: "IT Maintenance",
    color: "text-purple-400",
    activeBg: "bg-purple-500/10",
    activeBorder: "border-purple-500/40",
    lineFrom: "#a855f7",
    lineTo: "#ec4899",
    icon: "🖥️",
  },
];

export default function ProjectsPage() {
  const pageRef   = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const svgRef    = useRef<SVGSVGElement>(null);
  const pathRef   = useRef<SVGPathElement>(null);
  const dotMap    = useRef<Map<number, HTMLDivElement>>(new Map());
  const yearRefs  = useRef<Map<string, HTMLElement>>(new Map());

  const [projects, setProjects]         = useState<Project[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [pathD, setPathD]               = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("Web Design");
  const [activeYear, setActiveYear]     = useState<string>("");

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();

        // Flatten grouped-by-year response into a flat array
        const flat: Project[] = [];
        for (const list of Object.values(data.Projects ?? {})) {
          flat.push(...(list as Project[]));
        }
        setProjects(flat);
      } catch {
        setError("Could not load projects. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filter by active category then group by year (ascending)
  const filtered = projects.filter((p) => p.category === activeCategory);
  const byYear: Record<string, Project[]> = {};
  for (const p of filtered) {
    const y = String(p.year);
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(p);
  }
  const years = Object.keys(byYear).sort((a, b) => Number(a) - Number(b));

  // Flat list within the active category for global dot indexing
  const flatFiltered: Project[] = years.flatMap((y) => byYear[y]);

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
    else setPathD("");
  }, []);

  // Recompute when category changes
  useEffect(() => {
    if (loading) return;
    dotMap.current.clear();
    yearRefs.current.clear();
    setPathD("");
    setActiveYear(years[0] ?? "");
    const id = requestAnimationFrame(() => requestAnimationFrame(computePath));
    return () => cancelAnimationFrame(id);
  }, [computePath, loading, activeCategory]);

  // Direct scroll → line draw
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

  // GSAP animations
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

      // Track active year via scroll
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
  }, [pathD, activeCategory, loading]);

  const catConfig = CATEGORIES.find((c) => c.value === activeCategory)!;

  const jumpToCategory = (cat: Category) => {
    setActiveCategory(cat);
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          border: 2px solid currentColor;
          opacity: 0; transform: scale(0.6);
          transition: all 0.3s ease;
        }
        .proj-dot-wrap:hover .proj-dot-ring { opacity: 1; transform: scale(1); }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        section::-webkit-scrollbar { display: none; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cat-enter { animation: fadeIn 0.35s ease forwards; }
      `}</style>

      <div ref={pageRef} className="h-[calc(100vh-80px)] mt-20 mx-4 md:mx-8 lg:mx-40 rounded-2xl overflow-hidden flex bg-black text-white border border-zinc-800/60">

        
        <aside className="w-full min-w-[20vw] md:w-[300px] shrink-0 flex flex-col px-2 md:px-8 py-16 border-r border-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: "linear-gradient(rgba(249,115,22,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
          <div className="scanline" />

          {/* Header */}
          <div className="relative z-10 mb-10">
            <p className="text-orange-500 text-xs tracking-[0.3em] uppercase font-medium mb-4">— Portfolio</p>
            <h1 className="text-5xl font-black leading-none tracking-tight">
              Our<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Work</span>
            </h1>
            <div className="w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-5" />
          </div>

          {/* Category filter */}
          <nav className="relative z-10 flex flex-col gap-2">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.25em] mb-2">Category</p>
            <div className="md:hidden flex gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map((cat) => {
                const count = projects.filter((p) => p.category === cat.value).length;
                const isActive = activeCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => jumpToCategory(cat.value)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg border transition-all duration-300 text-center whitespace-nowrap ${
                      isActive ? `${cat.activeBg} ${cat.activeBorder}` : "border-transparent hover:border-zinc-800 hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className={`text-xs font-black transition-colors duration-300 ${isActive ? cat.color : "text-zinc-500 group-hover:text-zinc-300"}`}>
                      {cat.icon}
                    </div>
                    <div className={`text-[10px] font-mono transition-colors duration-300 ${isActive ? "text-zinc-400" : "text-zinc-700 group-hover:text-zinc-500"}`}>
                      {count}
                    </div>
                  </button>
                );
              })}
            </div>
            {CATEGORIES.map((cat) => {
              const count    = projects.filter((p) => p.category === cat.value).length;
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => jumpToCategory(cat.value)}
                  className={`group flex items-center justify-between px-3 md:px-4 py-3 rounded-xl border transition-all duration-300 text-left ${
                    isActive ? `${cat.activeBg} ${cat.activeBorder}` : "border-transparent hover:border-zinc-800 hover:bg-zinc-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-1 h-6 md:h-7 rounded-full transition-all duration-300"
                      style={isActive
                        ? { background: `linear-gradient(to bottom, ${cat.lineFrom}, ${cat.lineTo})` }
                        : { background: "#27272a" }
                      }
                    />
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3">
                      <div className={`text-sm font-black transition-colors duration-300 ${isActive ? cat.color : "text-zinc-500 group-hover:text-zinc-300"}`}>
                        {cat.icon} <span className="hidden md:inline">{cat.label}</span>
                      </div>
                      <div className={`text-[10px] font-mono mt-0.5 md:mt-0 transition-colors duration-300 ${isActive ? "text-zinc-400" : "text-zinc-700 group-hover:text-zinc-500"}`}>
                        {count} project{count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.lineFrom }} />}
                </button>
              );
            })}
          </nav>

          {/* Year jump nav — only shown when there are years */}
          {!loading && years.length > 0 && (
            <nav className="relative z-10 flex flex-col gap-1 mt-6">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.25em] mb-2">Jump to year</p>
              {years.map((year) => {
                const isActive = activeYear === year;
                return (
                  <button
                    key={year}
                    onClick={() => jumpToYear(year)}
                    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 rounded-lg border transition-all duration-200 text-left ${
                      isActive ? "border-zinc-700 bg-zinc-900/60" : "border-transparent hover:border-zinc-800 hover:bg-zinc-900/40"
                    }`}
                  >
                    <div className="w-1 h-3 md:h-4 rounded-full transition-all duration-200"
                      style={isActive ? { background: catConfig.lineFrom } : { background: "#3f3f46" }}
                    />
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3">
                      <span className={`text-lg md:text-xl font-black tracking-tight transition-colors duration-200 ${
                        isActive ? "text-white" : "text-zinc-600 hover:text-zinc-400"
                      }`}>{year}</span>
                      <span className="text-[10px] font-mono text-zinc-700 md:ml-auto">
                        {byYear[year]?.length ?? 0}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Stats */}
          <div className="relative z-10 mt-auto pt-6 border-t border-zinc-800 flex gap-8">
            <div>
              <div className="text-2xl font-black text-orange-400">{projects.length}</div>
              <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono">Total</div>
            </div>
            <div>
              <div className="text-2xl font-black" style={{ color: catConfig.lineFrom }}>{filtered.length}</div>
              <div className="text-xs text-zinc-600 uppercase tracking-wider font-mono">{catConfig.label}</div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT SCROLLABLE PANEL ── */}
        <section ref={scrollRef} className="flex-1 relative overflow-y-auto px-6 md:px-16" style={{ scrollbarWidth: "none" }}>
          <svg ref={svgRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-10"
            style={{ height: "100%", overflow: "visible", position: "absolute" }}
          >
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={catConfig.lineFrom} stopOpacity="0.2" />
                <stop offset="50%"  stopColor={catConfig.lineFrom} stopOpacity="1"   />
                <stop offset="100%" stopColor={catConfig.lineTo}   stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path ref={pathRef} d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <div className="pt-36 pb-32">

            {/* LOADING */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-zinc-800 border-t-orange-500 animate-spin" />
                <p className="text-zinc-600 text-sm font-mono">Loading projects...</p>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                <div className="text-4xl">⚠️</div>
                <p className="text-red-400 font-semibold">{error}</p>
                <button onClick={() => window.location.reload()}
                  className="text-xs font-mono text-orange-500 border border-orange-500/30 px-4 py-2 rounded-lg hover:bg-orange-500/10 transition">
                  Retry
                </button>
              </div>
            )}

            {/* PROJECTS grouped by year */}
            {!loading && !error && (
              <div key={activeCategory} className="cat-enter">

                {/* Empty state */}
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-3 text-zinc-600 text-center">
                    <span className="text-4xl opacity-30">{catConfig.icon}</span>
                    <p className="text-sm font-mono">No {catConfig.label} projects yet.</p>
                  </div>
                ) : (
                  <ul className="relative space-y-24">
                    {years.map((year) => {
                      const yearProjects = byYear[year];
                      return (
                        <li key={year} ref={(el) => { if (el) yearRefs.current.set(year, el); }}>

                          {/* Year marker */}
                          <div className="flex items-center justify-center mb-16 relative z-20">
                            <div className="px-6 py-2 rounded-full border bg-black font-black text-2xl tracking-tight shadow-lg"
                              style={{
                                borderColor: catConfig.lineFrom + "40",
                                color: catConfig.lineFrom,
                                boxShadow: `0 0 24px ${catConfig.lineFrom}15`,
                              }}>
                              {year}
                            </div>
                          </div>

                          <ul className="space-y-20">
                            {yearProjects.map((item, index) => {
                              const globalIdx = flatFiltered.findIndex((p) => p.id === item.id);
                              const isLeft = index % 2 === 0;

                              return (
                                <li key={item.id} className="relative proj-card">

                                  {/* MOBILE: Single Card */}
                                  <div className="md:hidden w-full mb-8">
                                    <div className="card-hover bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden"
                                      style={{ ['--hover-border' as string]: catConfig.lineFrom + "50" }}>
                                      <div className="relative h-36 w-full bg-zinc-900">
                                        {item.image_url ? (
                                          <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs font-mono">No image</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                                        <span className="absolute top-3 right-3 text-[10px] font-mono text-zinc-400 border border-zinc-700 bg-black/60 px-2 py-0.5 rounded">
                                          #{String(globalIdx + 1).padStart(2, "0")}
                                        </span>
                                      </div>
                                      <div className="p-5">
                                        <h3 className="text-base font-black text-white">{item.name}</h3>
                                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.description}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* DESKTOP: Grid Layout */}
                                  <div className="hidden md:grid grid-cols-[1.5fr_40px_1.5fr] items-center w-full gap-8">
                                    {/* DESKTOP: Left Card */}
                                    <div className="pr-6">
                                      {isLeft && (
                                        <div className="card-hover bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden"
                                          style={{ ['--hover-border' as string]: catConfig.lineFrom + "50" }}>
                                          <div className="relative h-40 w-full bg-zinc-900">
                                            {item.image_url ? (
                                              <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs font-mono">No image</div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                                            <span className="absolute top-3 right-3 text-[10px] font-mono text-zinc-400 border border-zinc-700 bg-black/60 px-2 py-0.5 rounded">
                                              #{String(globalIdx + 1).padStart(2, "0")}
                                            </span>
                                          </div>
                                          <div className="p-6 text-right">
                                            <h3 className="text-lg font-black text-white">{item.name}</h3>
                                            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{item.description}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* DESKTOP: Center Dot */}
                                    <div className="flex items-center justify-center relative z-20">
                                      <div
                                        ref={(el) => { if (el) dotMap.current.set(globalIdx, el); }}
                                        className="proj-dot proj-dot-wrap relative"
                                        style={{ color: catConfig.lineFrom }}
                                      >
                                        <div className="proj-dot-ring" />
                                        <div className="w-5 h-5 rounded-full bg-zinc-900 border-2 transition-all duration-300"
                                          style={{ borderColor: catConfig.lineFrom }} />
                                      </div>
                                    </div>

                                    {/* DESKTOP: Right Card */}
                                    <div className="pl-6">
                                      {!isLeft && (
                                        <div className="card-hover bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
                                          <div className="relative h-40 w-full bg-zinc-900">
                                            {item.image_url ? (
                                              <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs font-mono">No image</div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                                            <span className="absolute top-3 left-3 text-[10px] font-mono text-zinc-400 border border-zinc-700 bg-black/60 px-2 py-0.5 rounded">
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
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}