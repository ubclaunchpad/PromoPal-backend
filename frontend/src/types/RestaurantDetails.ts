export interface RestaurantDetails {
  name: string;
  price_level: string;
  rating: number;
  total_rating: number;
  map_url: string;
  phone_number: string;
  opening_hours: Record<string, unknown>;
  website: string;
  reviews: Record<string, unknown>[];
  photos: Record<string, unknown>[];
  business_status: string;
  address: string;
  lat: number;
  lon: number;
}
