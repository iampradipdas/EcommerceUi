import { Routes } from '@angular/router';

// features/admin/admin.routes.ts
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
//   {
//     path: 'dashboard',
//     loadComponent: () =>
//       import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
//   },
//   {
//     path: 'products',
//     loadComponent: () =>
//       import('./manage-products/manage-products.component').then(c => c.ManageProductsComponent)
//   },
//   {
//     path: 'orders',
//     loadComponent: () =>
//       import('./manage-orders/manage-orders.component').then(c => c.ManageOrdersComponent)
//   }
];