import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PlaceOrderDto {
  shippingAddress: string;
}

export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  orderId: number;
  userId: number;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  orderDate: string;
  orderItems: OrderItem[];
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  placeOrder(dto: PlaceOrderDto): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, dto);
  }

  getOrderHistory(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderDetails(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }
}
