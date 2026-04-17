'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../schemas';
import { useLoginMutation } from '../hooks';
import { FormField } from '@/components/common/form-field';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const mutation = useLoginMutation();
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
      <FormField<LoginFormValues> label="Email" name="email" register={form.register} error={form.formState.errors.email} placeholder="you@example.com" />
      <FormField<LoginFormValues> label="Password" name="password" register={form.register} error={form.formState.errors.password} type="password" placeholder="••••••••" />
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Signing in...' : 'Log in'}
      </Button>
    </form>
  );
}
