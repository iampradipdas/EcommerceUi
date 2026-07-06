// core/models/cart.model.ts
export interface CartItem {
  cartItemId: number;
  productId:  number;
  name:       string;
  imageUrl:   string;
  price:      number;
  quantity:   number;
  stock:      number;
}

export interface Cart {
  items:      CartItem[];
  totalItems: number;
  totalPrice: number;
}