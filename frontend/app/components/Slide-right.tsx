import Image from "next/image";
import logos from "../../public/icons/logo-slide.png";

export default function WarningRight({ className }: { className?: string }) {

  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          animation: marqueeScroll 25s linear infinite;
        }
        
        .marquee-reverse {
          animation-direction: reverse;
        }
        
      `}</style>

      <div className={className}>
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-dark to-transparent" />

        <div className="marquee-inner marquee-reverse  flex max-w-[10%] pt-10 pb-5">
          {[...Array(20)].map((_, i) => (
            <Image
              key={i}
              src={logos}
              alt="Logo"
              width={60}
              height={60}
              className="mx-2"
              priority
            />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-dark to-transparent" />
      </div>
    </>
  );
}
