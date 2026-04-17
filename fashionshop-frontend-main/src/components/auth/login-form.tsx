import type { ChangeEvent, FormEvent } from 'react';

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

type LoginFormProps = {
  values: LoginValues;
  errors: LoginErrors;
  onChange: (field: keyof LoginValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs font-medium text-red-600">{message}</p>;
}

export function LoginForm({ values, errors, onChange, onSubmit }: LoginFormProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="login-email" className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Email Address
        </label>
        <input
          id="login-email"
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
        <div className="mb-2 flex items-center justify-between gap-4">
          <label htmlFor="login-password" className="block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Password
          </label>
          <button type="button" className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-400 transition hover:text-zinc-700">
            Forgot Password?
          </button>
        </div>
        <input
          id="login-password"
          type="password"
          value={values.password}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange('password', event.target.value)}
          className="h-12 w-full border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-300 focus:border-zinc-400"
          placeholder="••••••••"
          aria-invalid={Boolean(errors.password)}
        />
        <FieldError message={errors.password} />
      </div>

      <button
        type="submit"
        className="h-12 w-full bg-zinc-950 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-zinc-800"
      >
        Sign In
      </button>
    </form>
  );
}

export type { LoginErrors, LoginValues };