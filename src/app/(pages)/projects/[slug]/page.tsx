import { CustomPortableText } from '@/components/ui/PortableText';
import { fullProjectSchema } from '@/schemas/project';
import { sanityClient } from '@/utils/sanity.server';
import { PROJECT_QUERY } from '@/queries/queries';

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) throw new Error('TODO 404 handling');

  const project = fullProjectSchema.parse(
    await sanityClient.fetch(PROJECT_QUERY(slug)),
  );

  return (
    <article className="max-w-3xl mx-auto pb-16">
      <CustomPortableText value={project.content} />
    </article>
  );
}
