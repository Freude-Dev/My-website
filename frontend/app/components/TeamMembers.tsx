export default function TeamMember() {
    return (
        <>
            <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
                
                * {
                    font-family: "Poppins", sans-serif;
                }
            `}</style>
            
            <section className='flex flex-col items-center justify-center gap-6 py-20 px-6 md:px-16 lg:px-24 xl:px-32 w-full min-h-screen'>
                <button className='flex items-center gap-2 text-orange-600 text-sm px-6 py-3 rounded-full bg-orange-50'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap-icon lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
                    Our team
                </button>
                <h2 className='font-semibold text-2xl text-white md:text-3xl max-w-lg text-center leading-10'>Meet the expert driving creativity and innovation</h2>
                <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
                    <div className='relative group w-full max-w-2xs rounded-3xl overflow-hidden transform transition duration-300 hover:-translate-y-1'>
                        <img className='rounded-3xl' src='https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/team/user-1.png' alt="user1" />
                        <div className='absolute inset-0 bg-linear-to-b from-transparent via-[#951a20]/50 to-violet-500 pointer-events-none opacity-80'></div>
                        <div className='absolute bottom-6 left-6 right-6 flex items-center justify-between'>
                            <h3 className='text-xl text-white'>Jessica Brown</h3>
                            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white text-orange-900 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute size-4.5 transition-transform duration-300 group-hover:translate-x-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" /> </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute size-4.5 -translate-x-6 transition-transform duration-300 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className='relative group w-full max-w-2xs rounded-3xl overflow-hidden transform transition duration-300 hover:-translate-y-1'>
                        <img src='https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/team/user-2.png' alt="user2" />
                        <div className='absolute inset-0 bg-linear-to-b from-transparent via-[#951a20]/50 to-violet-500 pointer-events-none opacity-80'></div>
                        <div className='absolute bottom-6 left-6 right-6 flex items-center justify-between'>
                            <h3 className='text-xl text-white'>Lillian Rivera</h3>
                            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-violet-100 text-violet-900 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute size-4.5 transition-transform duration-300 group-hover:translate-x-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" /> </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute size-4.5 -translate-x-6 transition-transform duration-300 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className='relative group w-full rounded-3xl max-w-2xs overflow-hidden transform transition duration-300 hover:-translate-y-1'>
                        <img src='https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/team/user-3.png' alt="user3" />
                        <div className='absolute inset-0 bg-linear-to-b from-transparent via-[#951a20]/50 to-violet-500 pointer-events-none opacity-80'></div>
                        <div className='absolute bottom-6 left-6 right-6 flex items-center justify-between'>
                            <h3 className='text-xl text-white'>Michael Brown</h3>
                            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-violet-100 text-violet-900 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute size-4.5 transition-transform duration-300 group-hover:translate-x-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" /> </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute size-4.5 -translate-x-6 transition-transform duration-300 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"> <path d="M5 12h14" /> <path d="m12 5 7 7-7 7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};