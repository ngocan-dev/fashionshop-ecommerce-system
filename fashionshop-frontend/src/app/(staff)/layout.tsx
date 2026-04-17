import { RoleShell } from '@/components/layout/role-shell';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role="STAFF">{children}</RoleShell>;
}
