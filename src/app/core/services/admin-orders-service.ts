import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminOrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface AdminOrder {
  orderId: number;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  orderDate: string;
  userEmail: string;
  userName: string;
  itemCount: number;
  items: AdminOrderItem[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminOrdersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/orders`;

  getAllOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(this.apiUrl);
  }

  updateOrderStatus(orderId: number, status: string): Observable<{ message: string; status: string }> {
    return this.http.patch<{ message: string; status: string }>(`${this.apiUrl}/${orderId}/status`, {
      status,
    });
  }
}
