import { projectCategorySchema } from '@/schemas/project';
import { sanityClient } from '@/utils/sanity.server';
import { PROJECT_CATEGORY_QUERY } from '@/queries/queries';
import Collapsible from '@/components/pages/Collapsible';
import { sanityImage } from '@/utils/sanity.image';
import Link from 'next/link';

export default async function Projects() {
  const categories = projectCategorySchema
    .array()
    .parse(await sanityClient.fetch(PROJECT_CATEGORY_QUERY));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Projects
      </h1>

      <p className="mb-4">Stuff I&apos;ve worked on.</p>

      <div>
        {categories.map((category) => (
          <Collapsible key={category._id} title={category.title}>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] group-data-[state='open']/content:pt-3 gap-3">
              {category.projects.map((project) => (
                <Link
                  key={project._id}
                  href={`projects/${project.slug}`}
                  className="block relative overflow-hidden group"
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]"
                    alt=""
                    src={project.thumbnail?.lqip}
                  />

                  {project.thumbnail ? (
                    <img
                      className="relative w-full aspect-3/2 group-hover:scale-[1.05] transition-transform duration-200"
                      alt=""
                      src={sanityImage(project.thumbnail)
                        .width(524)
                        .dpr(2)
                        .quality(80)
                        .url()}
                      loading="lazy"
                    />
                  ) : null}

                  <div className="absolute left-0 bottom-0 w-full bg-black/20 py-3 px-6 text-white font-medium backdrop-blur-xl">
                    {project.name}
                  </div>
                </Link>
              ))}
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
