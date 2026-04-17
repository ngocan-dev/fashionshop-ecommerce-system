'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common/form-field';

const createStaffSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional(),
});

export type CreateStaffFormValues = z.infer<typeof createStaffSchema>;

export function AdminCreateStaffForm({ onSubmit }: { onSubmit: (values: CreateStaffFormValues) => void }) {
  const form = useForm<CreateStaffFormValues>({ resolver: zodResolver(createStaffSchema), defaultValues: { fullName: '', email: '', password: '', role: 'STAFF' } });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField<CreateStaffFormValues> label="Full name" name="fullName" register={form.register} error={form.formState.errors.fullName} />
      <FormField<CreateStaffFormValues> label="Email" name="email" register={form.register} error={form.formState.errors.email} />
      <FormField<CreateStaffFormValues> label="Password" name="password" register={form.register} error={form.formState.errors.password} type="password" />
      <label className="block space-y-2">
        <span className="text-sm font-medium">Role</span>
        <select className="h-11 w-full rounded-2xl border border-input bg-background px-4" {...form.register('role')}>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>
      </label>
      <Button type="submit">Create staff account</Button>
    </form>
  );
}
