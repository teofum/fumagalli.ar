import { Link } from '@remix-run/react';

export default function AboutRoute() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl">
        Teo Fumagalli
      </h1>

      <Link to="/articles">
        Articles
      </Link>
    </div>
  );
}
