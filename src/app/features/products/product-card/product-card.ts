import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product';
import { DiscountPipe } from '../../../shared/pipes/discount.pipe';
import { CurrencyInrPipe } from '../../../shared/pipes/currency-inr.pipe';
import { LazyImageDirective } from '../../../shared/directives/lazy-image.directive';
import { ProductImagePipe } from '../../../shared/pipes/product-image.pipe';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ CommonModule,
    RouterLink,
    DiscountPipe,
    CurrencyInrPipe,
    LazyImageDirective,
    ProductImagePipe
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() toggleWishlist = new EventEmitter<Product>();

  onAddToCart(event: Event) {
    event.stopPropagation();    // prevent triggering the card's routerLink
    event.preventDefault();
    this.addToCart.emit(this.product);
  }

  onToggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.toggleWishlist.emit(this.product);
  }

}
