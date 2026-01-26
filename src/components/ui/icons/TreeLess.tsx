export default function TreeLess(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 11 11"
      width={11}
      height={11}
      fill="currentcolor"
      {...props}
    >
      <path d="M0 0v11h11V0H0Zm10 10H1V1h9v9Z" style={{ opacity: 0.5 }} />
      <path d="M3 5h5v1H3z" />
    </svg>
  );
}
