import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { ProductService } from '../services/product-service';
import { ReviewService } from '../services/review-service';
import { Product } from '../../../core/models/product';
import { Review, ReviewSummary } from '../../../core/models/review';

export interface ProductDetailData {
  product: Product;
  reviews: Review[];
  summary: ReviewSummary;
}

export const productDetailResolver: ResolveFn<ProductDetailData> = (route) => {
  const id = Number(route.paramMap.get('id'));
  const productService = inject(ProductService);
  const reviewService = inject(ReviewService);

  return forkJoin({
    product: productService.getById(id),
    reviews: reviewService.getByProduct(id),
    summary: reviewService.getSummary(id),
  });
};
