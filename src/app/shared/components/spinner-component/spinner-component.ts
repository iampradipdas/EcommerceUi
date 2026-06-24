import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner-component',
  imports: [CommonModule],
  template: `
    @if (loader.isLoading()) {
      <div class="spinner-overlay">
        <div class="spinner"></div>
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      position: fixed; inset: 0;
      background: rgba(255,255,255,0.6);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999;
    }
    .spinner {
      width: 40px; height: 40px;
      border: 4px solid #e0e0e0;
      border-top-color: #5c6bc0;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class SpinnerComponent {
    loader = inject(LoadingService);

}
