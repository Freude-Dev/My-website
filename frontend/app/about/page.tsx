import Features from "../components/Features";
import TeamMember from "../components/TeamMembers";

export default function AboutPage() {
  return (
    <div className="py-48 flex flex-col gap-20">
      <div>
        <style>{`

                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

            

                * {

                    font-family: 'Poppins', sans-serif;

                }

            `}</style>

            <section className="flex flex-col md:flex-row items-center justify-center gap-50 max-md:px-4">

                <div className="relative shadow-2xl shadow-orange-600/40 rounded-2xl overflow-hidden shrink-0">

                    <img className="max-w-md w-full object-cover rounded-2xl"

                        src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=451&h=451&auto=format&fit=crop"

                        alt="" />

                    <div className="flex items-center gap-1 max-w-72 absolute bottom-8 left-8 bg-white p-4 rounded-xl">

                        <div className="flex -space-x-4 shrink-0">

                            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="image"

                                className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-1" />

                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="image"

                                className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-[2]" />

                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"

                                alt="image"

                                className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-[3]" />

                            <div

                                className="flex items-center justify-center text-xs  text-white size-9 rounded-full border-[3px] border-white bg-orange-600 hover:-translate-y-1 transition z-[4]">

                                50+

                            </div>

                        </div>

                        <p className="text-sm font-medium text-slate-800">Join our developer community</p>

                    </div>

                </div>

                <div className="text-sm text-slate-600 max-w-lg">
                    <div className="bg-gradient-to-r from-orange-600 to-amber-200 bg-clip-text">
                      <h1 className="text-6xl uppercase font-semibold text-transparent ">About Us</h1>
                    </div>

                    <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-orange-600 to-amber-200"></div>

                    <p className="mt-8 text-white">FreudeDev is a digital institution serving at IT maintainance, Web Design and Network Administration</p>

                    <p className="mt-4">Whether you're launching a SaaS app, landing page, or dashboard, our collection of Tailwind

                        CSS components is crafted to boost your development speed and improve user experience.</p>

                    <p className="mt-4">From UI design systems to automation-ready layouts, PrebuiltUI empowers you to build

                        beautifully and scale effortlessly.</p>

                    <a href="#" className="flex items-center w-max gap-2 mt-8 hover:-translate-y-0.5 transition bg-gradient-to-r from-orange-600 to-amber-400 py-3 px-8 rounded-full text-white">

                        <span>Read more</span>

                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">

                            <path

                                d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z"

                                fill="#fff" />

                        </svg>

                    </a>

                </div>

            </section>
      </div>
      <div>
        <>

            <style>{`

                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

            


            `}</style>

            

            <div className="max-w-6xl py-16 md:w-full mx-2 md:mx-auto flex flex-col items-center justify-center text-center bg-gradient-to-b from-orange-200 to-orange-400 rounded-2xl p-10 text-white">

                <div className="flex flex-wrap items-center justify-center p-1 rounded-full bg-orange-600/10 backdrop-blur border border-orange-500/40 text-sm">

                    <div className="flex items-center">

                        <img className="size-6 md:size-7 rounded-full border-3 border-white"

                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="userImage1" />

                        <img className="size-6 md:size-7 rounded-full border-3 border-white -translate-x-2"

                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="userImage2" />

                        <img className="size-6 md:size-7 rounded-full border-3 border-white -translate-x-4"

                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"

                            alt="userImage3" />

                    </div>

                    <p className="-translate-x-2 font-medium">Join community of 1m+ founders </p>

                </div>

                <h1 className="text-4xl md:text-5xl md:leading-[60px] font-semibold max-w-xl mt-5 bg-gradient-to-r from-white to-orange-200 text-transparent bg-clip-text">Unlock your next big opportunity.</h1>

                <button className="px-8 py-3 text-white bg-amber-600 hover:bg-amber-700 hover:shadow-[0_0_4px_8px] shadow-orange-300 transition-all rounded-full uppercase text-sm mt-8">

                    Join Discord

                </button>

            </div>

        </>
      </div>
      <Features />
      <TeamMember />
            

    </div>
  )
}