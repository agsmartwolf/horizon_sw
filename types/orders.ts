export const ORDER_STATUS = {
  PENDING: 'pending',
  DRAFT: 'draft',
  PAYMENT_PENDING: 'payment_pending',
  DELIVERY_PENDING: 'delivery_pending',
  HOLD: 'hold',
  COMPLETE: 'complete',
  CANCELED: 'canceled',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ORDER_STATUS = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
