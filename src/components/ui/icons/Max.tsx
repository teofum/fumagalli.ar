export default function Max(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 10"
      width={12}
      height={10}
      fill="currentcolor"
      {...props}
    >
      <path d="M1 0v9h9V0H1Zm8 8H2V2h7v6Z" />
    </svg>
  );
}
