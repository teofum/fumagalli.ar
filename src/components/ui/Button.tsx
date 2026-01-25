import cn from "classnames";
import Link from "next/link";
import React from "react";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { variant?: "normal" | "light" }
>(function Button({ children, className, variant = "normal", ...props }, ref) {
  return (
    <button
      className={cn(
        "button group",
        {
          "button-normal": variant === "normal",
          "button-light": variant === "light",
        },
        className,
      )}
      {...props}
      ref={ref}
    >
      <div
        className="
          group-active:translate-x-px group-active:translate-y-px
          group-data-active:translate-x-px group-data-active:translate-y-px
          group-data-[state=open]:translate-x-px group-data-[state=open]:translate-y-px
        "
      >
        {children}
      </div>
    </button>
  );
});

export const LinkButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link> & { variant?: "normal" | "light" }
>(function Button({ children, className, variant = "normal", ...props }, ref) {
  return (
    <Link
      className={cn(
        "button group text-center",
        {
          "button-normal": variant === "normal",
          "button-light": variant === "light",
        },
        className,
      )}
      {...props}
      ref={ref}
    >
      <div
        className="
          group-active:translate-x-px group-active:translate-y-px
          group-data-active:translate-x-px group-data-active:translate-y-px
          group-data-[state=open]:translate-x-px group-data-[state=open]:translate-y-px
        "
      >
        {children}
      </div>
    </Link>
  );
});

interface IconButtonProps extends React.ComponentProps<typeof Button> {
  label?: string | null;
  imageUrl: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { className, imageUrl, label = null, children, ...props },
    ref,
  ) {
    return (
      <Button
        ref={ref}
        className={cn("p-0.5 min-w-7", className, {
          "w-14": label !== null,
        })}
        {...props}
      >
        <div className="relative mx-auto w-fit group-disabled:text-disabled">
          <img
            className="grayscale group-hover:grayscale-0"
            src={imageUrl}
            alt=""
          />
          <span
            className="absolute inset-0 bg-disabled hidden group-disabled:inline"
            style={{
              WebkitMaskImage: `url('${imageUrl}')`,
            }}
          />
        </div>
        {label !== null ? <span>{label}</span> : null}
      </Button>
    );
  },
);

interface IconLinkButtonProps extends React.ComponentProps<typeof LinkButton> {
  label?: string | null;
  imageUrl: string;
}

export const IconLinkButton = React.forwardRef<
  HTMLAnchorElement,
  IconLinkButtonProps
>(function IconButton(
  { className, imageUrl, label = null, children, ...props },
  ref,
) {
  return (
    <LinkButton
      ref={ref}
      className={cn("p-0.5 min-w-7", className, {
        "w-14": label !== null,
      })}
      {...props}
    >
      <div className="relative mx-auto w-fit group-disabled:text-disabled">
        <img
          className="grayscale group-hover:grayscale-0"
          src={imageUrl}
          alt=""
        />
        <span
          className="absolute inset-0 bg-disabled hidden group-disabled:inline"
          style={{
            WebkitMaskImage: `url('${imageUrl}')`,
          }}
        />
      </div>
      {label !== null ? <span>{label}</span> : null}
    </LinkButton>
  );
});

export default Button;
