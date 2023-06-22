export default function Check(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentcolor"
      {...props}
    >
      <path d="M12 4v3h-1v1h-1v1H9v1H8v1H7v-1H6V9H5V6h1v1h1v1h1V7h1V6h1V5h1V4h1z" />
    </svg>
  );
}
