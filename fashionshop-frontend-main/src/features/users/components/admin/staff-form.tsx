'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateStaffAccountMutation, useUpdateStaffAccountMutation } from '@/features/users/hooks';
import type { StaffAccount } from '@/types/user';

type StaffFormValues = {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  password?: string;
};

type Props = {
  initialData?: StaffAccount;
};

export function StaffForm({ initialData }: Props) {
  const router = useRouter();
  const createMutation = useCreateStaffAccountMutation();
  const updateMutation = useUpdateStaffAccountMutation(initialData?.id || '');

  const { register, handleSubmit } = useForm<StaffFormValues>({
    defaultValues: {
      fullName: initialData?.fullName || '',
      email: initialData?.email || '',
      role: initialData?.role?.toLowerCase() || '',
      password: '',
    }
  });

  const onSubmit: SubmitHandler<StaffFormValues> = (data) => {
    if (initialData) {
      updateMutation.mutate({ fullName: data.fullName, email: data.email, role: data.role.toUpperCase() }, {
        onSuccess: () => {
          toast.success('Staff member updated successfully');
          router.push('/admin/staff-accounts');
        },
        onError: (err: any) => toast.error(err.message || 'Failed to update')
      });
    } else {
      if (!data.password) {
        toast.error('Password is required for new accounts');
        return;
      }
      createMutation.mutate({ fullName: data.fullName, email: data.email, password: data.password, role: data.role.toUpperCase() }, {
        onSuccess: () => {
          toast.success('Staff member created successfully');
          router.push('/admin/staff-accounts');
        },
        onError: (err: any) => toast.error(err.message || 'Failed to create')
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-10">
      {/* Section 1: Personal & Role (Left Column) */}
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-10">
        
        {/* Card: Personal Info */}
        <section className="bg-surface-container-lowest p-10 rounded-xl">
          <div className="mb-8">
            <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-bold">Step 01</span>
            <h3 className="text-xl font-bold tracking-tight font-headline mt-1">Personal Information</h3>
          </div>
          <div className="grid gap-8">
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block group-focus-within:text-black transition-colors">Full Name</label>
              <input 
                 {...register('fullName')}
                 required
                 className="w-full border-b border-outline-variant/30 bg-transparent py-3 focus:outline-none focus:border-black transition-all font-medium text-sm placeholder:text-neutral-300" 
                 placeholder="e.g. Alexander McQueen" 
                 type="text" 
              />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block group-focus-within:text-black transition-colors">Email Address</label>
                <input 
                  {...register('email')}
                  required
                  className="w-full border-b border-outline-variant/30 bg-transparent py-3 focus:outline-none focus:border-black transition-all font-medium text-sm placeholder:text-neutral-300" 
                  placeholder="alexander@18studio.com" 
                  type="email" 
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block group-focus-within:text-black transition-colors">Phone Number</label>
                <input 
                  {...register('phone')}
                  className="w-full border-b border-outline-variant/30 bg-transparent py-3 focus:outline-none focus:border-black transition-all font-medium text-sm placeholder:text-neutral-300" 
                  placeholder="+1 (555) 000-0000" 
                  type="tel" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Card: Role Selection */}
        <section className="bg-surface-container-lowest p-10 rounded-xl">
          <div className="mb-8">
            <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-bold">Step 02</span>
            <h3 className="text-xl font-bold tracking-tight font-headline mt-1">Access Role</h3>
          </div>
          <div className="relative group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block group-focus-within:text-black transition-colors">Assign Role</label>
            <select 
              {...register('role')}
              required
              className="w-full border-b border-outline-variant/30 bg-transparent py-3 focus:outline-none focus:border-black transition-all font-medium text-sm appearance-none cursor-pointer" 
            >
              <option disabled value="">Select a role...</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
            <span className="material-symbols-outlined absolute right-0 bottom-4 pointer-events-none text-neutral-400">expand_more</span>
          </div>
          <p className="mt-4 text-[10px] text-neutral-400 leading-relaxed italic">Admins have full console access. Staff members are limited by the permissions selected below.</p>
        </section>

        {/* Card: Security */}
        <section className="bg-surface-container-lowest p-10 rounded-xl">
          <div className="mb-8">
            <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-bold">Step 03</span>
            <h3 className="text-xl font-bold tracking-tight font-headline mt-1">Security Credentials</h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block group-focus-within:text-black transition-colors">{initialData ? 'New Password (Optional)' : 'Temporary Password'}</label>
              <input 
                {...register('password')}
                className="w-full border-b border-outline-variant/30 bg-transparent py-3 focus:outline-none focus:border-black transition-all font-medium text-sm placeholder:text-neutral-300" 
                placeholder="••••••••" 
                type="password" 
              />
            </div>
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block group-focus-within:text-black transition-colors">Confirm Password</label>
              <input 
                className="w-full border-b border-outline-variant/30 bg-transparent py-3 focus:outline-none focus:border-black transition-all font-medium text-sm placeholder:text-neutral-300" 
                placeholder="••••••••" 
                type="password" 
              />
            </div>
          </div>
        </section>
      </div>

      {/* Section 2: Permissions (Right Column) */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-10">
        
        {/* Card: Permissions */}
        <section className="bg-black text-white p-10 rounded-xl sticky top-10">
          <div className="mb-10">
            <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-bold">Final Step</span>
            <h3 className="text-xl font-bold tracking-tight font-headline mt-1">Granular Permissions</h3>
          </div>
          <div className="flex flex-col gap-6">
            {[
              "View Orders",
              "Manage Products",
              "Edit Customers",
              "View Financial Reports",
              "Manage Staff Accounts",
              "Inventory Adjustments"
            ].map((perm) => (
              <label key={perm} className="flex items-center justify-between group cursor-pointer">
                <span className="text-xs font-medium tracking-wide text-neutral-300 group-hover:text-white transition-colors">{perm}</span>
                <input className="form-checkbox h-4 w-4 bg-transparent border-neutral-600 rounded-sm text-white focus:ring-0 focus:ring-offset-0 transition-all checked:bg-neutral-400" type="checkbox" defaultChecked />
              </label>
            ))}
          </div>

          <div className="mt-12 pt-10 border-t border-neutral-800">
            <button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full bg-white text-black py-4 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Processing...' : initialData ? 'Save Changes' : 'Create Account'}
            </button>
            <button 
              type="button" 
              className="block w-full text-center mt-6 text-[10px] uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-colors"
              onClick={() => router.back()}
            >
              Cancel & Discard
            </button>
          </div>
        </section>

        {/* Decorative/Contextual Card */}
        <div className="relative h-48 rounded-xl overflow-hidden grayscale contrast-125 hidden lg:block">
          <img 
            alt="Interior of a luxury fashion studio" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnnFF-lecJDuGlbxjXRziflQ4lvbWtcD2l38IDFBvKxqp42X76VpArJLbHSQ9GaG2kyvej7oucfv0-lx_nuuAvbhwHLmnbnZwTXqIdDvD55VPvvFkdM-798ate2PpYzWEw1LQ_xOz39_jlD1I2vLqisDVNsATRrOC2Cd6DBnZPFBsFPFfIoIFnlAIEJ4qK3Jd7kb9CaksKZrtwM0IYKE-HDOm16SyBVBBWqxCr22jWFCih9394_B2jps9JQr61TII_ujrd9uG-YcAv" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <p className="text-[10px] font-medium tracking-widest text-white/80 uppercase">Internal Console · Studio Member Registration</p>
          </div>
        </div>
      </div>
    </form>
  );
}
