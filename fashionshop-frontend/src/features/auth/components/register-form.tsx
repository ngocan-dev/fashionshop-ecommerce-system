'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '../schemas';
import { useRegisterMutation } from '../hooks';
import { FormField } from '@/components/common/form-field';
import { Button } from '@/components/ui/button';

export function RegisterForm() {
  const mutation = useRegisterMutation();
  const form = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema), defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' } });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <FormField<RegisterFormValues> label="Full name" name="fullName" register={form.register} error={form.formState.errors.fullName} placeholder="Ava Chen" />
      <FormField<RegisterFormValues> label="Email" name="email" register={form.register} error={form.formState.errors.email} placeholder="you@example.com" />
      <FormField<RegisterFormValues> label="Password" name="password" register={form.register} error={form.formState.errors.password} type="password" placeholder="••••••••" />
      <FormField<RegisterFormValues> label="Confirm password" name="confirmPassword" register={form.register} error={form.formState.errors.confirmPassword} type="password" placeholder="••••••••" />
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
