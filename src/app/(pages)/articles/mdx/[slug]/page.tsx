import MDX from './mdx';

export default async function MDXPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <MDX slug={slug} />;
}
