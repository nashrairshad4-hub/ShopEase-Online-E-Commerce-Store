export type CategoryType = 
  | 'Electronics'
  | 'Fashion'
  | 'Shoes'
  | 'Beauty'
  | 'Home & Kitchen'
  | 'Accessories';

export interface Category {
  id: number;
  name: CategoryType;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  itemCount: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  price: number;
  discount_price?: number;
  category: CategoryType;
  stock: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_latest: boolean;
  created_at: string;
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export type PaymentMethod = 'card' | 'cod' | 'paypal';

export interface Order {
  id: string;
  order_number: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total_amount: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  created_at: string;
  estimated_delivery?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  role: 'customer' | 'admin';
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}
