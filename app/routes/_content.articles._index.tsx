import { Link } from "@remix-run/react";

export default function PostsIndexRoute() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-title text-content-4xl sm:text-content-6xl">
        Articles
      </h1>

      <Link to="introduction-to-dithering">A Visual Introduction to Dithering</Link>
    </div>
  );
}
