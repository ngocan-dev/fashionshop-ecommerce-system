export type InvoicePaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type Invoice = {
  id: number;
  orderId: number;
  invoiceNumber: string;
  tax?: number;
  totalAmount: number;
  note?: string;
  paymentStatus: InvoicePaymentStatus;
  issuedAt?: string;
};
