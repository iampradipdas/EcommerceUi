import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'productImage',
  standalone: true,
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      // Return a sleek placeholder image if no image path is defined
      return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300';
    }

    if (value.startsWith('/uploads') || value.startsWith('uploads')) {
      // Remove '/api' from the backend API url to get the server root (e.g. https://localhost:7095)
      const baseUrl = environment.apiUrl.replace(/\/api$/, '');
      const path = value.startsWith('/') ? value : `/${value}`;
      return `${baseUrl}${path}`;
    }

    return value;
  }
}
