import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResult } from '../../../core/models/api-response';
import { Product } from '../../../core/models/product';

export interface ProductQuery {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  uploadProductImage(productId: number, file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name); // 'file' must match IFormFile parameter name

    return this.http.post<{ imageUrl: string }>(
      `${this.apiUrl}/uploads/product-image/${productId}`,
      formData,
      // ⚠️ Do NOT set Content-Type header manually
      // The browser sets multipart/form-data with the boundary automatically
    );
  }

  getAll(query: ProductQuery): Observable<PaginatedResult<Product>> {
    let params = new HttpParams();

    // Only append params that actually have values — keeps URL clean
    Object.entries(query).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResult<Product>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // features/products/services/product.service.ts (add this method)
  getRelated(productId: number, categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${productId}/related`, {
      params: { categoryId: categoryId.toString() },
    });
  }

  createProduct(dto: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  updateProduct(id: number, dto: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  restoreProduct(id: number): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${id}/restore`, {});
  }

  uploadImageFile(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name); // 'file' matches the IFormFile parameter in C# UploadsController
    return this.http.post<{ imageUrl: string }>(`${environment.apiUrl}/uploads/product-image`, formData);
  }
}
