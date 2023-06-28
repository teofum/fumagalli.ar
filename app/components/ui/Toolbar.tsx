export default function Toolbar({ children }: React.PropsWithChildren) {
  return (
    <div className="bevel-light-inset p-px select-none">
      <div className="flex flex-row items-center bevel-light p-px">
        {children}
      </div>
    </div>
  );
}
