'use client';

import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CheckoutSummary } from '@/types/order';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().min(6, 'Required'),
  addressLine1: z.string().min(3, 'Required'),
  city: z.string().min(1, 'Required'),
  postalCode: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  paymentMethod: z.enum(['COD', 'MOMO', 'BANKING']),
  note: z.string().optional(),
});

type FormFields = z.infer<typeof checkoutSchema>;

export type CheckoutFormValues = {
  receiverName: string;
  phone: string;
  shippingAddress: string;
  paymentMethod: 'COD' | 'MOMO' | 'BANKING';
  note?: string;
};

const paymentOptions = [
  { value: 'BANKING' as const, label: 'Banking', icon: 'credit_card' },
  { value: 'MOMO' as const, label: 'Momo', icon: 'account_balance_wallet' },
  { value: 'COD' as const, label: 'Cash', icon: 'local_shipping' },
];

export function CheckoutForm({
  onSubmit,
}: {
  summary: CheckoutSummary;
  onSubmit: (values: CheckoutFormValues) => void;
}) {
  const form = useForm<FormFields>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      addressLine1: '',
      city: '',
      postalCode: '',
      email: '',
      paymentMethod: 'COD',
      note: '',
    },
  });

  const selectedMethod = form.watch('paymentMethod');

  const handleSubmit = (data: FormFields) => {
    onSubmit({
      receiverName: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      shippingAddress: `${data.addressLine1}\n${data.city}, ${data.postalCode}`,
      paymentMethod: data.paymentMethod,
      note: data.note,
    });
  };

  return (
    <form id="checkout-form" onSubmit={form.handleSubmit(handleSubmit)}>
      {/* 01 Shipping Information */}
      <section className="mb-14">
        <h2 className="font-headline mb-10 text-xl font-black tracking-tight md:text-2xl">
          01 Shipping Information
        </h2>
        <div className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
          <UnderlineInput registration={form.register('firstName')} placeholder="First Name" error={form.formState.errors.firstName?.message} />
          <UnderlineInput registration={form.register('lastName')} placeholder="Last Name" error={form.formState.errors.lastName?.message} />
          <UnderlineInput registration={form.register('phone')} placeholder="Phone Number" error={form.formState.errors.phone?.message} />
          <UnderlineInput registration={form.register('addressLine1')} placeholder="Address Line 1" error={form.formState.errors.addressLine1?.message} />
          <UnderlineInput registration={form.register('city')} placeholder="City" error={form.formState.errors.city?.message} />
          <UnderlineInput registration={form.register('postalCode')} placeholder="Postal Code" error={form.formState.errors.postalCode?.message} />
          <UnderlineInput registration={form.register('email')} placeholder="Email Address" error={form.formState.errors.email?.message} />
        </div>
      </section>

      {/* 02 Delivery Method */}
      <section className="mb-14">
        <h2 className="font-headline mb-10 text-xl font-black tracking-tight md:text-2xl">
          02 Delivery Method
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border-2 border-black bg-white px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-black">
                <div className="h-2.5 w-2.5 rounded-full bg-black" />
              </div>
              <div>
                <p className="text-sm font-bold">Standard Atelier Shipping</p>
                <p className="text-xs text-[#999999]">5–7 Business Days</p>
              </div>
            </div>
            <p className="text-sm font-bold">Complimentary</p>
          </div>
          <div className="flex cursor-not-allowed items-center justify-between rounded-lg border border-[#e8e8e8] bg-white px-6 py-5 opacity-40">
            <div className="flex items-center gap-4">
              <div className="h-5 w-5 rounded-full border-2 border-[#d4d4d4]" />
              <div>
                <p className="text-sm font-bold">Priority Curated Delivery</p>
                <p className="text-xs text-[#999999]">Next Business Day</p>
              </div>
            </div>
            <p className="text-sm font-bold">$25.00</p>
          </div>
        </div>
      </section>

      {/* 03 Payment Method */}
      <section className="mb-14">
        <h2 className="font-headline mb-10 text-xl font-black tracking-tight md:text-2xl">
          03 Payment Method
        </h2>
        <div className="mb-10 grid grid-cols-3 gap-3">
          {paymentOptions.map((option) => {
            const isSelected = selectedMethod === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer flex-col items-center gap-2.5 rounded-lg border-2 px-4 py-6 transition-all ${isSelected ? 'border-black' : 'border-[#e8e8e8] hover:border-[#ccc]'
                  }`}
              >
                <input type="radio" value={option.value} {...form.register('paymentMethod')} className="sr-only" />
                <span className="text-sm font-medium">{option.label}</span>
                <span className={`material-symbols-outlined text-xl ${isSelected ? 'text-black' : 'text-[#bbbbbb]'}`}>
                  {option.icon}
                </span>
              </label>
            );
          })}
        </div>

        {/* Order notes as underline input */}
        <div className="border-b border-[#e0e0e0] pb-3 transition-colors focus-within:border-black">
          <input
            {...form.register('note')}
            placeholder="Order notes (optional)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#999999]"
          />
        </div>
      </section>

      {/* Security badges */}
      <div className="flex items-center gap-8 text-xs text-[#aaaaaa]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">lock</span>
          <span>SSL Encrypted Secure Connection</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span>PCI Compliance Level 1</span>
        </div>
      </div>
    </form>
  );
}

function UnderlineInput({
  registration,
  placeholder,
  error,
}: {
  registration: UseFormRegisterReturn;
  placeholder: string;
  error?: string;
}) {
  return (
    <div>
      <div className="border-b border-[#e0e0e0] pb-3 transition-colors focus-within:border-black">
        <input
          {...registration}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#999999]"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
