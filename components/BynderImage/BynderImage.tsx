import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { sanitizeHref } from "@/utils/url";
import type {
  BynderDerivative,
  BynderDerivativeName,
  BynderImageProps,
} from "./BynderImage.types";
import styles from "./BynderImage.module.scss";

export type { BynderImageProps } from "./BynderImage.types";

const FALLBACK_SIZE = { width: 1200, height: 800 };

function resolveDerivative(
  asset: NonNullable<BynderImageProps["bynderAsset"]>["assets"],
  derivative: BynderDerivativeName,
): BynderDerivative | undefined {
  const item = asset?.[0];
  if (!item) return undefined;
  if (derivative === "original") {
    return item.originalUrl ? { url: item.originalUrl } : undefined;
  }
  return (
    item.files?.[derivative] ??
    item[derivative] ??
    item.files?.webImage ??
    item.webImage
  );
}

export default function BynderImage({
  bynderAsset,
  derivative,
  alt,
  caption,
  linkUrl,
  priority = false,
  objectFit,
  rounded = false,
}: BynderImageProps) {
  const safeAlt = alt ?? "";
  const safeCaption = caption ?? "";
  const safeLinkUrl = sanitizeHref(linkUrl ?? "");
  const fit = objectFit ?? "cover";

  const resolved = resolveDerivative(
    bynderAsset?.assets,
    derivative ?? "webImage",
  );
  const imageSrc = resolved?.url?.startsWith("https://") ? resolved.url : undefined;

  const imageElement = imageSrc ? (
    <Image
      src={imageSrc}
      alt={safeAlt}
      width={resolved?.width ?? FALLBACK_SIZE.width}
      height={resolved?.height ?? FALLBACK_SIZE.height}
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
    <figure className={styles.figure}>
      <div className={cn(styles.imageWrapper, rounded && styles.rounded)}>
        {wrappedImage}
      </div>
      {safeCaption && (
        <figcaption className={styles.caption}>{safeCaption}</figcaption>
      )}
    </figure>
  );
}
