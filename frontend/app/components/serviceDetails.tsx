"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import data from "../../data/ServiceDetails.json";

// ─── Types ────────────────────────────────────────────────────────────────────

type ServiceType = {
  id: number;
  name: string;
  image: string;
  description: string;
  subservices: string[];
  prices: number[];
};

type ContactForm = {
  name: string;
  email: string;
  phone: string;
};

type Step = "service" | "contact" | "share";

// ─── Constants ────────────────────────────────────────────────────────────────

const WA_NUMBER = "237650812141"; // WhatsApp Business number

// ─── Icons ────────────────────────────────────────────────────────────────────

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

// ─── PDF Generator ────────────────────────────────────────────────────────────

async function generateQuotePDF(
  service: ServiceType,
  selectedIndexes: number[],
  total: number,
  contact: ContactForm
): Promise<{ base64: string; blob: Blob }> {
  const { jsPDF } = await import("jspdf/dist/jspdf.umd.min.js");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210;
  const margin = 20;
  let y = 0;

  // ── HEADER BACKGROUND ──
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, W, 50, "F");

  // Orange accent bar
  doc.setFillColor(249, 115, 22);
  doc.rect(0, 0, 4, 50, "F");

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("FreudeDev", margin + 4, 20);

  // Tagline
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(161, 161, 170);
  doc.text("IT Maintenance  •  Web Design  •  Network Administration", margin + 4, 28);

  // QUOTE label
  doc.setFontSize(10);
  doc.setTextColor(249, 115, 22);
  doc.setFont("helvetica", "bold");
  doc.text("SERVICE QUOTE", W - margin, 20, { align: "right" });

  // Date
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(161, 161, 170);
  doc.text(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), W - margin, 28, { align: "right" });

  y = 62;

  // ── CLIENT INFO ──
  doc.setFillColor(24, 24, 27);
  doc.roundedRect(margin, y, W - margin * 2, 36, 3, 3, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(249, 115, 22);
  doc.text("PREPARED FOR", margin + 6, y + 8);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(contact.name, margin + 6, y + 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(161, 161, 170);
  doc.text(`${contact.email}   •   ${contact.phone}`, margin + 6, y + 27);

  y += 48;

  // ── SERVICE NAME ──
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(249, 115, 22);
  doc.text("SERVICE REQUESTED", margin, y);
  y += 6;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(service.name, margin, y);
  y += 5;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(113, 113, 122);
  doc.text(service.description, margin, y);
  y += 12;

  // ── DIVIDER ──
  doc.setDrawColor(39, 39, 42);
  doc.setLineWidth(0.5);
  doc.line(margin, y, W - margin, y);
  y += 10;

  // ── TABLE HEADER ──
  doc.setFillColor(24, 24, 27);
  doc.rect(margin, y, W - margin * 2, 10, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(113, 113, 122);
  doc.text("SUBSERVICE", margin + 4, y + 7);
  doc.text("PRICE (FCFA)", W - margin - 4, y + 7, { align: "right" });
  y += 14;

  // ── TABLE ROWS ──
  selectedIndexes.forEach((idx, i) => {
    const isEven = i % 2 === 0;
    if (isEven) {
      doc.setFillColor(18, 18, 20);
      doc.rect(margin, y - 4, W - margin * 2, 12, "F");
    }

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(228, 228, 231);
    doc.text(service.subservices[idx], margin + 4, y + 3);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(249, 115, 22);
    doc.text(service.prices[idx].toLocaleString(), W - margin - 4, y + 3, { align: "right" });

    y += 12;
  });

  y += 4;

  // ── DIVIDER ──
  doc.setDrawColor(39, 39, 42);
  doc.line(margin, y, W - margin, y);
  y += 8;

  // ── TOTAL ──
  doc.setFillColor(249, 115, 22);
  doc.roundedRect(W - margin - 70, y, 70, 18, 2, 2, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL", W - margin - 65, y + 7);

  doc.setFontSize(13);
  doc.text(`${total.toLocaleString()} FCFA`, W - margin - 4, y + 13, { align: "right" });

  y += 30;

  // ── NOTES ──
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(113, 113, 122);
  doc.text("This quote is valid for 30 days. Prices are estimates and may vary based on project scope.", margin, y);
  y += 5;
  doc.text("Contact us to finalise your order and schedule a consultation.", margin, y);

  // ── FOOTER ──
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 282, W, 15, "F");
  doc.setFillColor(249, 115, 22);
  doc.rect(0, 282, 4, 15, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(113, 113, 122);
  doc.text("FreudeDev  •  +237 650 812 141  •  Efficient Services at your disposal", W / 2, 291, { align: "center" });

  const base64 = doc.output("datauristring").split(",")[1];
  const blob = doc.output("blob");
  return { base64, blob };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Service() {
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [glowVisible, setGlowVisible] = useState(false);
  const [step, setStep] = useState<Step>("service");
  const [contact, setContact] = useState<ContactForm>({ name: "", email: "", phone: "" });
  const [sending, setSending] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>("");

  const modalRef    = useRef<HTMLDivElement | null>(null);
  const modalBoxRef = useRef<HTMLDivElement | null>(null);
  const glowRef     = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeService && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" }
      );
    }
  }, [activeService]);

  const handleClose = () => {
    if (!modalRef.current) return;
    gsap.to(modalRef.current, {
      y: 40, opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        setActiveService(null);
        setSelected([]);
        setGlowVisible(false);
        setStep("service");
        setContact({ name: "", email: "", phone: "" });
        setPdfBlob(null);
        setPdfBase64("");
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
    gsap.to(glowRef.current, { x: e.clientX - r.left - 150, y: e.clientY - r.top - 150, duration: 0.4 });
  };

  const total = selected.reduce((sum, i) => sum + (activeService?.prices[i] ?? 0), 0);

  // Step 1 → 2: open contact form
  const handleRequestPackage = () => setStep("contact");

  // Step 2 → 3: generate PDF then show share options
  const handleGeneratePDF = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService) return;
    setSending(true);
    try {
      const { base64, blob } = await generateQuotePDF(activeService, selected, total, contact);
      setPdfBase64(base64);
      setPdfBlob(blob);
      setStep("share");
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
    setSending(false);
  };

  // Download PDF helper
  const downloadPDF = () => {
    if (!pdfBlob || !activeService) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FreudeDev_Quote_${contact.name.replace(/\s+/g, "_")}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // WhatsApp: download PDF + open WA with pre-filled message
  const handleWhatsApp = () => {
    downloadPDF();
    const servicesList = selected
      .map((i) => `• ${activeService?.subservices[i]} — ${activeService?.prices[i].toLocaleString()} FCFA`)
      .join("\n");

    const message = encodeURIComponent(
      `Hello FreudeDev! 👋\n\nI'm ${contact.name} and I'd like to request a quote for *${activeService?.name}*.\n\n*Selected Services:*\n${servicesList}\n\n*Total:* ${total.toLocaleString()} FCFA\n\n📧 ${contact.email}\n📞 ${contact.phone}\n\nI've also downloaded the PDF quote. Please get back to me at your earliest convenience!`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, "_blank");
  };

  // Email: send PDF via backend → Nodemailer
  const handleEmail = async () => {
    if (!activeService || !pdfBase64) return;
    setSending(true);
    try {
      const selectedServices = selected.map((i) => ({
        name: activeService.subservices[i],
        price: activeService.prices[i],
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: contact.name,
          clientEmail: contact.email,
          clientPhone: contact.phone,
          serviceName: activeService.name,
          selectedServices,
          total,
          pdfBase64,
        }),
      });

      if (res.ok) {
        alert(`✅ Quote sent successfully!\nCheck your inbox at ${contact.email}`);
        handleClose();
      } else {
        const data = await res.json();
        alert(`❌ Failed to send: ${data.message || 'Unknown error occurred'}`);
      }
    } catch (err) {
      alert("❌ Could not reach the server. Is the backend running?");
    }
    setSending(false);
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
          position: absolute; inset: 0;
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
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #f97316, transparent);
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-6 mb-16">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-8">
          <div>
            <p className="text-orange-500 text-xs tracking-[0.3em] uppercase font-medium mb-3">— What we offer</p>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight">
              Our<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Services</span>
            </h1>
          </div>
          <p className="hidden md:block max-w-xs text-zinc-500 text-sm text-right leading-relaxed">
            Select a service below to explore our offerings and build your custom package.
          </p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.services.map((item, i) => (
          <button
            key={item.id}
            onClick={() => { setActiveService(item); setStep("service"); }}
            className="card-enter group relative text-left rounded-2xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 transition-all duration-500 bg-zinc-950"
            style={{ animationDelay: `${i * 0.12}s`, opacity: 0 }}
          >
            <div className="relative h-56 overflow-hidden">
              <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="scanline" />
              <span className="absolute top-4 right-4 text-xs font-mono text-orange-500/60 border border-orange-500/20 px-2 py-1 rounded">0{item.id}</span>
            </div>
            <div className="relative p-6 grid-bg">
              <div className="ticker-line" />
              <div className="flex items-start gap-4 mb-4">
                <div className="text-orange-500 mt-0.5 shrink-0">{icons[item.name]}</div>
                <div>
                  <h2 className="text-xl font-black text-white leading-tight group-hover:text-orange-400 transition-colors duration-300">{item.name}</h2>
                  <p className="text-zinc-500 text-sm mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {item.subservices.slice(0, 3).map((sub, idx) => (
                  <span key={idx} className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 border border-zinc-800 group-hover:border-orange-500/30 group-hover:text-orange-300/70 px-2 py-1 rounded transition-all duration-300">{sub}</span>
                ))}
                {item.subservices.length > 3 && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-orange-500/60 border border-orange-500/20 px-2 py-1 rounded">+{item.subservices.length - 3} more</span>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-zinc-600 font-mono">From {Math.min(...item.prices).toLocaleString()} FCFA</span>
                <div className="flex items-center gap-2 text-orange-500 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── MODAL ── */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={handleClose} />

          <div ref={modalRef} className="relative z-10 w-full max-w-5xl max-h-[94vh] md:max-h-none overflow-y-auto">
            <div
              ref={modalBoxRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setGlowVisible(true)}
              onMouseLeave={() => setGlowVisible(false)}
              className="relative rounded-2xl overflow-hidden border border-zinc-800"
              style={{ background: "#0a0a0a" }}
            >
              {/* GLOW */}
              <div ref={glowRef} className={`pointer-events-none absolute size-[300px] rounded-full blur-3xl transition-opacity duration-300 ${glowVisible ? "opacity-30" : "opacity-0"} bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400`} />

              <div className="relative z-10 grid md:grid-cols-[1fr_1.4fr]">

                {/* LEFT — SERVICE IDENTITY */}
                <div className="relative flex flex-col justify-between p-5 md:p-10 overflow-hidden min-h-[220px] md:min-h-[340px]">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${activeService.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-orange-950/60" />
                  <div className="scanline" />

                  <div className="relative z-10">
                    <span className="text-xs font-mono text-orange-400 tracking-[0.25em] uppercase">Service 0{activeService.id}</span>
                  </div>

                  <div className="relative z-10 mt-auto">
                    <div className="text-orange-500 mb-4">{icons[activeService.name]}</div>
                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">{activeService.name}</h2>
                    <p className="text-zinc-300 text-sm leading-relaxed max-w-xs">{activeService.description}</p>
                  </div>

                  <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex gap-8">
                    <div>
                      <div className="text-2xl font-black text-orange-400">{activeService.subservices.length}</div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">Subservices</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-orange-400">{Math.min(...activeService.prices).toLocaleString()}</div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">Min. FCFA</div>
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL — changes per step */}
                <div className="p-5 md:p-10 border-t md:border-t-0 md:border-l border-zinc-800/80">

                  {/* ── STEP 1: Service selector ── */}
                  {step === "service" && (
                    <>
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-white font-black text-xl">Build your package</h3>
                          <p className="text-zinc-500 text-xs mt-1">Select the services you need</p>
                        </div>
                        <button onClick={handleClose} className="text-zinc-600 hover:text-white transition p-2 rounded-lg hover:bg-zinc-800">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-[1fr_auto] text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 border-b border-zinc-800 pb-3 mb-3 px-1">
                        <span>Service</span>
                        <span>Price (FCFA)</span>
                      </div>

                      <ul className="space-y-2">
                        {activeService.subservices.map((sub, index) => {
                          const checked = selected.includes(index);
                          return (
                            <li key={index} onClick={() => toggleSubservice(index)}
                              className={`grid grid-cols-[20px_1fr_auto] items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 ${checked ? "bg-orange-500/10 border border-orange-500/40" : "border border-transparent hover:border-zinc-700 hover:bg-zinc-900"}`}>
                              <div className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all duration-200 shrink-0 ${checked ? "border-orange-500 bg-orange-500" : "border-zinc-600"}`}>
                                {checked && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className={`text-sm transition-colors duration-200 ${checked ? "text-white font-medium" : "text-zinc-400"}`}>{sub}</span>
                              <span className={`text-sm font-mono font-bold transition-colors duration-200 ${checked ? "text-orange-400" : "text-zinc-600"}`}>{activeService.prices[index].toLocaleString()}</span>
                            </li>
                          );
                        })}
                      </ul>

                      <div className={`mt-6 overflow-hidden transition-all duration-300 ${selected.length > 0 ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                          <div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider font-mono">Total</div>
                            <div className="text-2xl font-black text-white mt-0.5">
                              {total.toLocaleString()}<span className="text-orange-500 text-sm font-mono ml-1">FCFA</span>
                            </div>
                          </div>
                          <div className="text-xs text-zinc-600 font-mono">{selected.length} item{selected.length !== 1 ? "s" : ""}</div>
                        </div>
                      </div>

                      <button onClick={handleRequestPackage} disabled={selected.length === 0}
                        className={`mt-6 w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${selected.length > 0 ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-900/40" : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800"}`}>
                        {selected.length === 0 ? "Select services to continue" : "Request this package →"}
                      </button>
                    </>
                  )}

                  {step === "contact" && (
                    <form onSubmit={handleGeneratePDF} className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-white font-black text-xl">Your details</h3>
                          <p className="text-zinc-500 text-xs mt-1">We'll use this to prepare your quote</p>
                        </div>
                        <button type="button" onClick={() => setStep("service")} className="text-zinc-600 hover:text-white transition p-2 rounded-lg hover:bg-zinc-800 text-xs font-mono">
                          ← Back
                        </button>
                      </div>

                      {/* Quote summary */}
                      <div className="bg-zinc-900 rounded-xl p-4 mb-6 border border-zinc-800">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">Your selection</p>
                        {selected.map((i) => (
                          <div key={i} className="flex justify-between text-xs py-1">
                            <span className="text-zinc-300">{activeService.subservices[i]}</span>
                            <span className="text-orange-400 font-mono">{activeService.prices[i].toLocaleString()} FCFA</span>
                          </div>
                        ))}
                        <div className="flex justify-between border-t border-zinc-700 mt-2 pt-2">
                          <span className="text-xs font-black text-white uppercase tracking-wider">Total</span>
                          <span className="text-orange-400 font-black text-sm">{total.toLocaleString()} FCFA</span>
                        </div>
                      </div>

                      <div className="space-y-4 flex-1">
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">Full Name *</label>
                          <input required value={contact.name} onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
                            placeholder="John Doe"
                            className="w-full bg-zinc-900 border border-zinc-700 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-zinc-600" />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">Email Address *</label>
                          <input required type="email" value={contact.email} onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                            placeholder="john@example.com"
                            className="w-full bg-zinc-900 border border-zinc-700 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-zinc-600" />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">Phone Number *</label>
                          <input required value={contact.phone} onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                            placeholder="+237 6XX XXX XXX"
                            className="w-full bg-zinc-900 border border-zinc-700 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-zinc-600" />
                        </div>
                      </div>

                      <button type="submit" disabled={sending}
                        className="mt-6 w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-900/40 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
                        {sending ? (
                          <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Generating PDF...</>
                        ) : "Generate Quote PDF →"}
                      </button>
                    </form>
                  )}

                  {/* ── STEP 3: Share options ── */}
                  {step === "share" && (
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-white font-black text-xl">Send your quote</h3>
                          <p className="text-zinc-500 text-xs mt-1">Choose how to reach us</p>
                        </div>
                        <button onClick={handleClose} className="text-zinc-600 hover:text-white transition p-2 rounded-lg hover:bg-zinc-800">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* PDF ready badge */}
                      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-6">
                        <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="text-green-400 text-sm font-semibold">PDF Quote Ready</p>
                          <p className="text-zinc-500 text-xs">Prepared for {contact.name}</p>
                        </div>
                        <button onClick={downloadPDF} className="ml-auto text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                      </div>

                      {/* Quote mini summary */}
                      <div className="bg-zinc-900 rounded-xl p-4 mb-6 border border-zinc-800">
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">{activeService.name} — {selected.length} service{selected.length !== 1 ? "s" : ""}</p>
                        <div className="flex justify-between">
                          <span className="text-xs font-black text-white uppercase tracking-wider">Total</span>
                          <span className="text-orange-400 font-black text-sm">{total.toLocaleString()} FCFA</span>
                        </div>
                      </div>

                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-3">Send via</p>

                      {/* WhatsApp button */}
                      <button onClick={handleWhatsApp}
                        className="w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all duration-300 shadow-lg shadow-green-900/30 mb-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Send via WhatsApp
                        <span className="text-xs font-normal opacity-75">(PDF auto-downloads)</span>
                      </button>

                      {/* Email button */}
                      <button onClick={handleEmail} disabled={sending}
                        className="w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white transition-all duration-300 border border-zinc-700 disabled:opacity-50">
                        {sending ? (
                          <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Sending...</>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Send via Email
                            <span className="text-xs font-normal opacity-75">(PDF attached)</span>
                          </>
                        )}
                      </button>

                      <p className="text-[10px] text-zinc-600 text-center mt-4">
                        WhatsApp opens in a new tab. Email sends directly to {contact.email} and our team.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}