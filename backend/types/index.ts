/**
 * Core domain types and JWT payload.
 * Model instance types are used by Express Request (user) and controllers.
 */

export interface UserInstance {
  id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductInstance {
  id: string;
  title: string;
  description: string;
  images: string[] | Record<string, unknown>;
  banners: string[] | Record<string, unknown>;
  isFeatured: boolean;
  price: string | number;
  category: string;
  countInStock: number;
  rating: string | number;
  numReviews: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderInstance {
  id: string;
  userId?: string;
  shippingAddress: Record<string, unknown>;
  paymentMethod: string;
  itemsPrice: string | number;
  shippingPrice: string | number;
  taxPrice: string | number;
  totalPrice: string | number;
  isPaid: boolean;
  paidAt?: Date | null;
  isDelivered: boolean;
  deliveredAt?: Date | null;
  paymentResult?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItemInstance {
  id: string;
  orderId?: string;
  title: string;
  images: string[] | Record<string, unknown>;
  quantity: number;
  product: string;
  price: string | number;
}

export interface ProductReviewInstance {
  id: string;
  productId?: string;
  userId?: string;
  title: string;
  description: string;
  rate: number;
  userName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MessageInstance {
  id: string;
  email: string;
  text: string;
}

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface ShippingAddress {
  fullName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderItemInput {
  title: string;
  images: string[] | Record<string, unknown>;
  quantity: number;
  product: string;
  price: number;
}
