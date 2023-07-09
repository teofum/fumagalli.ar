import * as DialogPrimitive from '@radix-ui/react-dialog';
import cn from 'classnames';

import Button from './Button';

type DialogProps = {
  trigger?: React.ReactNode;
  title: React.ReactNode;
  icon?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
} & DialogPrimitive.DialogProps;

export default function Dialog({
  trigger,
  title,
  icon,
  children,
  maxWidth = 'sm',
  ...props
}: DialogProps) {
  return (
    <DialogPrimitive.Root {...props}>
      {trigger ? (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      ) : null}

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-3000 bg-checkered-dark" />

        <DialogPrimitive.Content
          className={cn(
            `
              fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-4000
              touch-none p-1 bg-surface bevel-window
            `,
            {
              'max-w-screen-sm': maxWidth === 'sm',
              'max-w-screen-md': maxWidth === 'md',
              'max-w-screen-lg': maxWidth === 'lg',
              'max-w-screen-xl': maxWidth === 'xl',
              'max-w-screen-2xl': maxWidth === '2xl',
            },
          )}
        >
          <div className="select-none flex flex-row items-center gap-2 px-0.5 py-px mb-0.5">
            <img src={icon} alt="" />

            <div className="flex-1 h-1.5 border-t border-b border-light" />

            <DialogPrimitive.Title className="bold">
              {title}
            </DialogPrimitive.Title>

            <div className="flex-1 h-1.5 border-t border-b border-light" />

            <div className="flex flex-row">
              <DialogPrimitive.Close asChild>
                <Button>
                  <img src="/fs/system/Resources/UI/close.png" alt="Close" />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </div>

          <div className="flex-1">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const DialogClose = DialogPrimitive.Close;

export { DialogClose };
