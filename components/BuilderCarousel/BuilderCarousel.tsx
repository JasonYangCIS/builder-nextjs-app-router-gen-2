"use client"

import * as React from "react"
import { Children, isValidElement } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel/Carousel"
import { cn } from "@/utils/cn"

export interface BuilderCarouselProps {
  children?: React.ReactNode
  orientation?: "horizontal" | "vertical"
  loop?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  pauseOnHover?: boolean
  navigation?: boolean
  align?: "start" | "center" | "end"
  slidesPerView?: number
  minHeight?: number
  className?: string
}

export function BuilderCarousel({
  children,
  orientation = "horizontal",
  loop = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = true,
  navigation = true,
  align = "start",
  slidesPerView = 1,
  minHeight = 300,
  className,
}: BuilderCarouselProps) {
  // Unwrap Builder.io's wrapper element if needed
  let slides = Children.toArray(children).filter((child) => isValidElement(child))
  if (slides.length === 1 && isValidElement(slides[0])) {
    const firstChild = slides[0]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = firstChild.props as any
    if (props?.children) {
      const nested = Children.toArray(props.children).filter((c) => isValidElement(c))
      if (nested.length > 1) slides = nested
    }
  }

  const plugins = autoplay
    ? [Autoplay({ delay: autoplayDelay, stopOnMouseEnter: pauseOnHover, stopOnInteraction: false })]
    : []

  const basisClass =
    slidesPerView === 1 ? "basis-full" :
    slidesPerView === 2 ? "basis-1/2" :
    slidesPerView === 3 ? "basis-1/3" :
    slidesPerView === 4 ? "basis-1/4" :
    "basis-full"

  return (
    <div
      className={cn("w-full", className)}
      style={{ minHeight: `${minHeight}px` }}
    >
      <Carousel
        orientation={orientation}
        opts={{ loop, align }}
        plugins={plugins}
        className="w-full"
        aria-label="Content carousel"
      >
        <CarouselContent>
          {slides.length > 0 ? (
            slides.map((slide, index) => (
              <CarouselItem
                key={index}
                className={cn("flex items-center justify-center", basisClass)}
                aria-label={`Slide ${index + 1} of ${slides.length}`}
              >
                {slide}
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center p-8">
                <p className="text-muted-foreground text-sm">Drop content here to create slides</p>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        {navigation && slides.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  )
}
