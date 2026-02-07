import { CustomPortableText } from '@/components/ui/PortableText';
import { fullArticleSchema } from '@/schemas/article';
import { sanityClient } from '@/utils/sanity.server';

const ARTICLE_QUERY = (slug: string) => `
*[_type == "article" && slug == "${slug}"][0] {
  _id,
  title,
  slug,
  legacyDate,
  'fileDate': file->_createdAt,
  'content': file->content,
}`;

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) throw new Error('TODO 404 handling');

  const article = fullArticleSchema.parse(
    await sanityClient.fetch(ARTICLE_QUERY(slug)),
  );

  return (
    <article className="max-w-2xl mx-auto pb-16">
      <h1 className="font-title text-content-4xl lg:text-content-5xl text-h1 mb-8">
        {article.title}
      </h1>
      <CustomPortableText value={article.content} />
    </article>
  );
}
