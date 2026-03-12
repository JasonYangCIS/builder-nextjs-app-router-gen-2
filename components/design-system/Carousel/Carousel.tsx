"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
  Keyboard,
  Mousewheel,
} from "swiper/modules";
import { cn } from "@/utils/cn";
import type { CarouselProps } from "./Carousel.types";
import { Children, isValidElement } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "swiper/css/effect-cube";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-flip";

export function Carousel({
  children,
  slidesPerView = 1,
  spaceBetween = 0,
  navigation = true,
  pagination = true,
  paginationClickable = true,
  scrollbar = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = true,
  loop = false,
  effect = "slide",
  direction = "horizontal",
  centeredSlides = false,
  keyboard = true,
  mousewheel = false,
  className,
  minHeight = 300,
}: CarouselProps) {
  // Prepare modules based on enabled features
  const modules = [A11y];

  if (navigation) modules.push(Navigation);
  if (pagination) modules.push(Pagination);
  if (scrollbar) modules.push(Scrollbar);
  if (keyboard) modules.push(Keyboard);
  if (mousewheel) modules.push(Mousewheel);

  // Add effect modules
  if (effect === "fade") modules.push(EffectFade);
  if (effect === "cube") modules.push(EffectCube);
  if (effect === "coverflow") modules.push(EffectCoverflow);
  if (effect === "flip") modules.push(EffectFlip);

  // Add autoplay if enabled
  if (autoplay) modules.push(Autoplay);

  // Convert children to array for proper rendering
  const slides = Children.toArray(children).filter((child) => isValidElement(child));

  return (
    <div
      className={cn("carousel-container w-full", className)}
      style={{ minHeight: `${minHeight}px` }}
    >
      <Swiper
        modules={modules}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        navigation={navigation}
        pagination={
          pagination
            ? {
                clickable: paginationClickable,
                bulletActiveClass: "!bg-brand-600",
                bulletClass: "swiper-pagination-bullet !bg-zinc-400",
              }
            : false
        }
        scrollbar={scrollbar ? { draggable: true } : false}
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: pauseOnHover,
              }
            : false
        }
        loop={loop}
        effect={effect}
        direction={direction}
        centeredSlides={centeredSlides}
        keyboard={
          keyboard
            ? {
                enabled: true,
                onlyInViewport: true,
              }
            : false
        }
        mousewheel={mousewheel}
        className={cn(
          "!pb-12", // Extra padding for pagination dots
          "[&_.swiper-button-next]:text-brand-600 [&_.swiper-button-next]:after:text-2xl",
          "[&_.swiper-button-prev]:text-brand-600 [&_.swiper-button-prev]:after:text-2xl",
          "[&_.swiper-button-next]:focus-visible:outline-none [&_.swiper-button-next]:focus-visible:ring-2 [&_.swiper-button-next]:focus-visible:ring-brand-600 [&_.swiper-button-next]:focus-visible:ring-offset-2 [&_.swiper-button-next]:rounded-full",
          "[&_.swiper-button-prev]:focus-visible:outline-none [&_.swiper-button-prev]:focus-visible:ring-2 [&_.swiper-button-prev]:focus-visible:ring-brand-600 [&_.swiper-button-prev]:focus-visible:ring-offset-2 [&_.swiper-button-prev]:rounded-full",
          "[&_.swiper-pagination-bullet]:transition-colors [&_.swiper-pagination-bullet]:duration-150",
          "[&_.swiper-pagination-bullet]:focus-visible:outline-none [&_.swiper-pagination-bullet]:focus-visible:ring-2 [&_.swiper-pagination-bullet]:focus-visible:ring-brand-600 [&_.swiper-pagination-bullet]:focus-visible:ring-offset-2"
        )}
        // WCAG 2.1 AA: Provide accessible labels
        aria-label="Content carousel"
        role="region"
        aria-roledescription="carousel"
      >
        {slides.length > 0 ? (
          slides.map((slide, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slides.length}`}
            >
              {slide}
            </SwiperSlide>
          ))
        ) : (
          // Placeholder when no slides are added
          <SwiperSlide
            className="flex items-center justify-center bg-zinc-100 rounded-lg"
            aria-label="Empty slide placeholder"
          >
            <div className="text-center p-8">
              <p className="text-zinc-500 text-sm">
                Drop content here to create slides
              </p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
}
