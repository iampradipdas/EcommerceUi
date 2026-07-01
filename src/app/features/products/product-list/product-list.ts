import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductCard } from '../product-card/product-card';
import { ProductQuery, ProductService } from '../services/product-service';
import { ToastService } from '../../../core/services/toast-service';
import { CartService } from '../../../core/services/cart-service';
import { Product } from '../../../core/models/product';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);

  // ─── Filter state — all Signals ─────────────────────────────────────────
  searchTerm = signal('');
  categoryId = signal<number | null>(null);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  onSaleOnly = signal(false);
  sortBy = signal('createdAt');
  sortOrder = signal('desc');
  currentPage = signal(1);
  pageSize = signal(12);

  // ─── Result state ────────────────────────────────────────────────────────
  products = signal<Product[]>([]);
  totalCount = signal(0);
  totalPages = signal(0);
  isLoading = signal(false);

  // ─── Computed values — auto-recalculate when dependencies change ─────────
  hasActiveFilters = computed(
    () =>
      !!this.searchTerm() ||
      this.categoryId() !== null ||
      this.minPrice() !== null ||
      this.maxPrice() !== null ||
      this.onSaleOnly(),
  );

  showingFrom = computed(() =>
    this.products().length === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1,
  );

  showingTo = computed(() => Math.min(this.currentPage() * this.pageSize(), this.totalCount()));

  // RxJS Subject — used to debounce search input
  private searchSubject = new Subject<string>();

  constructor() {
    // ─── Debounced search — waits 400ms after typing stops ─────────────────
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((term) => {
      this.searchTerm.set(term);
      this.currentPage.set(1); // reset to page 1 on new search
    });

    // ─── effect() — re-fetches products whenever ANY filter signal changes ─
    effect(() => {
      // Reading these signals inside effect() makes it re-run when they change
      const query: ProductQuery = {
        search: this.searchTerm() || undefined,
        categoryId: this.categoryId() ?? undefined,
        minPrice: this.minPrice() ?? undefined,
        maxPrice: this.maxPrice() ?? undefined,
        onSale: this.onSaleOnly() || undefined,
        sortBy: this.sortBy(),
        sortOrder: this.sortOrder(),
        page: this.currentPage(),
        pageSize: this.pageSize(),
      };

      this.fetchProducts(query);
    });
  }

  private fetchProducts(query: ProductQuery) {
    this.isLoading.set(true);

    this.productService.getAll(query).subscribe({
      next: (result) => {
        this.products.set(result.data);
        this.totalCount.set(result.totalCount);
        this.totalPages.set(result.totalPages);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  // ─── Event handlers from template ───────────────────────────────────────
  onSearchInput(value: string) {
    this.searchSubject.next(value);
  }

  onCategoryChange(id: number | null) {
    this.categoryId.set(id);
    this.currentPage.set(1);
  }

  onPriceRangeChange() {
    this.currentPage.set(1);
  }

  onSortChange(value: string) {
    const [by, order] = value.split('-');
    this.sortBy.set(by);
    this.sortOrder.set(order);
  }

  toggleOnSale() {
    this.onSaleOnly.update((v) => !v);
    this.currentPage.set(1);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.categoryId.set(null);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.onSaleOnly.set(false);
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Add to cart from card click ────────────────────────────────────────
  onAddToCart(product: Product) {
    this.cartService.addItem(product, 1);
    this.toast.show(`${product.name} added to cart`, 'success');
  }

  onToggleWishlist(product: Product) {
    // wishlist logic here
  }
}
