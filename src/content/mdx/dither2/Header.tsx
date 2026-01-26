export default function Header() {
  return (
    <div className="-m-4 mb-8 max-w-none">
      <div
        className="
          w-full h-[calc(0.8*var(--scroll-viewport-height,100vh))] min-h-96
          bg-[url('/fs/Documents/Articles/assets/dither2/header.png')]
          bg-cover [image-rendering:pixelated]
        "
      >
        <div className="bg-default/50 p-8 sticky top-0">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-title text-[1.75rem] sm:text-content-4xl">
              A Visual Introduction to dithering in
              <img
                src="/fs/Documents/Articles/assets/dither2/title.png"
                alt="Color Dithering"
                className="w-full my-4"
              />
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
