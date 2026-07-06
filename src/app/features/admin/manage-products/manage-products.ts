import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductService } from '../../products/services/product-service';
import { ToastService } from '../../../core/services/toast-service';
import { CurrencyInrPipe } from '../../../shared/pipes/currency-inr.pipe';
import { Product } from '../../../core/models/product';
import { ProductImagePipe } from '../../../shared/pipes/product-image.pipe';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive, CurrencyInrPipe, ProductImagePipe],
  templateUrl: './manage-products.html',
  styleUrl: './manage-products.css',
})
export class ManageProductsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private toast = inject(ToastService);

  // States
  products = signal<Product[]>([]);
  isLoading = signal(true);
  isModalOpen = signal(false);
  isEditMode = signal(false);
  isUploading = signal(false);
  editingProductId: number | null = null;
  uploadedImageUrl = signal<string | null>(null);

  // hardcoded matching the filter categories
  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Books' },
  ];

  // Forms
  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
    price: [null, [Validators.required, Validators.min(0.01)]],
    discountPrice: [null, [Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoryId: [1, [Validators.required]],
    imageUrl: [''],
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    // Request a large page size to list them all for management
    this.productService.getAll({ pageSize: 1000 }).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toast.show('Failed to load products list.', 'error');
        this.isLoading.set(false);
      },
    });
  }

  openAddModal() {
    this.isEditMode.set(false);
    this.editingProductId = null;
    this.uploadedImageUrl.set(null);
    this.productForm.reset({
      name: '',
      description: '',
      price: null,
      discountPrice: null,
      stock: 0,
      categoryId: 1,
      imageUrl: '',
    });
    this.isModalOpen.set(true);
  }

  openEditModal(product: Product) {
    this.isEditMode.set(true);
    this.editingProductId = product.productId;
    this.uploadedImageUrl.set(product.imageUrl || null);
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  // 💡 INTERVIEW QUESTION: Multi-part form data uploads in Angular
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.isUploading.set(true);

    this.productService.uploadImageFile(file).subscribe({
      next: (res) => {
        this.uploadedImageUrl.set(res.imageUrl);
        this.productForm.patchValue({ imageUrl: res.imageUrl });
        this.toast.show('Image uploaded successfully!', 'success');
        this.isUploading.set(false);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Image upload failed.', 'error');
        this.isUploading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const payload = this.productForm.value;
    
    // Ensure discountPrice is null if not provided
    if (payload.discountPrice === '') {
      payload.discountPrice = null;
    }

    if (this.isEditMode()) {
      this.productService.updateProduct(this.editingProductId!, payload).subscribe({
        next: () => {
          this.toast.show('Product updated successfully.', 'success');
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Failed to update product.', 'error');
        },
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.toast.show('Product created successfully.', 'success');
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Failed to create product.', 'error');
        },
      });
    }
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.toast.show('Product soft deleted successfully.', 'success');
          this.loadProducts();
        },
        error: () => this.toast.show('Failed to delete product.', 'error'),
      });
    }
  }

  restoreProduct(productId: number) {
    this.productService.restoreProduct(productId).subscribe({
      next: () => {
        this.toast.show('Product restored successfully.', 'success');
        this.loadProducts();
      },
      error: () => this.toast.show('Failed to restore product.', 'error'),
    });
  }

  getCategoryName(catId: number): string {
    return this.categories.find((c) => c.id === catId)?.name || 'Unknown';
  }
}
