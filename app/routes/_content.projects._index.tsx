import { json } from '@remix-run/node';
import { Link, useLoaderData, type V2_MetaFunction } from '@remix-run/react';

import { projectCategorySchema } from '~/schemas/project';
import { sanityClient } from '~/utils/sanity.server';
import { PROJECT_CATEGORY_QUERY } from '~/queries/queries';
import Collapsible from '~/components/pages/Collapsible';
import { sanityImage } from '~/utils/sanity.image';
import { useEffect, useState } from 'react';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Projects — Teo Fumagalli' },
    { name: 'description', content: 'I make stuff sometimes' },
  ];
};

export async function loader() {
  const data = await projectCategorySchema
    .array()
    .promise()
    .parse(sanityClient.fetch(PROJECT_CATEGORY_QUERY));

  return json(data);
}

export default function ProjectsIndexRoute() {
  const categories = useLoaderData<typeof loader>();

  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl mb-8">
        Projects
      </h1>

      <p className="mb-4">Stuff I've worked on.</p>

      <div>
        {categories.map(category => (
          <Collapsible key={category._id} title={category.title}>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] group-data-[state='open']/content:pt-3 gap-3">
              {category.projects.map((project) => (
                <Link
                  key={project._id}
                  to={project.slug}
                  className="block relative overflow-hidden group">
                  <img
                    className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]"
                    alt=""
                    src={project.thumbnail?.lqip}
                  />

                  {project.thumbnail ? (<img
                    className="relative w-full aspect-[3/2] group-hover:scale-[1.05] transition-transform duration-200"
                    alt=""
                    src={sanityImage(project.thumbnail).width(524).dpr(dpr).quality(80).url()}
                    loading="lazy"
                  />) : null}

                  <div className="absolute left-0 bottom-0 w-full bg-default/20 pixelate-bg py-3 px-6 text-white">
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
