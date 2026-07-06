import { Routes } from '@angular/router';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./order-history-component/order-history').then((c) => c.OrderHistoryComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./order-detail-component/order-detail').then((c) => c.OrderDetailComponent),
  },
];
