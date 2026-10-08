export interface RegionOption {
  id: string;
  name: string;
  locales: string[];
}

export interface RegionLocaleResult {
  id: string;
  title: string;
  url: string;
}

export interface RegionLocaleGroup {
  locale: string;
  entries: RegionLocaleResult[];
}
