export default function Header() {
  return (
    <div className="-m-4 mb-8">
      <div
        className="
          w-full h-96 grid grid-cols-5
          bg-[url('/fs/Documents/Articles/assets/dither/header.png')]
          bg-cover [image-rendering:pixelated]
        "
      >
        <div className="col-start-3 col-span-3 bg-black bg-opacity-25 p-4 pb-8 backdrop-blur flex flex-col justify-end">
          <h1 className="text-white font-title text-content-6xl">
            A Visual Introduction to Dithering
          </h1>
        </div>
      </div>
    </div>
  );
}
