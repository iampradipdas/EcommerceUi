import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order, OrdersService } from '../../../core/services/orders-service';
import { CurrencyInrPipe } from '../../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-order-history',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, CurrencyInrPipe],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistoryComponent implements OnInit {
  private ordersService = inject(OrdersService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  errorMsg = signal('');

  ngOnInit() {
    this.ordersService.getOrderHistory().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load your order history. Please try again.');
        this.isLoading.set(false);
      },
    });
  }
}
