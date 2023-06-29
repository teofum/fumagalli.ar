export default function Close(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 10"
      width={12}
      height={10}
      fill="currentcolor"
      {...props}
    >
      <path d="M7 4v1h1v1h1v1h1v1H8V7H7V6H5v1H4v1H2V7h1V6h1V5h1V4H4V3H3V2H2V1h2v1h1v1h2V2h1V1h2v1H9v1H8v1H7z" />
    </svg>
  );
}
