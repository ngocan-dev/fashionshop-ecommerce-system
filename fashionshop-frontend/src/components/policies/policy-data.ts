export type PolicyAnchor = {
  id: string;
  label: string;
};

export const policyAnchors: PolicyAnchor[] = [
  { id: 'shipping-policy', label: 'Shipping Policy' },
  { id: 'return-refund', label: 'Return & Refund' },
  { id: 'privacy-policy', label: 'Privacy Policy' },
  { id: 'terms-conditions', label: 'Terms & Conditions' },
];
