import Header from '@/components/pages/Header';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full font-text text-content-base bg-white dark:bg-stone-950 text-black dark:text-stone-200">
      <Header />
      {children}
    </div>
  );
}
