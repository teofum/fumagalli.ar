export default function Header() {
  return (
    <div className="-m-4 mb-8 max-w-none">
      <div
        className="
          w-full h-[calc(0.8*var(--scroll-viewport-height,100vh))] min-h-96
          bg-[url('/fs/Documents/Articles/assets/dither/header.png')]
          bg-cover [image-rendering:pixelated]
        "
      >
        <div className="max-w-3xl mx-auto sm:px-4 flex flex-row justify-end">
          <div className="bg-default bg-opacity-70 p-8 backdrop-blur-md w-full sm:w-max">
            <h1 className="font-title text-[1.75rem] sm:text-content-4xl">
              A Visual Introduction to
              <div
                className="
                  w-full aspect-[188/41] bg-current my-4
                  [mask-image:url('/fs/Documents/Articles/assets/dither/title.png')]
                  [mask-size:cover] [mask-repeat:no-repeat]
                "
              />
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
