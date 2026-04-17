import type { ChangeEvent, FormEvent } from 'react';

type RegisterValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>;

type RegisterFormProps = {
  values: RegisterValues;
  errors: RegisterErrors;
  onChange: (field: keyof RegisterValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs font-medium text-red-600">{message}</p>;
}

export function RegisterForm({ values, errors, onChange, onSubmit }: RegisterFormProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="register-full-name" className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Full Name
        </label>
        <input
          id="register-full-name"
          type="text"
          value={values.fullName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange('fullName', event.target.value)}
          className="h-12 w-full border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-400"
          placeholder="Ava Chen"
          aria-invalid={Boolean(errors.fullName)}
        />
        <FieldError message={errors.fullName} />
      </div>

      <div>
        <label htmlFor="register-email" className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Email Address
        </label>
        <input
          id="register-email"
          type="email"
          value={values.email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange('email', event.target.value)}
          className="h-12 w-full border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-400"
          placeholder="your@email.com"
          aria-invalid={Boolean(errors.email)}
        />
        <FieldError message={errors.email} />
      </div>

      <div>
        <label htmlFor="register-password" className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          value={values.password}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange('password', event.target.value)}
          className="h-12 w-full border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-400"
          placeholder="••••••••"
          aria-invalid={Boolean(errors.password)}
        />
        <FieldError message={errors.password} />
      </div>

      <div>
        <label htmlFor="register-confirm-password" className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Confirm Password
        </label>
        <input
          id="register-confirm-password"
          type="password"
          value={values.confirmPassword}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange('confirmPassword', event.target.value)}
          className="h-12 w-full border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-400"
          placeholder="••••••••"
          aria-invalid={Boolean(errors.confirmPassword)}
        />
        <FieldError message={errors.confirmPassword} />
      </div>

      <button
        type="submit"
        className="h-12 w-full bg-zinc-950 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-zinc-800"
      >
        Create Account
      </button>
    </form>
  );
}

export type { RegisterErrors, RegisterValues };