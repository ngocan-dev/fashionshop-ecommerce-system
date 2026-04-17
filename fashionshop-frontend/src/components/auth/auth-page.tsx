'use client';

import { useState } from 'react';
import { AuthTabs, type AuthTab } from './auth-tabs';
import { LoginForm, type LoginErrors, type LoginValues } from './login-form';
import { RegisterForm, type RegisterErrors, type RegisterValues } from './register-form';
import { useLoginMutation, useRegisterMutation } from '@/features/auth/hooks';

type AuthPageProps = {
  initialTab?: AuthTab;
};

const initialLoginValues: LoginValues = {
  email: '',
  password: '',
};

const initialRegisterValues: RegisterValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function validateEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

export function AuthPage({ initialTab = 'login' }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [loginValues, setLoginValues] = useState<LoginValues>(initialLoginValues);
  const [registerValues, setRegisterValues] = useState<RegisterValues>(initialRegisterValues);
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});
  const [statusMessage, setStatusMessage] = useState('');

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  function handleLogin() {
    loginMutation.mutate({ email: loginValues.email, password: loginValues.password });
  }

  function handleRegister() {
    registerMutation.mutate({
      fullName: registerValues.fullName,
      email: registerValues.email,
      password: registerValues.password,
      confirmPassword: registerValues.confirmPassword,
    });
  }

  function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: LoginErrors = {};
    if (!loginValues.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!validateEmail(loginValues.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!loginValues.password.trim()) {
      nextErrors.password = 'Password is required.';
    }

    setLoginErrors(nextErrors);
    setStatusMessage('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    handleLogin();
  }

  function submitRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: RegisterErrors = {};
    if (!registerValues.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!registerValues.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!validateEmail(registerValues.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!registerValues.password.trim()) {
      nextErrors.password = 'Password is required.';
    }

    if (!registerValues.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (registerValues.confirmPassword !== registerValues.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setRegisterErrors(nextErrors);
    setStatusMessage('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    handleRegister();
  }

  return (
    <main className="min-h-screen bg-[#efefec] text-zinc-900 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(460px,520px)_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden bg-[linear-gradient(180deg,rgba(34,34,34,0.08),rgba(34,34,34,0.22))] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_38%),linear-gradient(180deg,rgba(232,232,232,0.9),rgba(196,196,196,0.82))]" />
        <div className="absolute inset-y-0 left-8 w-px bg-black/20" />
        <div className="absolute bottom-8 left-14 h-24 w-24 rounded-full border border-black/15" />
        <div className="absolute bottom-10 left-20 h-36 w-28 border border-black/10 bg-white/25 shadow-[0_0_120px_rgba(0,0,0,0.08)] backdrop-blur-sm" />
      </aside>

      <section className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-6 lg:py-10">
        <div className="w-full max-w-[420px] bg-white px-6 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)] ring-1 ring-black/5 sm:px-10 sm:py-10">
          <div className="space-y-3 text-center">
            <h1 className="text-[clamp(3rem,8vw,4.75rem)] font-black leading-none tracking-[-0.06em] text-zinc-950">ACCOUNT</h1>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.34em] text-zinc-400">Access your account</p>
          </div>

          <div className="mt-8">
            <AuthTabs activeTab={activeTab} onChange={(tab) => setActiveTab(tab)} />
          </div>

          <div className="mt-8">
            {activeTab === 'login' ? (
              <LoginForm
                values={loginValues}
                errors={loginErrors}
                onChange={(field, value) => setLoginValues((current) => ({ ...current, [field]: value }))}
                onSubmit={submitLogin}
              />
            ) : (
              <RegisterForm
                values={registerValues}
                errors={registerErrors}
                onChange={(field, value) => setRegisterValues((current) => ({ ...current, [field]: value }))}
                onSubmit={submitRegister}
              />
            )}
          </div>

          {statusMessage ? <p className="mt-5 text-center text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">{statusMessage}</p> : null}
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-[linear-gradient(180deg,rgba(24,24,24,0.98),rgba(60,60,60,0.86))] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_30%,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_50%_65%,rgba(255,255,255,0.06),transparent_28%)]" />
        <div className="absolute inset-x-14 top-10 h-80 rounded-[50%] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.01))] blur-[0.5px]" />
        <div className="absolute inset-x-20 bottom-20 h-40 rounded-[48%] border border-white/5 bg-black/25" />
      </aside>
    </main>
  );
}
