export default function Header() {
  return (
    <div
      className="
        -mx-4 md:-mx-8 mb-8 aspect-4/3 md:aspect-2/1 overflow-hidden md:rounded-md max-w-none
        flex flex-col justify-end
        bg-[url('/fs/Documents/Articles/assets/dither/header.png')]
        bg-cover [image-rendering:pixelated]
      "
    >
      <div className="bg-white/50 dark:bg-stone-950/50 p-4 pt-6 backdrop-blur-xs">
        <div className="max-w-lg mx-auto">
          <h1 className="font-title text-[1.75rem]/8 sm:text-content-4xl">
            A Visual Introduction to
            <div
              className="
                w-full aspect-188/41 bg-current my-4
                mask-[url('/fs/Documents/Articles/assets/dither/title.png')]
                mask-cover mask-no-repeat
              "
            />
          </h1>
        </div>
      </div>
    </div>
  );
}
