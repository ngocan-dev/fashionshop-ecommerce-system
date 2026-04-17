'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils/cn';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  destructive?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onOpenChange,
  onConfirm,
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,480px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-2xl outline-none">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          {description ? <Dialog.Description className="mt-2 text-sm text-muted-foreground">{description}</Dialog.Description> : null}
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close className="rounded-2xl border border-border px-4 py-2 text-sm">{cancelLabel}</Dialog.Close>
            <button
              type="button"
              onClick={onConfirm}
              className={cn(
                'rounded-2xl px-4 py-2 text-sm font-medium text-white',
                destructive ? 'bg-danger' : 'bg-brand-600',
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
