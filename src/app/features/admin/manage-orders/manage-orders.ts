import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminOrder, AdminOrdersService } from '../../../core/services/admin-orders-service';
import { ToastService } from '../../../core/services/toast-service';
import { CurrencyInrPipe } from '../../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive, CurrencyInrPipe],
  templateUrl: './manage-orders.html',
  styleUrl: './manage-orders.css',
})
export class ManageOrdersComponent implements OnInit {
  private adminOrdersService = inject(AdminOrdersService);
  private toast = inject(ToastService);

  orders = signal<AdminOrder[]>([]);
  isLoading = signal(true);
  isModalOpen = signal(false);
  selectedOrder = signal<AdminOrder | null>(null);

  statusOptions = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.adminOrdersService.getAllOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.toast.show('Failed to retrieve store orders.', 'error');
        this.isLoading.set(false);
      },
    });
  }

  onStatusChange(orderId: number, newStatus: string) {
    this.adminOrdersService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.toast.show(`Order #${orderId} updated to ${newStatus}.`, 'success');
        
        // Reactively update the local orders signal array state
        this.orders.update((currentOrders) =>
          currentOrders.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
        );
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Failed to update order status.', 'error');
        // reload list to restore original selected dropdown state
        this.loadOrders();
      },
    });
  }

  openDetailsModal(order: AdminOrder) {
    this.selectedOrder.set(order);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.selectedOrder.set(null);
    this.isModalOpen.set(false);
  }
}
