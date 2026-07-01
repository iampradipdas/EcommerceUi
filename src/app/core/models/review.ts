// core/models/review.model.ts
export interface Review {
  reviewId:  number;
  userId:    number;
  userName:  string;
  rating:    number;       // 1-5
  comment:   string;
  createdAt: string;
}

export interface CreateReviewDto {
  productId: number;
  rating:    number;
  comment:   string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews:  number;
  breakdown:     { stars: number; count: number; percent: number }[];
}