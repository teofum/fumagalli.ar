import ditheros, { attributes as ditherosMeta } from './ditheros.md';
import recipes, { attributes as recipesMeta } from './recipes.md';
import lab, { attributes as labMeta } from './lab.md';

interface Project {
  slug: string;
  title: string;
  Component: typeof ditheros;
}

const projects: Project[] = [
  {
    slug: ditherosMeta.slug,
    title: ditherosMeta.title,
    Component: ditheros,
  },
  {
    slug: recipesMeta.slug,
    title: recipesMeta.title,
    Component: recipes,
  },
  {
    slug: labMeta.slug,
    title: labMeta.title,
    Component: lab,
  },
];

export default projects;
