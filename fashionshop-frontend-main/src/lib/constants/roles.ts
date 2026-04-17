export const roles = ['GUEST', 'CUSTOMER', 'STAFF', 'ADMIN'] as const;

export type Role = (typeof roles)[number];
