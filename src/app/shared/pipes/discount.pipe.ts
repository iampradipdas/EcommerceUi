import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount',
  standalone: true,
})
export class DiscountPipe implements PipeTransform {
  transform(price: number, discountPrice: number | null | undefined): string {
    if (!discountPrice || discountPrice >= price) return '';
    const pct = Math.round(((price - discountPrice) / price) * 100);
    return `${pct}% OFF`;
  }
}
