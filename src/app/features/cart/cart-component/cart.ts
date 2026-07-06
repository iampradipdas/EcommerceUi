import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart-service';
import { CurrencyInrPipe } from '../../../shared/pipes/currency-inr.pipe';
import { AuthService } from '../../../core/services/auth-service';
import { ProductImagePipe } from '../../../shared/pipes/product-image.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CurrencyInrPipe, ProductImagePipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {
  protected cartService = inject(CartService);
  protected auth = inject(AuthService);

  incrementQty(productId: number, currentQty: number) {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  decrementQty(productId: number, currentQty: number) {
    this.cartService.updateQuantity(productId, currentQty - 1);
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId);
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your shopping cart?')) {
      this.cartService.clearCart();
    }
  }
}
