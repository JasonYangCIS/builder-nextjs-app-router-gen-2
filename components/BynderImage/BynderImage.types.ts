export interface BynderDerivative {
  url: string;
  width?: number;
  height?: number;
}

/** Asset object from the Bynder Compact View `onSuccess` callback (BynderAsset input). */
export interface BynderAssetItem {
  id?: string;
  name?: string;
  databaseId?: string;
  originalUrl?: string;
  extensions?: string[];
  files?: {
    webImage?: BynderDerivative;
    thumbnail?: BynderDerivative;
    [derivative: string]: BynderDerivative | undefined;
  };
  // Some plugin versions expose derivatives directly on the asset.
  webImage?: BynderDerivative;
  thumbnail?: BynderDerivative;
}

export interface BynderAssetData {
  assets?: BynderAssetItem[];
}

export type BynderDerivativeName = "webImage" | "thumbnail" | "original";

export interface BynderImageProps {
  bynderAsset?: BynderAssetData | null;
  derivative?: BynderDerivativeName | null;
  alt?: string | null;
  caption?: string | null;
  linkUrl?: string | null;
  priority?: boolean | null;
  objectFit?: "cover" | "contain" | null;
  rounded?: boolean | null;
}
