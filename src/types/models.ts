// Product Options
export type AttributeType = "select" | "quantity" | "dimensions" | "pages" | "numeric" | "boolean" | "file" | "turnaround";

export interface OptionBase {
  id: string;
  type: AttributeType;
  name: string;
  label: string;
  required: boolean;
  order: number;
}

export interface SelectOption extends OptionBase {
  type: "select";
  choices: { id: string; label: string; value: string; priceImpact?: number }[];
}

export interface QuantityOption extends OptionBase {
  type: "quantity";
  behavior: "tiered" | "free";
  tiers?: number[];
  min?: number;
  max?: number;
  step?: number;
}

export interface DimensionsOption extends OptionBase {
  type: "dimensions";
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  unit: "cm" | "mm" | "m";
}

export interface PagesOption extends OptionBase {
  type: "pages";
  min: number;
  max: number;
  multiplier: number;
}

export interface NumericOption extends OptionBase {
  type: "numeric";
  min: number;
  max: number;
  step: number;
}

export interface BooleanOption extends OptionBase {
  type: "boolean";
}

export interface FileOption extends OptionBase {
  type: "file";
  accept: string;
  maxSizeMB: number;
}

export interface TurnaroundOption extends OptionBase {
  type: "turnaround";
  choices: { id: string; label: string; days: number; priceImpact?: number }[];
}

export type ProductOption = SelectOption | QuantityOption | DimensionsOption | PagesOption | NumericOption | BooleanOption | FileOption | TurnaroundOption;

// Pricing Engines
export type PricingEngineType = "tier_table" | "area_based" | "per_page" | "formula";

export interface TierTablePricing {
  type: "tier_table";
  tiers: { quantity: number; unitPrice: number }[];
}

export interface AreaBasedPricing {
  type: "area_based";
  basePricePerSquareMeter: number;
  minArea: number;
}

export interface PerPagePricing {
  type: "per_page";
  basePrice: number;
  pricePerPage: number;
}

export interface FormulaPricing {
  type: "formula";
  basePrice: number;
  formula: string; // e.g. "basePrice + (width * height * 0.5)"
}

export type PricingEngine = TierTablePricing | AreaBasedPricing | PerPagePricing | FormulaPricing;

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  parentId: string | null;
  level: number;
  order: number;
  coverImage?: string;
  children?: Category[]; // For tree structure responses
}

export interface Product {
  id: string;
  slug: string;
  categoryId: string;
  title: string;
  excerpt: string;
  description: string;
  coverImage: string;
  gallery: string[];
  options: ProductOption[];
  pricing: PricingEngine;
  isActive: boolean;
  order: number;
}

// Users and Identity
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer" | "staff";
  avatar?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productTitle: string;
  productName?: string; // Compat
  quantity: number;
  specs: Record<string, any>; // Picked options key-value
  options?: Record<string, any>; // Compat
  optionsLabels?: Record<string, string>; // Compat UI labels
  files: string[]; // Uploaded file URLs
  fileName?: string; // Compat
  unitPrice: number;
  totalPrice: number;
  note?: string; // توضیحات کاربر
  thumbnail?: string; // Base64 or local url or real url
}
export type OrderStatus = "registered" | "in_review" | "pending_payment" | "file_rejected" | "printing" | "ready" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  quantity: number;
  specs: Record<string, any>; // Picked options key-value
  files: string[]; // Uploaded file URLs
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Chat system
export type MessageType = "text" | "file" | "order_update_proposal" | "payment_request" | "invoice" | "status_change" | "file_request" | "design_proof";

export interface ChatMessageBase {
  id: string;
  sessionId: string;
  senderId: string;
  senderRole: "admin" | "customer" | "staff";
  senderName?: string;
  senderAvatar?: string;
  type: MessageType;
  createdAt: string;
  seen?: boolean;
}

export interface TextMessage extends ChatMessageBase {
  type: "text";
  content: string;
}

export interface FileMessage extends ChatMessageBase {
  type: "file";
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export interface OrderUpdateProposalMessage extends ChatMessageBase {
  type: "order_update_proposal";
  proposalText: string;
  proposedChanges: { label: string; oldValue: string; newValue: string }[];
  oldTotal: number;
  newTotal: number;
  isAccepted?: boolean;
}

export interface PaymentRequestMessage extends ChatMessageBase {
  type: "payment_request";
  amount: number;
  reason: string;
  paymentUrl: string;
  isPaid: boolean;
}

export interface InvoiceMessage extends ChatMessageBase {
  type: "invoice";
  invoiceUrl: string;
  amount: number;
}

export interface StatusChangeMessage extends ChatMessageBase {
  type: "status_change";
  oldStatus: OrderStatus;
  newStatus: OrderStatus;
  note?: string;
}

export interface FileRequestMessage extends ChatMessageBase {
  type: "file_request";
  reason: string;
  isFulfilled: boolean;
}

export interface DesignProofMessage extends ChatMessageBase {
  type: "design_proof";
  proofUrl: string;
  notes: string;
  isApproved?: boolean;
}

export type ChatMessage = TextMessage | FileMessage | OrderUpdateProposalMessage | PaymentRequestMessage | InvoiceMessage | StatusChangeMessage | FileRequestMessage | DesignProofMessage;

export interface ChatSession {
  id: string;
  orderId: string;
  customerId: string;
  adminId?: string;
  messages: ChatMessage[];
  lastUpdatedAt: string;
}

// CMS
export interface CMSMenu {
  id: string;
  location: "header" | "footer";
  items: { id: string; label: string; url: string; order: number }[];
}

export interface CMSSlider {
  id: string;
  title: string;
  slides: { id: string; imageUrl: string; title: string; linkUrl?: string; order: number }[];
}

export interface CMSBlock {
  id: string;
  type: string; // 'hero_slider', 'rich_text', 'product_carousel', 'category_grid', 'banner_row', 'feature_list', 'faq_accordion', 'testimonials', 'video_embed', 'custom_html'
  props: Record<string, any>;
  order: number;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  seo?: {
    title?: string;
    description?: string;
  };
  blocks: CMSBlock[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml?: string; // Markdown or rich HTML
  coverImage?: string;
  createdAt: string;
  author: string;
  tags?: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}
