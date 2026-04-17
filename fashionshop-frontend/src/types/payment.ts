import type { OrderStatus } from './order';

export type PaymentMethod = 'COD' | 'BANKING' | 'MOMO' | 'VNPAY';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'UNPAID' | 'PAID' | 'FAILED' | 'CANCELLED';

export type Payment = {
  paymentId: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus?: OrderStatus;
  message?: string;
  retryable?: boolean;
  gatewayTransactionId?: string;
  redirectUrl?: string;
  idempotencyKey?: string;
  paidAt?: string;
};

export type PayOrderRequest = {
  paymentMethod: PaymentMethod;
  idempotencyKey?: string;
  cardHolderName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  returnUrl?: string;
};
