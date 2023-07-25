import cn from 'classnames';
import { forwardRef } from 'react';

const RetroLink = forwardRef<HTMLAnchorElement, React.ComponentProps<'a'>>(
  function RetroLink({ children, className, ...props }, ref) {
    return (
      <a className={cn('link', className)} {...props} ref={ref}>
        {children}
      </a>
    );
  },
);

export default RetroLink;
