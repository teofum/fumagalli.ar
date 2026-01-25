export default function DitherCard() {
  return (
    <div
      className="
        min-w-60 aspect-3/2 relative border border-default
        flex flex-col justify-end group overflow-hidden
      "
    >
      <img
        className="
          absolute inset-0 w-full h-full object-cover object-left
          transition scale-110 group-hover:scale-100
        "
        src="/fs/Documents/Articles/assets/dither/header.png"
        alt=""
      />

      <div className="bg-default/50 p-4 relative transition group-hover:bg-default/70">
        <h1 className="font-title text-content-3xl transition group-hover:scale-[1.02] group-hover:text-link">
          A Visual Introduction to
          <div
            className="
              w-full aspect-188/41 bg-current mt-2
              mask-[url('/fs/Documents/Articles/assets/dither/title.png')]
              mask-cover mask-no-repeat [image-rendering:pixelated]
            "
          />
        </h1>
      </div>
    </div>
  );
}
