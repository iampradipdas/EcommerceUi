import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CreateReviewDto, Review, ReviewSummary } from '../../../core/models/review';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http   = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reviews`;


  getByProduct(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/product/${productId}`);
  }

  getSummary(productId: number): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(`${this.apiUrl}/product/${productId}/summary`);
  }

  create(dto: CreateReviewDto): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, dto);
  }
  
}
