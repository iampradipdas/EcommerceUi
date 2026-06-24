import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = this.nextId++;

    // Add toast to array
    this.toasts.update((list) => [...list, { id, message, type }]);

    // Auto-remove after duration
    setTimeout(() => {
      this.toasts.update((list) => list.filter((t) => t.id !== id));
    }, duration);
  }
}
