import Link from 'next/link';

import { Article } from '@/schemas/article';
import { sanityImage } from '@/utils/sanity.image';

type ArticleItemProps = {
  post: Article;
};

export default function ArticleItem({ post }: ArticleItemProps) {
  return (
    <Link
      href={`articles/${post.slug}`}
      className="flex flex-row items-center md:items-start py-2 md:px-2 gap-2 hover:bg-text/10 transition-colors"
    >
      {post.thumbnail ? (
        <img
          className="w-20 h-20 md:w-26 md:h-26 rounded"
          alt=""
          src={sanityImage(post.thumbnail).width(120).height(120).dpr(2).url()}
        />
      ) : null}
      <div className="flex flex-col p-2 grow gap-2">
        <div className="flex flex-col md:flex-row items-start gap-2">
          <div className="flex flex-col items-start gap-2">
            <span className="grow font-medium text-content-base/5">
              {post.title}
            </span>
            <span className="min-h-4 text-content-sm/4 text-current/60 text-balance">
              {post.description}
            </span>
          </div>
          <div className="flex flex-row items-baseline mt-1 md:mt-0">
            {post.tags.map((tag) => (
              <div
                key={tag}
                className="px-2 border rounded-full text-content-xs/5 whitespace-nowrap"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <span className="w-20 text-current/60 text-content-sm">
          {post.date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </span>
      </div>
    </Link>
  );
}
