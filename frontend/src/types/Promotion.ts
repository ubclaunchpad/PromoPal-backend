export interface Promotion {
  title: string;
  restaurantName: string;
  description: string;
  date: string;
  liked: boolean;
  image: PromotionImage;
}

export interface PromotionImage {
  src: string;
}
