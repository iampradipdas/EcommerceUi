// core/models/product.model.ts
export interface Product {
  productId:     number;
  name:          string;
  slug:          string;
  description:   string;
  price:         number;
  discountPrice: number | null;
  stock:         number;
  imageUrl:      string;
  category:      string;
  isActive:      boolean;
}

export interface CreateProductDto {
  name:          string;
  description:   string;
  price:         number;
  discountPrice?: number;
  stock:         number;
  categoryId:    number;
}