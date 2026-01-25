export default function Restore(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 10"
      width={12}
      height={10}
      fill="currentcolor"
      {...props}
    >
      <path d="M4 0v3H2v6h6V6h2V0H4Zm3 8H3V5h4v3Zm2-3H8V3H5V2h4v3Z" />
    </svg>
  );
}
