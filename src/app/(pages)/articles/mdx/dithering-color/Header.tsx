export default function Header() {
  return (
    <div
      className="
        -mx-4 -mt-4 @2xl:mt-0 @2xl:-mx-8 mb-8
        aspect-4/3 @2xl:aspect-2/1 overflow-hidden
        @2xl:rounded-md max-w-none
        flex flex-col justify-end
        bg-[url('/fs/Documents/Articles/assets/dither2/header.png')]
        bg-cover [image-rendering:pixelated]
      "
    >
      <div className="bg-default/50 p-4 pt-6 backdrop-blur-xs">
        <div className="max-w-lg mx-auto">
          <h1 className="font-title text-[1.75rem]/8 sm:text-content-3xl">
            A Visual Introduction to dithering in
            <span className="sr-only"> color</span>
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
