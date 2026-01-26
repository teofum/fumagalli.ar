import Header from '@/components/pages/Header';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full font-text text-content-base">
      <Header />
      {children}
    </div>
  );
}
