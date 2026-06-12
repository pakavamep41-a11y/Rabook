export type UserRole = "client" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export interface ProductOptionValue {
  value: string;
  label: string;
  priceFactor: number; // added to base price
}

export interface ProductOption {
  id: string;
  name: string;
  label: string;
  values: ProductOptionValue[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  options: ProductOption[];
}

export interface CartItemOptions {
  [optionId: string]: string; // optionId -> value
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  options: CartItemOptions;
  optionsLabels: { [key: string]: string };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  fileName?: string;
  filePreview?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  options: { [key: string]: string };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  fileName?: string;
}

export type OrderStatus = "pending" | "preparing" | "printing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  isAdmin: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  messages: ChatMessage[];
  lastMessageAt: string;
  unreadCount: number;
}
