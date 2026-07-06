import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then((c) => c.DashboardComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./manage-products/manage-products').then((c) => c.ManageProductsComponent),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./manage-orders/manage-orders').then((c) => c.ManageOrdersComponent),
  },
];