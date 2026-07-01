// core/models/product.model.ts
export interface Product {
  productId:     number;
  name:          string;
  slug:          string;
  description:   string | null;
  price:         number;
  discountPrice: number | null;
  stock:         number;
  imageUrl:      string | null;
  isActive:      boolean;
  createdAt:     string;
  categoryName:  string;
  finalPrice:    number;
  isOnSale:      boolean;
  discountPercent: number;
}

export interface CreateProductDto {
  name:          string;
  description:   string;
  price:         number;
  discountPrice?: number;
  stock:         number;
  categoryId:    number;
}