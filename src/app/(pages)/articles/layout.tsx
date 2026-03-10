export default function ArticlesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="p-4 @container">{children}</main>;
}
