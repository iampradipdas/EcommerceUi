import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../products/services/product-service';
import { AdminOrdersService, AdminOrder } from '../../../core/services/admin-orders-service';
import { CurrencyInrPipe } from '../../../shared/pipes/currency-inr.pipe';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive, CurrencyInrPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private adminOrdersService = inject(AdminOrdersService);

  isLoading = signal(true);
  errorMsg = signal('');

  // Data signals
  products = signal<Product[]>([]);
  orders = signal<AdminOrder[]>([]);

  // Computed metrics
  totalOrders = computed(() => this.orders().length);
  
  totalRevenue = computed(() => 
    this.orders()
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0)
  );

  totalProducts = computed(() => this.products().filter(p => p.isActive).length);

  lowStockCount = computed(() => 
    this.products().filter(p => p.isActive && p.stock < 5).length
  );

  recentOrders = computed(() => this.orders().slice(0, 5));
  
  lowStockProducts = computed(() => 
    this.products().filter(p => p.isActive && p.stock < 5).slice(0, 5)
  );

  ngOnInit() {
    forkJoin({
      productsResult: this.productService.getAll({ pageSize: 1000 }),
      ordersResult: this.adminOrdersService.getAllOrders(),
    }).subscribe({
      next: (res) => {
        this.products.set(res.productsResult.data);
        this.orders.set(res.ordersResult);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load dashboard metrics.');
        this.isLoading.set(false);
      },
    });
  }
}
