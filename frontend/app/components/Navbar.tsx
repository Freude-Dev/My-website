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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("CM");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const WHATSAPP_NUMBER = "237650812141";

  const links = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
  ];

  useEffect(() => {
    if (showModal && modalRef.current) {
      setSubmitStatus("idle");
      setSubmitMessage("");
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

  useEffect(() => {
    if (submitStatus !== "success") return;
    const timer = setTimeout(() => {
      setSubmitStatus("idle");
      setSubmitMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [submitStatus]);

  useEffect(() => {
    const handleOpenContact = () => setShowModal(true);
    window.addEventListener("openContactModal", handleOpenContact);
    return () => window.removeEventListener("openContactModal", handleOpenContact);
  }, []);

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

  const handleSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim() || "No name provided";
    
    // Basic validation
    if (!email || !message) {
      setSubmitStatus("error");
      setSubmitMessage("Please fill in all required fields.");
      return;
    }
    
    setSubmitStatus("idle");
    setSubmitMessage("");
    setSending(true);
    
    try {
      // Real API call with fallback
      let apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Fallback for different environments
      if (!apiUrl) {
        if (typeof window !== 'undefined') {
          // Browser environment - use current origin
          apiUrl = window.location.origin;
        } else {
          // Server environment - use localhost:3000
          apiUrl = 'http://localhost:3000';
        }
      }
      
      console.log('Sending to API:', `${apiUrl}/api/contact`);
      
      // Prepare the data exactly as the backend expects
      const requestData = {
        name: fullName,
        email: email.trim(),
        phone: phone ? `${countryCode} ${phone}`.trim() : '',
        subject: `Website Contact - ${fullName}`,
        message: message.trim(),
      };
      
      console.log('Request data:', requestData);
      
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      // Try to parse error details from the server response
      const data = await res.json().catch(() => ({})); 
      console.log('Response status:', res.status);
      console.log('Response data:', data);
      
      if (!res.ok) {
        // Log the specific error from the backend to the console for easier debugging
        console.error('Backend Error:', data);
        const errorMessage = data?.details?.[0] || data?.error || data?.message || "Server error occurred";
        throw new Error(errorMessage);
      }

      setSubmitStatus("success");
      setSubmitMessage("Message sent successfully. We will get back to you soon.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setCountryCode("CM");
      setPhone("");
      setMessage("");
      
      // Close modal after successful submission
      setTimeout(() => {
        closeModal();
      }, 2000);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message. Please try again.";
      setSubmitStatus("error");
      setSubmitMessage(errorMessage);
    } finally {
      setSending(false);
    }
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
          bg-dark backdrop-blur-xl
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
            className="relative w-[95vw] max-w-2xl mx-4 border-2 border-orange-500 rounded-xl shadow-[0_0_30px_rgba(255,165,0,0.5)] overflow-hidden"
          >
            {/* Orange Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none size-140 bg-orange-500/20 rounded-full blur-[200px] animate-pulse"></div>

            
            

            <section className="flex flex-col justify-center px-4 py-8 md:py-12 gap-4 md:gap-6 relative z-10">
              
              <div className="flex flex-col items-center justify-center text-center gap-3 md:gap-4 mt-2 md:mt-0">
                <span className="text-orange-400 font-medium text-xs uppercase tracking-wide">
                  Book Your Consultation
                </span>

                <h1 className="text-xl md:text-2xl font-bold text-white leading-snug max-w-full md:max-w-[320px]">
                  Ready to Transform Your Digital Experience?
                </h1>

                <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                  Let's help you improve your website's performance and reach your target audience. We use the latest technologies to deliver high-quality and user-friendly websites that drive conversions and increase your online presence. Let's create something amazing together.
                </p>

                {/* Hide user images on mobile to save space */}
                <div className="hidden md:flex items-center justify-center gap-2 mt-3">
                  <img
                    className="size-8 md:size-6 rounded-full border border-orange-500"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
                    alt="user1"
                  />
                  <img
                    className="size-8 md:size-6 rounded-full border border-orange-500 -translate-x-2"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
                    alt="user2"
                  />
                  <img
                    className="size-8 md:size-6 rounded-full border border-orange-500 -translate-x-4"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                    alt="user3"
                  />
                  <p className="hidden md:block -translate-x-2 text-xs md:text-sm text-white/70">
                    Join a community of 1M+ founders
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full rounded-xl bg-[#FF7F00]/10 backdrop-blur-sm border border-white/10 p-4 md:p-6 z-10 overflow-y-auto max-h-[85vh] md:max-h-[90vh] relative">
                <form onSubmit={handleSubmitMessage} className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <div>
                      <label className="block text-xs md:text-sm text-white mb-1">First name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="David"
                        className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-white/20 rounded-lg text-xs md:text-sm outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm text-white mb-1">Last name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Andrew"
                        className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-white/20 rounded-lg text-xs md:text-sm outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm text-white mb-1">Email id</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="david@company.com"
                      className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-white/20 rounded-lg text-xs md:text-sm outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm text-white mb-1">Phone number</label>
                    <div className="flex border border-white/20 rounded-lg overflow-hidden focus-within:border-orange-500 transition-colors">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm outline-none cursor-pointer text-white bg-black/10 border-r border-white/20"
                      >
                        <option>CM</option>
                        <option>US</option>
                        <option>CA</option>
                      </select>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+237 123456789"
                        className="flex-1 px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm outline-none text-white bg-black/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm text-white mb-1">Message</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-2 py-1.5 md:px-3 md:py-2 border border-white/20 rounded-lg text-xs md:text-sm outline-none resize-y focus:border-orange-500 transition-colors text-white bg-black/10"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <input type="checkbox" className="w-4 h-4 cursor-pointer accent-orange-500 rounded-[5px]" />
                    <label className="text-xs text-white cursor-pointer">
                      You agree to our <span className="underline">terms</span> and <span className="underline">privacy policy</span>.
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-2.5 md:py-3 bg-gradient-to-br from-orange-700 to-orange-500 text-white rounded-lg text-xs md:text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(255,127,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? "Sending..." : "Send message"}
                    </button>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 md:py-3 bg-[#25D366] text-white rounded-lg text-xs md:text-sm cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(37,211,102,0.25)] flex items-center justify-center gap-1 md:gap-2"
                    >
                      <SiWhatsapp className="text-sm md:text-base" />
                      <span className="hidden md:inline">Chat on WhatsApp</span>
                    </a>
                  </div>

                  {submitStatus !== "idle" && (
                    <p
                      className={`text-xs md:text-sm ${
                        submitStatus === "success" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {submitMessage}
                    </p>
                  )}
                </form>
              </div>

            </section>
          </div>
        </div>
      )}
    </>
  );
}
