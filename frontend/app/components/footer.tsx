import af from "../../public/icons/logo-phone.png";
import Image from "next/image";

export default function Footer() {
    return (
        <>
            
            
            <footer className="flex flex-wrap justify-center overflow-hidden gap-10 md:gap-20 py-16 px-6 md:px-16 lg:px-24 xl:px-32 text-[13px] text-gray-500 bg-black">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                        <a href="/" className="flex-shrink-0">
                            <Image src={af} alt="Logo" width={100} height={100}></Image>
                        </a>
                        <div className="text-center md:text-left">
                            <p className="max-w-md text-slate-300">
                                Efficient digital services, IT solutions, and web development for your business growth.
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                                <a href="https://www.linkedin.com/company/freudedev" target="_blank" rel="noreferrer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin size-5 hover:text-indigo-500" aria-hidden="true">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                        <rect width="4" height="12" x="2" y="9"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row - Links Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <p className="text-slate-100 font-semibold mb-3">Services</p>
                            <ul className="space-y-2">
                                <li><a href="/services" className="hover:text-amber-400 transition">Web Design</a></li>
                                <li><a href="/services" className="hover:text-amber-400 transition">IT Solutions</a></li>
                                <li><a href="/services" className="hover:text-amber-400 transition">Network Admin</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-slate-100 font-semibold mb-3">Company</p>
                            <ul className="space-y-2">
                                <li><a href="/about" className="hover:text-amber-400 transition">About Us</a></li>
                                <li><a href="/projects" className="hover:text-amber-400 transition">Projects</a></li>
                                <li><a href="/services" className="hover:text-amber-400 transition">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-slate-100 font-semibold mb-3">Legal</p>
                            <ul className="space-y-2">
                                <li><a href="/" className="hover:text-amber-400 transition">Privacy</a></li>
                                <li><a href="/" className="hover:text-amber-400 transition">Terms</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-slate-100 font-semibold mb-3">Quick Links</p>
                            <ul className="space-y-2">
                                <li><a href="/" className="hover:text-amber-400 transition">Home</a></li>
                                <li><a href="/about" className="hover:text-amber-400 transition">About</a></li>
                                <li><a href="/services" className="hover:text-amber-400 transition">Services</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="pt-8 border-t border-zinc-800 text-center">
                        <p className="text-slate-400"> 2026 FreudeDev</p>
                    </div>
                </div>
            </footer>
        </>
    );
};