export type ProductReview = {
  id: string;
  title: string;
  description: string;
  rate: number;
  userName: string;
  createdAt: Date;
  ProductId: string;
  UserId: string;
  Product?: Product;
  User?: User;
};

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  banners: string[];
  price: number;
  category: string;
  countInStock: number;
  rating: number;
  numReviews: number;
  ProductReviews?: ProductReview[];
}

export type DataProducts = {
  products: Product[];
  pages: number;
};

export type DataReviews = {
  reviews: ProductReview[];
  pages: number;
};

export type MessageProps = {
  message: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  ProductReviews?: ProductReview[];
  Orders?: Order[];
};

export type OrderItem = {
  id: string;
  title: string;
  images: string[];
  quantity: number;
  product: string;
  price: number;
  OrderId: string;
  Order?: Order;
};

export type Order = {
  id: string;
  shippingAddress: { address: string; city: string; code: string };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  UserId: string;
  OrderItems?: OrderItem[];
  User?: User;
};
