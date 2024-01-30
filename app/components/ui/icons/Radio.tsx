export default function Radio(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      width={12}
      height={12}
      fill="currentcolor"
      {...props}
    >
      <path
        d="M10 2v1H8V2h2ZM4 1v1h4V1H4ZM2 4h1V3h1V2H2v2ZM1 8h1V4H1v4Zm2 1V8H2v1h1Z"
        className="text-surface-darker"
      />
      <path
        d="M2 10V9h2v1H2Zm6 1v-1H4v1h4Zm2-3H9v1H8v1h2V8Zm1-4h-1v4h1V4ZM9 3v1h1V3H9Z"
        className="text-surface-light"
      />
      <path
        d="M10 1v1H8V1h2ZM4 0v1h4V0H4ZM2 2h2V1H2v1ZM1 4h1V2H1v2ZM0 8h1V4H0v4Zm2 2V8H1v2h1Z"
        className="text-surface-dark"
      />
      <path
        d="M2 11v-1h2v1H2Zm6 1v-1H4v1h4Zm2-2H8v1h2v-1Zm1-2h-1v2h1V8Zm1-4h-1v4h1V4Zm-2-2v2h1V2h-1Z"
        className="text-surface-lighter"
      />
      <path
        d="M10 4H9V3H8V2H4v1H3v1H2v4h1v1h1v1h4V9h1V8h1V4z"
        className="text-background"
      />
    </svg>
  );
}
