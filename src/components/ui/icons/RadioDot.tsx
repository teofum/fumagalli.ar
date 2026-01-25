export default function RadioDot(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      width={12}
      height={12}
      fill="currentcolor"
      {...props}
    >
      <path d="M8 5H7V4H5v1H4v2h1v1h2V7h1V5z" />
    </svg>
  );
}
