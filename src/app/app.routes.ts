import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
   {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  // Auth — public pages
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Products — public
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES)
  },

  // Cart — public access (stores locally if guest, syncs to DB if logged in)
  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart/cart.routes').then(m => m.CART_ROUTES)
  },

  // Checkout — logged-in user only
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/checkout/checkout.routes').then(m => m.CHECKOUT_ROUTES)
  },

  // Orders — logged-in user only
  {
    path: 'orders',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/orders/orders.routes').then(m => m.ORDER_ROUTES)
  },

  // Admin — Admin role only
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // 404
  {
    path: '**',
    redirectTo: 'products'
  }
];
