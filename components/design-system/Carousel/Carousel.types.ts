import type { ReactNode } from "react";

export type CarouselEffect = "slide" | "fade" | "cube" | "coverflow" | "flip";
export type CarouselDirection = "horizontal" | "vertical";

export interface CarouselProps {
  /**
   * Slides to render in the carousel
   */
  children?: ReactNode;

  /**
   * Number of slides visible at once
   * @default 1
   */
  slidesPerView?: number;

  /**
   * Space between slides in pixels
   * @default 0
   */
  spaceBetween?: number;

  /**
   * Enable navigation arrows
   * @default true
   */
  navigation?: boolean;

  /**
   * Enable pagination dots
   * @default true
   */
  pagination?: boolean;

  /**
   * Make pagination dots clickable
   * @default true
   */
  paginationClickable?: boolean;

  /**
   * Enable scrollbar
   * @default false
   */
  scrollbar?: boolean;

  /**
   * Enable autoplay
   * @default false
   */
  autoplay?: boolean;

  /**
   * Autoplay delay in milliseconds
   * @default 3000
   */
  autoplayDelay?: number;

  /**
   * Pause autoplay on hover
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Loop slides continuously
   * @default false
   */
  loop?: boolean;

  /**
   * Transition effect
   * @default "slide"
   */
  effect?: CarouselEffect;

  /**
   * Slide direction
   * @default "horizontal"
   */
  direction?: CarouselDirection;

  /**
   * Enable centered slides
   * @default false
   */
  centeredSlides?: boolean;

  /**
   * Enable keyboard navigation
   * @default true
   */
  keyboard?: boolean;

  /**
   * Enable mousewheel control
   * @default false
   */
  mousewheel?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Minimum height for the carousel in pixels
   * @default 300
   */
  minHeight?: number;
}
