import { SiteShell } from '@/components/layout/site-shell';
import { AuthPage } from '@/components/auth/auth-page';

export default function AuthRoutePage() {
  return (
    <SiteShell>
      <AuthPage initialTab="login" />
    </SiteShell>
  );
}