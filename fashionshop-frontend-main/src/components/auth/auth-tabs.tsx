import { cn } from '@/lib/utils/cn';

export type AuthTab = 'login' | 'register';

type AuthTabsProps = {
  activeTab: AuthTab;
  onChange: (tab: AuthTab) => void;
};

const tabs: Array<{ id: AuthTab; label: string }> = [
  { id: 'login', label: 'Login' },
  { id: 'register', label: 'Register' },
];

export function AuthTabs({ activeTab, onChange }: AuthTabsProps) {
  return (
    <div className="border-b border-zinc-200">
      <div className="flex gap-8">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative pb-4 text-[0.82rem] font-semibold uppercase tracking-[0.22em] transition-colors',
                isActive ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-700',
              )}
              aria-pressed={isActive}
            >
              {tab.label}
              <span
                className={cn(
                  'absolute inset-x-0 -bottom-px h-0.5 bg-zinc-900 transition-transform duration-200',
                  isActive ? 'scale-x-100' : 'scale-x-0',
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}