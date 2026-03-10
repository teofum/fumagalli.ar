export default function MDXLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <article className="max-w-2xl mx-auto pb-16">{children}</article>;
}
