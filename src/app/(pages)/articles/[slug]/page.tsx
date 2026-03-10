import { cache } from 'react';

import { CustomPortableText } from '@/components/ui/PortableText';
import { fullArticleSchema } from '@/schemas/article';
import { sanityImage } from '@/utils/sanity.image';
import { sanityClient } from '@/utils/sanity.server';
import { ServerComponentProps } from '@/utils/types';
import { Metadata } from 'next';

const ARTICLE_QUERY = (slug: string) => `
*[_type == "article" && slug == "${slug}"][0] {
  ...,
  legacyDate,
  'fileDate': file->_createdAt,
  'content': file->content,
}`;

const getArticle = cache(async (slug: string) => {
  return fullArticleSchema.parse(await sanityClient.fetch(ARTICLE_QUERY(slug)));
});

export async function generateMetadata({
  params,
}: ServerComponentProps): Promise<Metadata> {
  const { slug } = await params;
  if (typeof slug !== 'string') throw new Error('TODO 404 handling');

  const article = await getArticle(slug);
  return {
    title: `${article.title} — Teo Fumagalli`,
    description: article.description ?? 'Something I wrote',
  };
}

export default async function Post({ params }: ServerComponentProps) {
  const { slug } = await params;
  if (typeof slug !== 'string') throw new Error('TODO 404 handling');

  const article = await getArticle(slug);

  return (
    <article className="max-w-2xl mx-auto pb-16">
      <div className="relative -mx-4 px-4 md:-mx-8 md:px-8 pb-4 mb-8 flex flex-col justify-end aspect-4/3 md:aspect-2/1 overflow-hidden md:rounded-md">
        {article.thumbnail ? (
          <img
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
            src={sanityImage(article.thumbnail)
              .width(800)
              .quality(90)
              .dpr(2)
              .url()}
          />
        ) : null}
        <div className="absolute bottom-0 left-0 p-4 md:px-8 md:py-6 w-full backdrop-blur-2xl bg-white/50 dark:bg-stone-950/50">
          <h1 className="font-title text-content-4xl md:text-content-5xl text-balance">
            {article.title}
          </h1>
        </div>
      </div>
      <CustomPortableText value={article.content} />
    </article>
  );
}
