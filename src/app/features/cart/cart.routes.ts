import { Routes } from '@angular/router';

export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart-component/cart').then((c) => c.CartComponent),
  },
];
