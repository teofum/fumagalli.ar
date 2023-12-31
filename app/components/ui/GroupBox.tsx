type GroupBoxProps = React.PropsWithChildren<{ title: string }>;

export default function GroupBox({ title, children }: GroupBoxProps) {
  return (
    <div className="relative bg-surface mt-2 bevel-light-inset p-px">
      <div className="absolute -top-2 left-2 px-1 bg-inherit leading-4">{title}</div>
      <div className="p-2 bevel-light">{children}</div>
    </div>
  );
}
