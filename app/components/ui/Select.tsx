import * as SelectPrimitive from '@radix-ui/react-select';
import cn from 'classnames';
import { forwardRef } from 'react';
import ArrowDown from './icons/ArrowDown';

type SelectProps = {
  placeholder?: string;
  triggerProps?: React.ComponentProps<typeof SelectPrimitive.Trigger>;
  contentProps?: React.ComponentProps<typeof SelectPrimitive.Content>;
  renderValue?: React.ReactNode;
  viewportClassName?: string;
} & React.ComponentProps<typeof SelectPrimitive.Root>;

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
    {
      placeholder,
      triggerProps,
      contentProps,
      renderValue,
      viewportClassName,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            'flex flex-row items-stretch p-0.5 cursor-default',
            'whitespace-nowrap overflow-hidden text-ellipsis',
            'bg-default bevel-content outline-none group',
            triggerProps?.className,
          )}
        >
          <div className="m-px py-px px-1.5 flex-1 text-start group-focus:bg-selection group-focus:text-selection">
            <SelectPrimitive.Value
              placeholder={placeholder ?? 'Select an option'}
            >
              {renderValue}
            </SelectPrimitive.Value>
          </div>

          <SelectPrimitive.Icon className="block button button-normal py-1">
            <ArrowDown />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            side="bottom"
            {...contentProps}
            className={cn(
              'bg-default border border-default z-2000',
              'w-[var(--radix-select-trigger-width)]',
              contentProps?.className,
            )}
          >
            <SelectPrimitive.ScrollUpButton>
              <ArrowDown className="rotate-180" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport className={viewportClassName}>
              {children}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton>
              <ArrowDown />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);

type ItemProps = React.ComponentProps<typeof SelectPrimitive.Item>;

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(function Item(
  { value, className, children, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'px-1 outline-none',
        'data-[highlighted]:bg-selection data-[highlighted]:text-selection',
        className,
      )}
      value={value}
      ref={ref}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
