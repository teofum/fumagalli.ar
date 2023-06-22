import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import cn from 'classnames';

type MenuProps = React.PropsWithChildren<
  {
    trigger: React.ReactNode;
    contentProps?: React.ComponentProps<typeof DropdownMenu.Content>;
  } & React.ComponentProps<typeof DropdownMenu.Root>
>;

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

type ItemProps = {
  label: string;
  icon?: string;
} & React.ComponentProps<typeof DropdownMenu.Item>;

function Item({ label, icon, className, ...props }: ItemProps) {
  return (
    <DropdownMenu.Item className={cn('menu-item', className)} {...props}>
      {icon ? (
        <img
          className="menu-item-icon"
          src={`/img/icon/${icon}_16.png`}
          alt=""
        />
      ) : null}
      <span className="menu-item-label">{label}</span>
    </DropdownMenu.Item>
  );
}

export default {
  Root,
  Item,
};
