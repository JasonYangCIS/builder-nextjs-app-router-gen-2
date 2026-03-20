/** Asset object returned by the Builder.io Cloudinary plugin (cloudinaryImageEditor).
 *  The plugin passes the raw Cloudinary Media Library widget asset — see
 *  https://cloudinary.com/documentation/media_library_widget for all fields.
 *  We only type the fields we actually use. */
export interface CloudinaryImageData {
  public_id: string;
  url: string;         // http:// variant
  secure_url: string;  // https:// variant — always prefer this for next/image
  width: number;
  height: number;
  format?: string;
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
