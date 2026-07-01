import { Injectable, inject, signal, computed } from '@angular/core';
import { Cart, CartItem } from '../models/cart';
import { Product } from '../models/product';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private auth = inject(AuthService);

  private _items = signal<CartItem[]>(this.loadCart());

  items = this._items.asReadonly();

  totalItems = computed(() => this._items().reduce((acc, item) => acc + item.quantity, 0));
  totalPrice = computed(() => this._items().reduce((acc, item) => acc + item.price * item.quantity, 0));

  constructor() {
    // Sync cartCount signal in AuthService
    this.auth.cartCount.set(this.totalItems());
  }

  addItem(product: Product, quantity: number = 1) {
    const current = this._items();
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
          cartItemId: Date.now(), // temporary local id
          productId: product.productId,
          name: product.name,
          imageUrl: product.imageUrl ?? '',
          price: product.finalPrice ?? product.price,
          quantity: quantity,
        },
      ];
    }

    this.saveCart(updated);
  }

  removeItem(productId: number) {
    const updated = this._items().filter((item) => item.productId !== productId);
    this.saveCart(updated);
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const updated = this._items().map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    this.saveCart(updated);
  }

  clearCart() {
    this.saveCart([]);
  }

  private saveCart(items: CartItem[]) {
    this._items.set(items);
    localStorage.setItem('cart_items', JSON.stringify(items));
    this.auth.cartCount.set(this.totalItems());
  }

  private loadCart(): CartItem[] {
    const raw = localStorage.getItem('cart_items');
    return raw ? JSON.parse(raw) : [];
  }
}
