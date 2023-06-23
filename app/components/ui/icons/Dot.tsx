export default function Dot(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentcolor"
      {...props}
    >
      <path d="M10 7v2H9v1H7V9H6V7h1V6h2v1h1z" />
    </svg>
  );
}
