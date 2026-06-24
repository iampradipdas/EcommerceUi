import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-toast-component',
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{ toast.type }}">
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 10000;
      }
      .toast {
        padding: 12px 18px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        min-width: 260px;
        animation: slideIn 0.2s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      }
      .toast-success {
        background: #e8f5e9;
        color: #2e7d32;
        border-left: 4px solid #43a047;
      }
      .toast-error {
        background: #fdecea;
        color: #c62828;
        border-left: 4px solid #e53935;
      }
      .toast-info {
        background: #e3f2fd;
        color: #1565c0;
        border-left: 4px solid #1e88e5;
      }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,
  ],
})
export class ToastComponent {
  toastService = inject(ToastService);
}
