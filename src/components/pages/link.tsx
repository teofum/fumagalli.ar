import cn from 'classnames';
import NextLink from 'next/link';
import { ComponentProps, forwardRef } from 'react';

const Link = forwardRef<HTMLAnchorElement, ComponentProps<typeof NextLink>>(
  ({ className, children, ...props }, forwardedRef) => (
    <NextLink
      ref={forwardedRef}
      className={cn(
        'underline hover:bg-current/10 transition-colors duration-200 rounded-xs',
        className,
      )}
      {...props}
    >
      {children}
    </NextLink>
  ),
);
Link.displayName = 'Link';

export default Link;
