export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'UNPAID' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export type PaymentMethod = 'COD' | 'BANKING' | 'MOMO' | 'VNPAY';

export type OrderFilter = {
  keyword?: string;
  status?: OrderStatus | '';
  page?: number;
  size?: number;
};

export type OrderSummaryItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  imageUrl?: string;
};

export type Order = {
  id: string;
  orderNumber?: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  customerName?: string;
  customerEmail?: string;
  customerAvatar?: string;
  customerTotalOrders?: number;
  items: OrderSummaryItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt?: string;

  // New fields for details UI
  shippingAddress?: string;
  note?: string;
  activityLog?: Array<{
    status: string;
    timestamp: string;
    isPrimary?: boolean;
  }>;
};

export type CheckoutSummary = {
  cartId: number;
  empty: boolean;
  message?: string;
  customerName?: string;
  customerPhone?: string;
  suggestedShippingAddress?: string;
  availablePaymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod;
  items: OrderSummaryItem[];
  totalItems: number;
  distinctItemCount: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  finalTotal: number;
};

export type CreateOrderRequest = {
  receiverName: string;
  phone: string;
  shippingAddress: string;
  city?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  note?: string;
  paymentMethod: PaymentMethod;
};
