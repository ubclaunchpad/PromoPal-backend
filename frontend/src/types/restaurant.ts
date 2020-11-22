export type Restaurant = {
  id: string;
  address: string;
  cuisineType: string;
  distance: number;
  hours: Hours;
  name: string;
  phoneNumber: string;
  photos: Array<{ src: string }>;
  price: string;
  rating: number;
  reviews: string;
  website: string;
};

type Hours = {
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
};
