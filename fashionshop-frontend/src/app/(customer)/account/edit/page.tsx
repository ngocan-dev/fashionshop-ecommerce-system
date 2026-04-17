'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingState } from '@/components/common/loading-state';
import { useMeQuery, useUpdateMeMutation } from '@/features/users/hooks';
import { ProfileForm } from '@/features/users/components/profile-form';
import { toast } from 'sonner';

export default function EditAccountPage() {
  const meQuery = useMeQuery();
  const updateMutation = useUpdateMeMutation();

  if (meQuery.isLoading) return <LoadingState label="Loading profile" />;
  if (!meQuery.data) return <EmptyState title="Profile unavailable" actionLabel="Go back" actionHref="/account" />;

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-semibold">Edit profile</h1>
      </CardHeader>
      <CardContent>
        <ProfileForm user={meQuery.data} onSubmit={(values) => updateMutation.mutate(values, { onSuccess: () => toast.success('Profile saved') })} />
      </CardContent>
    </Card>
  );
}
