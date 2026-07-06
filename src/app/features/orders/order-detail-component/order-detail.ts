import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order, OrdersService } from '../../../core/services/orders-service';
import { CurrencyInrPipe } from '../../../shared/pipes/currency-inr.pipe';
import { ProductImagePipe } from '../../../shared/pipes/product-image.pipe';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CurrencyInrPipe, ProductImagePipe],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);

  order = signal<Order | null>(null);
  isLoading = signal(true);
  errorMsg = signal('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      this.errorMsg.set('Invalid Order ID.');
      this.isLoading.set(false);
      return;
    }

    this.ordersService.getOrderDetails(id).subscribe({
      next: (data) => {
        this.order.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Failed to load order details.');
        this.isLoading.set(false);
      },
    });
  }
}
