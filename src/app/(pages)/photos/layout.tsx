import Link from '@/components/pages/link';

export default function PhotosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="p-4">
      {children}

      <div className="max-w-3xl mx-auto">
        <p className="my-4">
          All images are under{' '}
          <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
            Creative Commons BY-NC-SA
          </Link>{' '}
          license, and are free for non-commercial use.
        </p>
      </div>
    </main>
  );
}
