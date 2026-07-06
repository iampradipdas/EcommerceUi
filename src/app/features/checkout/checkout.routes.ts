import { Routes } from '@angular/router';
import { checkoutGuard } from '../../core/guards/checkout-guard';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./checkout-component/checkout').then((c) => c.CheckoutComponent),
    canDeactivate: [checkoutGuard],
  },
];
