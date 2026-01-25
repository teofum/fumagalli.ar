import React from 'react';
import cn from 'classnames';
import * as MenuBar from '@radix-ui/react-menubar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Check from './icons/Check';
import Dot from './icons/Dot';
import ArrowLeft from './icons/ArrowLeft';

type MenubarProps = React.ComponentProps<typeof MenuBar.Root>;

const Bar = React.forwardRef<HTMLDivElement, MenubarProps>(function Bar(
  { children, className, ...props },
  ref,
) {
  return (
    <MenuBar.Root ref={ref} className={cn('menu-bar', className)} {...props}>
      {children}
    </MenuBar.Root>
  );
});

type MenuProps = React.PropsWithChildren<
  {
    trigger: React.ReactNode;
    contentProps?: React.ComponentProps<typeof MenuBar.Content>;
  } & React.ComponentProps<typeof MenuBar.Menu>
>;

function Menu({ children, trigger, contentProps, ...props }: MenuProps) {
  return (
    <MenuBar.Menu {...props}>
      <MenuBar.Trigger asChild>{trigger}</MenuBar.Trigger>

      <MenuBar.Portal>
        <MenuBar.Content
          align="start"
          {...contentProps}
          className={cn('menu-content', contentProps?.className)}
        >
          {children}
        </MenuBar.Content>
      </MenuBar.Portal>
    </MenuBar.Menu>
  );
}

function Root({ children, trigger, contentProps, ...props }: MenuProps) {
  return (
    <DropdownMenu.Root {...props}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          {...contentProps}
          className={cn('menu-content', contentProps?.className)}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(function MenuTrigger({ children, className, ...props }, ref) {
  return (
    <button
      className={cn(
        'button bg-transparent shadow-none hover:bevel-light px-1.5 py-0.5 menu-trigger',
        'active:bevel-light-inset data-[state=open]:!bevel-light-inset',
        className,
      )}
      {...props}
      ref={ref}
    >
      <div>{children}</div>
    </button>
  );
});

type ItemProps = {
  label: string;
  icon?: string;
} & React.ComponentProps<typeof MenuBar.Item>;

function Item({ label, icon, className, ...props }: ItemProps) {
  return (
    <MenuBar.Item
      className={cn('menu-item', className)}
      {...props}
      onPointerUp={(ev) => {
        // Workaround for apple pencil
        // See https://github.com/radix-ui/primitives/issues/1027
        props.onPointerUp?.(ev);
        if (ev.pointerType === 'pen') (ev.target as HTMLElement).click();
      }}
    >
      {icon ? <img className="col-start-1" src={icon} alt="" /> : null}
      <span className="col-start-2">{label}</span>
    </MenuBar.Item>
  );
}

type CheckboxItemProps = {
  label: string;
} & React.ComponentProps<typeof MenuBar.CheckboxItem>;

function CheckboxItem({ label, className, ...props }: CheckboxItemProps) {
  return (
    <MenuBar.CheckboxItem className={cn('menu-item', className)} {...props}>
      <MenuBar.ItemIndicator className="col-start-1">
        <Check />
      </MenuBar.ItemIndicator>
      <span className="col-start-2">{label}</span>
    </MenuBar.CheckboxItem>
  );
}

type RadioGroupProps = React.ComponentProps<typeof MenuBar.RadioGroup>;

function RadioGroup({ children, ...props }: RadioGroupProps) {
  return <MenuBar.RadioGroup {...props}>{children}</MenuBar.RadioGroup>;
}

type RadioItemProps = {
  label: string;
} & React.ComponentProps<typeof MenuBar.RadioItem>;

function RadioItem({ label, className, ...props }: RadioItemProps) {
  return (
    <MenuBar.RadioItem className={cn('menu-item', className)} {...props}>
      <MenuBar.ItemIndicator className="col-start-1">
        <Dot />
      </MenuBar.ItemIndicator>
      <span className="col-start-2">{label}</span>
    </MenuBar.RadioItem>
  );
}

function Separator() {
  return <MenuBar.Separator className="h-0.5 m-1 bevel-light-inset" />;
}

type SubProps = {
  label: string;
  icon?: string;
  contentProps?: React.ComponentProps<typeof MenuBar.SubContent>;
} & React.ComponentProps<typeof MenuBar.SubTrigger>;

function Sub({
  label,
  icon,
  className,
  contentProps,
  children,
  ...props
}: SubProps) {
  return (
    <MenuBar.Sub>
      <MenuBar.SubTrigger
        className={cn('menu-item menu-sub', className)}
        {...props}
      >
        {icon ? <img className="col-start-1" src={icon} alt="" /> : null}
        <span className="col-start-2">{label}</span>
        <div className="w-3 h-3">
          <ArrowLeft />
        </div>
      </MenuBar.SubTrigger>

      <MenuBar.Portal>
        <MenuBar.SubContent
          sideOffset={-4}
          alignOffset={-2}
          {...contentProps}
          className={cn('menu-content', contentProps?.className)}
        >
          {children}
        </MenuBar.SubContent>
      </MenuBar.Portal>
    </MenuBar.Sub>
  );
}

export default {
  Bar,
  Menu,
  Root,
  Trigger,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Separator,
  Sub,
};
