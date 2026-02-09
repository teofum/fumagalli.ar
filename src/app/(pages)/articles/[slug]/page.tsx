import { CustomPortableText } from '@/components/ui/PortableText';
import { fullArticleSchema } from '@/schemas/article';
import { sanityImage } from '@/utils/sanity.image';
import { sanityClient } from '@/utils/sanity.server';

const ARTICLE_QUERY = (slug: string) => `
*[_type == "article" && slug == "${slug}"][0] {
  ...,
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
      <div className="relative -mx-8 px-8 pb-4 mb-8 flex flex-col justify-end aspect-4/3 md:aspect-2/1 overflow-hidden rounded-md">
        {article.thumbnail ? (
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
            src={sanityImage(article.thumbnail)
              .width(600)
              .height(300)
              .quality(50)
              .url()}
          />
        ) : null}
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/50 dark:bg-stone-950/50" />
        <h1 className="relative font-title text-content-4xl md:text-content-5xl text-h1">
          {article.title}
        </h1>
      </div>
      <CustomPortableText value={article.content} />
    </article>
  );
}
