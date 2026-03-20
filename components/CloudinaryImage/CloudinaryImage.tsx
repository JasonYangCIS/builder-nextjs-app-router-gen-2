import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { sanitizeHref } from "@/utils/url";
import type { CloudinaryImageProps } from "./CloudinaryImage.types";
import styles from "./CloudinaryImage.module.scss";

export type { CloudinaryImageProps } from "./CloudinaryImage.types";

export default function CloudinaryImage({
  cloudinaryOptions,
  alt,
  caption,
  linkUrl,
  priority = false,
  objectFit,
  rounded = false,
}: CloudinaryImageProps) {
  const safeAlt = alt ?? "";
  const safeCaption = caption ?? "";
  const safeLinkUrl = sanitizeHref(linkUrl ?? "");
  const isRounded = rounded ?? false;
  const fit = objectFit ?? "cover";

  // Cloudinary returns both `url` (http) and `secure_url` (https).
  // next/image requires https — prefer secure_url, fall back to url.
  const imageSrc = cloudinaryOptions?.secure_url || cloudinaryOptions?.url;

  const imageElement = imageSrc ? (
    <Image
      src={imageSrc}
      alt={safeAlt}
      width={cloudinaryOptions!.width}
      height={cloudinaryOptions!.height}
      className={cn(
        styles.image,
        fit === "cover" ? styles.objectCover : styles.objectContain,
      )}
      priority={priority ?? false}
    />
  ) : (
    <div className={styles.placeholder} aria-hidden="true" />
  );

  const wrappedImage = safeLinkUrl ? (
    <Link href={safeLinkUrl} className={styles.link}>
      {imageElement}
    </Link>
  ) : (
    imageElement
  );

  return (
    <figure
      className={cn(styles.figure, isRounded && styles.rounded)}
      aria-hidden={!safeAlt && !safeCaption ? true : undefined}
    >
      <div className={cn(styles.imageWrapper, isRounded && styles.rounded)}>
        {wrappedImage}
      </div>
      {safeCaption && (
        <figcaption className={styles.caption}>{safeCaption}</figcaption>
      )}
    </figure>
  );
}
