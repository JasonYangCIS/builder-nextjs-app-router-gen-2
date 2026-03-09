import NextImage from "next/image";
import type { BlogArticleHeroProps } from "./BlogArticleHero.types";

export function BlogArticleHero({ image, alt }: BlogArticleHeroProps) {
  return (
    <div className="relative h-72 w-full sm:h-96 md:h-[480px]">
      <NextImage
        src={image}
        alt={alt ?? ""}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-950/60 to-accent-900/20" aria-hidden />
    </div>
  );
}
