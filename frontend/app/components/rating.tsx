import { Star } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";


interface RatingStarsProps {
  rating: number; 
}

export default function RatingStars({ rating }: RatingStarsProps) {
  const starsRef = useRef<HTMLDivElement>(null);

  // Entrance animation (good for Swiper slides)
  useEffect(() => {
    if (!starsRef.current) return;

    gsap.fromTo(
      starsRef.current.children,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.08,
        ease: "back.out(1.7)",
        duration: 0.6,
      }
    );
  }, []);

  // Hover animation
  const onHover = () => {
    if (!starsRef.current) return;

    gsap.to(starsRef.current.children, {
      y: -4,
      stagger: 0.05,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    if (!starsRef.current) return;

    gsap.to(starsRef.current.children, {
      y: 0,
      stagger: 0.05,
      duration: 0.3,
      ease: "power2.inOut",
    });
  };

  return (
    <div
      ref={starsRef}
      className="flex items-center gap-1 mt-1 cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {[...Array(5)].map((_, index) => {
        const isFull = index + 1 <= Math.floor(rating);
        const isHalf = index + 1 > Math.floor(rating) && index < rating;

        return (
          <Star
            key={index}
            size={14}
            className={
              isFull
                ? "fill-yellow-400 text-yellow-400"
                : isHalf
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-300 dark:text-neutral-600"
            }
          />
        );
      })}
    </div>
  );
}
