export default function DitherCard() {
  return (
    <div
      className="
        min-w-60 aspect-3/2 relative border border-default
        flex flex-col justify-center group overflow-hidden
      "
    >
      <img
        className="
          absolute inset-0 w-full h-full object-cover object-left
          transition scale-110 group-hover:scale-100
        "
        src="/fs/Documents/Articles/assets/dither2/header.png"
        alt=""
      />

      <div className="bg-default/50 p-4 relative transition group-hover:bg-default/70">
        <h1 className="font-title text-center text-content-3xl transition group-hover:scale-[1.02] group-hover:text-link">
          Dithering in
          <img
            src="/fs/Documents/Articles/assets/dither2/title.png"
            alt="Color Dithering"
            className="w-full aspect-[5] object-contain my-4 grayscale brightness-150 group-hover:grayscale-0 group-hover:brightness-100 transition"
          />
        </h1>
      </div>
    </div>
  );
}
