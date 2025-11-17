
export enum CafeStatus {
  Wishlist = 'wishlist',
  Visited = 'visited',
  Favorite = 'favorite',
}

export interface Cafe {
  id: string;
  name: string;
  status: CafeStatus;
  visitDate?: string;
  menu?: string;
  review?: string;
  photo?: string; // base64 string
  rating?: number;
  lat?: number;
  lon?: number;
}