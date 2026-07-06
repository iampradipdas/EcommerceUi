import { Injectable, inject, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../models/cart';
import { Product } from '../models/product';
import { AuthService } from './auth-service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/cart`;

  // 💡 INTERVIEW QUESTION: Private BehaviorSubject encapsulates reactive state
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  // 💡 INTERVIEW QUESTION: Exposed as a read-only Observable
  cart$ = this.cartSubject.asObservable();

  // 💡 INTERVIEW QUESTION: Convert Observable to read-only Signal using toSignal
  items = toSignal(this.cart$, { initialValue: [] as CartItem[] });

  // Exposing derived reactive values using computed Signals
  totalItems = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  totalPrice = computed(() => this.items().reduce((acc, item) => acc + item.price * item.quantity, 0));

  constructor() {
    // Synchronize AuthService's cartCount signal with our derived totalItems Signal
    effect(() => {
      this.auth.cartCount.set(this.totalItems());
    });

    // Automatically sync state when user login state changes
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.loadCartFromApi();
      } else {
        // Fallback to local storage for guests
        this.cartSubject.next(this.loadLocalCart());
      }
    });
  }

  private loadCartFromApi() {
    this.http.get<Cart>(this.apiUrl).subscribe({
      next: (cart) => this.cartSubject.next(cart.items),
      error: () => this.cartSubject.next([]),
    });
  }

  addItem(product: Product, quantity: number = 1) {
    if (this.auth.isLoggedIn()) {
      this.http
        .post<Cart>(`${this.apiUrl}/add`, { productId: product.productId, quantity })
        .subscribe({
          next: (cart) => this.cartSubject.next(cart.items),
        });
    } else {
      const current = this.cartSubject.value;
      const existing = current.find((item) => item.productId === product.productId);

      let updated: CartItem[];
      if (existing) {
        updated = current.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [
          ...current,
          {
            cartItemId: Date.now(),
            productId: product.productId,
            name: product.name,
            imageUrl: product.imageUrl ?? '',
            price: product.finalPrice ?? product.price,
            quantity: quantity,
            stock: product.stock,
          },
        ];
      }
      this.saveLocalCart(updated);
    }
  }

  removeItem(productId: number) {
    if (this.auth.isLoggedIn()) {
      this.http.delete<Cart>(`${this.apiUrl}/remove/${productId}`).subscribe({
        next: (cart) => this.cartSubject.next(cart.items),
      });
    } else {
      const updated = this.cartSubject.value.filter((item) => item.productId !== productId);
      this.saveLocalCart(updated);
    }
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    if (this.auth.isLoggedIn()) {
      this.http
        .put<Cart>(`${this.apiUrl}/update`, { productId, quantity })
        .subscribe({
          next: (cart) => this.cartSubject.next(cart.items),
        });
    } else {
      const updated = this.cartSubject.value.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      this.saveLocalCart(updated);
    }
  }

  clearCart() {
    if (this.auth.isLoggedIn()) {
      this.http.delete<Cart>(`${this.apiUrl}/clear`).subscribe({
        next: () => this.cartSubject.next([]),
      });
    } else {
      this.saveLocalCart([]);
    }
  }

  private saveLocalCart(items: CartItem[]) {
    this.cartSubject.next(items);
    localStorage.setItem('cart_items', JSON.stringify(items));
  }

  private loadLocalCart(): CartItem[] {
    const raw = localStorage.getItem('cart_items');
    return raw ? JSON.parse(raw) : [];
  }
}
