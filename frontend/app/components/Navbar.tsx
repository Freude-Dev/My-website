"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import logod from "../../public/icons/logo-desktop.png";
import logop from "../../public/icons/logo-phone.png";
import Button from "./button";
import { SiWhatsapp } from "react-icons/si";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const links = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
  ];

  useEffect(() => {
    if (showModal && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.85, opacity: 0, transformOrigin: "center center" },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [showModal]);

  const closeModal = () => {
    if (!modalRef.current || !backdropRef.current) return;

    gsap.to(modalRef.current, {
      scale: 0.85,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setShowModal(false),
    });

    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    });
  };

  return (
    <>
      <nav
        className="
          fixed top-[3%] flex items-center justify-between
          w-[90%] md:w-auto
          mx-2 md:mx-4
          px-4 md:px-6 py-4
          rounded-4xl md:rounded-full
          border border-slate-700
          bg-black/70 backdrop-blur-xl
          text-white text-sm
        "
      >
        <Link href="/" onClick={() => setIsOpen(false)}>
          <Image src={logod} alt="Logo" className="hidden md:block w-25 h-15" />
          <Image src={logop} alt="Logo" className="md:hidden w-12 h-10" />
        </Link>

        <div className="hidden md:flex items-center gap-6 ml-35 mr-20">
          {links.map(({ label, href }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className="relative overflow-hidden h-6 group"
              >
                <span
                  className={`block transition-transform duration-300 ${
                    isActive
                      ? "-translate-y-full"
                      : "group-hover:-translate-y-full"
                  }`}
                >
                  {label}
                </span>

                <span
                  className={`block absolute top-full left-0 transition-transform duration-300 text-orange-400 ${
                    isActive
                      ? "-translate-y-full"
                      : "group-hover:-translate-y-full"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button
            icon={SiWhatsapp}
            onClick={() => setShowModal(true)}
            className="flex gap-2 shadow-[0px_0px_10px_2px] shadow-orange-400 hover:bg-orange-600 px-4 py-2 rounded-full transition duration-300"
          >
            Contact Us
          </Button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-2xl"
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>

        <div
          className={`absolute top-full left-0 w-full mt-3 rounded-2xl
          bg-black/90 backdrop-blur-xl border border-slate-700
          transition-all duration-300 overflow-hidden md:hidden
          ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="flex flex-col items-center gap-6 py-6">
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`text-lg ${
                  pathname === href ? "text-orange-400" : "text-white"
                }`}
              >
                {label}
              </Link>
            ))}

            <Button
              icon={SiWhatsapp}
              onClick={() => setShowModal(true)}
              className="flex gap-2 shadow-[0px_0px_10px_2px] shadow-orange-400 hover:bg-orange-600 px-6 py-3 rounded-full transition duration-300"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </nav>

      {showModal && (
        <div
          ref={backdropRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl mx-4 border-2 border-orange-500 rounded-xl shadow-[0_0_30px_rgba(255,165,0,0.5)] overflow-hidden"
          >
            {/* Orange Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none size-140 bg-orange-500/20 rounded-full blur-[200px] animate-pulse"></div>

            
            

            <section className="flex flex-col md:flex-row justify-center px-4 py-12 gap-6 md:gap-10 relative z-10">
              
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 md:gap-6 mt-4 md:mt-0">
                <span className="text-orange-400 font-medium text-xs md:text-sm uppercase tracking-wide">
                  Book Your Free Consultation
                </span>

                <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug max-w-full md:max-w-[420px]">
                  Ready to Transform Your Digital Experience?
                </h1>

                <p className="text-white/80 text-sm md:text-base max-w-full md:max-w-[400px]">
                  Our team of expert networkers and designers will optimize elevates your brand, engages your audience, and drives conversions. Let’s build something extraordinary together.
                </p>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <img
                    className="size-6 md:size-7 rounded-full border border-orange-500"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
                    alt="user1"
                  />
                  <img
                    className="size-6 md:size-7 rounded-full border border-orange-500 -translate-x-2"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
                    alt="user2"
                  />
                  <img
                    className="size-6 md:size-7 rounded-full border border-orange-500 -translate-x-4"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                    alt="user3"
                  />
                  <p className="-translate-x-2 text-xs md:text-sm text-white/70">
                    Join a community of 1M+ founders
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full md:max-w-md rounded-xl bg-[#FF7F00]/10 backdrop-blur-sm border border-white/10 p-6 md:p-8 z-10 overflow-y-auto max-h-[90vh] relative">
                <form className="space-y-4 md:space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm text-white mb-1">First name</label>
                      <input type="text" placeholder="David" className="w-full px-3 py-2 md:py-3 border border-white/20 rounded-lg text-sm outline-none focus:border-orange-500 transition-colors"/>
                    </div>
                    <div>
                      <label className="block text-sm text-white mb-1">Last name</label>
                      <input type="text" placeholder="Andrew" className="w-full px-3 py-2 md:py-3 border border-white/20 rounded-lg text-sm outline-none focus:border-orange-500 transition-colors"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white mb-1">Email id</label>
                    <input type="email" placeholder="david@company.com" className="w-full px-3 py-2 md:py-3 border border-white/20 rounded-lg text-sm outline-none focus:border-orange-500 transition-colors"/>
                  </div>

                  <div>
                    <label className="block text-sm text-white mb-1">Phone number</label>
                    <div className="flex border border-white/20 rounded-lg overflow-hidden focus-within:border-orange-500 transition-colors">
                      <select className="px-2 md:px-3 py-2 md:py-3 text-sm outline-none cursor-pointer text-white bg-black/10 border-r border-white/20">
                        <option>CM</option>
                        <option>US</option>
                        <option>CA</option>
                      </select>
                      <input type="tel" placeholder="+237 123456789" className="flex-1 px-2 md:px-3 py-2 md:py-3 text-sm outline-none text-white bg-black/10"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white mb-1">Message</label>
                    <textarea rows={4} className="w-full px-3 py-2 md:py-3 border border-white/20 rounded-lg text-sm outline-none resize-y focus:border-orange-500 transition-colors text-white bg-black/10"/>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <input type="checkbox" className="w-5 h-5 cursor-pointer accent-orange-500 rounded-[5px]" />
                    <label className="text-sm text-white cursor-pointer">
                      You agree to our <span className="underline">terms</span> and <span className="underline">privacy policy</span>.
                    </label>
                  </div>

                  <button type="submit" className="w-full py-3.5 bg-gradient-to-br from-orange-700 to-orange-500 text-white rounded-lg text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(255,127,0,0.3)]">
                    Send message
                  </button>
                </form>
              </div>

            </section>
          </div>
        </div>
      )}
    </>
  );
}
