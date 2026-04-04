"use client"
import React from 'react'

import Button from './button'

export default function HeroSection() {
    const [mobileOpen, setMobileOpen] = React.useState(false)

    return (
        <>
            <style>
                {`
                    @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

                    *{
                        font-family: "Poppins", sans-serif;
                    }`
                }
            </style>
            <section className='flex flex-col items-center bg-dark  px-4 py-4' >
                

                <div className="flex flex-wrap items-center justify-center gap-2 pl-2 pr-4 py-1.5 mt-30 rounded-full bg-white/10 border border-white">
                    <div className="relative flex size-3.5 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 animate-ping duration-300"></span>
                        <span className="relative inline-flex size-2 rounded-full bg-orange-600"></span>
                    </div>
                    <p className="text-sm text-white">Join 12,450+ brands growing with us</p>
                </div>

                <h1 className='text-6xl md:text-[76px]/19 text-center max-w-4xl mt-8 text-amber-600 bg-clip-text leading-tight font-semibold'>Efficient Services <br/> At your Fingertips</h1>
                <p className="text-sm text-light text-center max-w-[630px] mt-4">
                    We design high-impact websites that convert and scale. From sleek interfaces to full stack experiences, we bring your brand to life online.
                </p>

                <div className='flex gap-3 mt-10'>
                    <Button 
                        onClick={() => window.dispatchEvent(new Event("openContactModal"))}
                        className="bg-orange-500 hover:bg-orange-500 hover:shadow-[0px_0px_10px_2px] shadow-orange-400 text-white text-xs md:text-sm px-5 py-3 rounded-lg transition cursor-pointer"
                    >
                        Contact Us
                    </Button>
                </div>

                <div className='w-full max-w-[800px] h-[3px] mt-10 bg-linear-to-r from-white/10 via-amber-600 to-white/10'></div>

               
            </section>
        </>
    )
}