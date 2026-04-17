import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';

type FormFieldProps<TFormValues extends FieldValues> = {
  label: string;
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  error?: { message?: string };
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  className?: string;
};

export function FormField<TFormValues extends FieldValues>({ label, name, register, error, type = 'text', placeholder, textarea = false, className }: FormFieldProps<TFormValues>) {
  return (
    <label className={cn('block space-y-2', className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      {textarea ? <Textarea aria-label={label} placeholder={placeholder} {...register(name)} /> : <Input aria-label={label} type={type} placeholder={placeholder} {...register(name)} />}
      {error ? <span className="text-sm text-danger">{error.message}</span> : null}
    </label>
  );
}
