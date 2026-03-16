"use client";

import React from "react";
import test from "../data/testimonials.json"
import Image from "next/image";
import DashedCircle from "./components/FloatingShapes/dashedCircle";
import { Dot } from "lucide-react";
import warning from "./components/Slide-left";
import HeroSection from "./components/HeroSection";
import Footer from "./components/footer";
import FullCircle from "./components/FloatingShapes/stripCircle";
import DottedCircle from "./components/FloatingShapes/dotCircle";
import StripedCircle from "./components/FloatingShapes/stripCircle";
import FAQ from "./components/FAQ";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination , Autoplay} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import RatingStars from "./components/rating";
import Warning from "./components/Slide-left";


export default function Home() {
  return (
    <div className="flex-col items-center">
      <DashedCircle className="absolute top-0 left-0 z-10" width={500} height={500} cx={0} cy={0} strokeWidth={3} r={400} />
      <HeroSection />

<div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
  <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center lg:justify-between ">
   <Swiper
    modules={[Pagination, Autoplay]}
    className="lg:w-[1280%] w-full h-[50%] mx-64 px-64"
    slidesPerView={1}
    spaceBetween={40}
    pagination={{
      clickable: false,
      type: "bullets",
      bulletActiveClass: "swiper-pagination-bullet-active",
      bulletClass: "swiper-pagination-bullet",
    }}
    autoplay={true}
    loop={true}
>
  {test.testimonials.slice(0,5).map((item, index) => (
    <SwiperSlide key={index}>
      <div className="lg:col-span-5 lg:col-start-1">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-800 lg:text-4xl dark:text-neutral-200 text-center lg:text-left">
            {item.testimonial.title}
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 text-center lg:text-left">
            {item.testimonial.text}
          </p>
        </div>

        <blockquote className="relative">
          <svg
            className="absolute top-0 start-0 -translate-x-6 -translate-y-8 size-16 text-gray-200 dark:text-neutral-800"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7.39762 10.3C7.39762 11.0733..."
              fill="currentColor"
            />
          </svg>

          <div className="relative z-10">
            <p className="text-sm lg:text-md  italic text-gray-800 dark:text-white text-center lg:text-left">
              {item.testimonial.feedback}
            </p>
          </div>

          <footer className="mt-6">
            <div className="flex items-center gap-x-4 justify-center lg:justify-start">
              <img
                className="size-8 rounded-full"
                src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"
                alt="Avatar"
              />
              <div className="flex flex-col items-center lg:items-start">
                <div className="font-semibold text-gray-800 dark:text-neutral-200 flex items-center gap-2 text-center lg:text-left">
                  {item.name}
                  <svg className="mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="#ff8040" />
                  </svg>
                </div>
                <div className="text-xs text-gray-500 dark:text-neutral-500">
                  {item.role}
                </div>
                <RatingStars rating={item.testimonial.rating} />
              </div>
            </div>
          </footer>
        </blockquote>
      </div>
    </SwiperSlide>
  ))};
</Swiper>

      
      <DashedCircle className="absolute top-25 left-350 z-10 " width={350} height={350} cx={170} cy={200} strokeWidth={3} r={100} color="white" motion={{x:-20, y: -5, rotate:8, duration: 5 }} />

<div className="mt-10 lg:mt-0 lg:col-span-6 lg:col-end-13 py-40">
      <div className="space-y-6 sm:space-y-8">

        <ul className="grid grid-cols-2 divide-y divide-y-2 divide-x divide-x-2 divide-gray-200 overflow-hidden dark:divide-neutral-700">
          <li className="flex flex-col -m-0.5 p-4 sm:p-8">
            <div className="flex items-end gap-x-2 text-3xl sm:text-5xl font-bold text-gray-800 mb-2 dark:text-neutral-200">
              45k+
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-neutral-400">
              users - from new startups to public companies
            </p>
          </li>
        
          <li className="flex flex-col -m-0.5 p-4 sm:p-8">
            <div className="flex items-end gap-x-2 text-3xl sm:text-5xl font-bold text-gray-800 mb-2 dark:text-neutral-200">
              <svg className="shrink-0 size-5 text-blue-600 dark:text-orange-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              23%
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-neutral-400">
              increase in traffic on webpages with Looms
            </p>
          </li>
    <DottedCircle cx={100} cy={450} r={100} strokeWidth={4} color="orange" className="border-1 border-transparent"/>
          <li className="flex flex-col -m-0.5 p-4 sm:p-8">
            <div className="flex items-end gap-x-2 text-3xl sm:text-5xl font-bold text-gray-800 mb-2 dark:text-neutral-200">
              <svg className="shrink-0 size-5 text-blue-600 dark:text-orange-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              9.3%
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-neutral-400">
              boost in reply rates across sales outreach
            </p>
          </li>

          <li className="flex flex-col -m-0.5 p-4 sm:p-8">
            <div className="flex items-end gap-x-2 text-3xl sm:text-5xl font-bold text-gray-800 mb-2 dark:text-neutral-200">
              2x
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-neutral-400">
              faster than previous Preline versions
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
<FAQ/>
<Footer />
    </div>
  );
}
