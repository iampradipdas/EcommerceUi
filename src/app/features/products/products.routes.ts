import { Routes } from '@angular/router';
import { productDetailResolver } from './resolvers/product-detail.resolver';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./product-list/product-list').then(c => c.ProductList)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./product-detail/product-detail').then(c => c.ProductDetail),
    resolve: {
      productDetail: productDetailResolver
    }
  }
];