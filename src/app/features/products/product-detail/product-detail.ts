import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductDetailData } from '../resolvers/product-detail.resolver';
import { CurrencyInrPipe } from '../../../shared/pipes/currency-inr.pipe';
import { DiscountPipe } from '../../../shared/pipes/discount.pipe';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { LazyImageDirective } from '../../../shared/directives/lazy-image.directive';
import { ProductImagePipe } from '../../../shared/pipes/product-image.pipe';
import { AuthService } from '../../../core/services/auth-service';
import { CartService } from '../../../core/services/cart-service';
import { ReviewService } from '../services/review-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    CurrencyInrPipe,
    DiscountPipe,
    TimeAgoPipe,
    LazyImageDirective,
    ReactiveFormsModule,
    ProductImagePipe
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  protected auth = inject(AuthService);
  private cartService = inject(CartService);
  private reviewService = inject(ReviewService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  // Read resolved data
  productDetail = signal<ProductDetailData>(this.route.snapshot.data['productDetail']);

  // Computed shortcuts
  product = computed(() => this.productDetail().product);
  reviews = computed(() => this.productDetail().reviews);
  summary = computed(() => this.productDetail().summary);

  quantity = signal<number>(1);
  isSubmittingReview = signal(false);
  activeTab = signal<'description' | 'reviews'>('description');

  reviewForm: FormGroup = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(5)]],
  });

  get comment() {
    return this.reviewForm.get('comment')!;
  }

  incrementQty() {
    if (this.quantity() < this.product().stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decrementQty() {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  setTab(tab: 'description' | 'reviews') {
    this.activeTab.set(tab);
  }

  onSubmitReview() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.isSubmittingReview.set(true);
    const dto = {
      productId: this.product().productId,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
    };

    this.reviewService.create(dto).subscribe({
      next: () => {
        // Refresh reviews and summary
        this.reviewService.getByProduct(dto.productId).subscribe((reviews) => {
          this.reviewService.getSummary(dto.productId).subscribe((summary) => {
            this.productDetail.update((detail) => ({
              ...detail,
              reviews,
              summary,
            }));
            this.isSubmittingReview.set(false);
            this.reviewForm.reset({ rating: 5, comment: '' });
            this.toast.show('Review submitted successfully!', 'success');
          });
        });
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Failed to submit review.', 'error');
        this.isSubmittingReview.set(false);
      },
    });
  }

  addToCart() {
    const prod = this.product();
    if (prod.stock <= 0) return;
    
    this.cartService.addItem(prod, this.quantity());
    this.toast.show(`Added ${this.quantity()} x ${prod.name} to cart`, 'success');
  }
}
