export default function Header() {
  return (
    <div
      className="
        -mx-4 md:-mx-8 mb-8 aspect-4/3 md:aspect-2/1 overflow-hidden md:rounded-md max-w-none
        flex flex-col justify-end
        bg-[url('/fs/Documents/Articles/assets/dither2/header.png')]
        bg-cover [image-rendering:pixelated]
      "
    >
      <div className="bg-white/50 dark:bg-stone-950/50 p-4 pt-6 backdrop-blur-xs">
        <div className="max-w-lg mx-auto">
          <h1 className="font-title text-[1.75rem]/8 sm:text-content-3xl">
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
  );
}
