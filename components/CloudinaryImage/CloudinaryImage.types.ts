export interface CloudinaryImageData {
  url: string;
  width: number;
  height: number;
}

export interface CloudinaryImageProps {
  cloudinaryOptions?: CloudinaryImageData | null;
  alt?: string | null;
  caption?: string | null;
  linkUrl?: string | null;
  priority?: boolean | null;
  objectFit?: "cover" | "contain" | null;
  rounded?: boolean | null;
}
