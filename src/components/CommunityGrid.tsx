import { useEffect, useState } from "react";

interface CommunityImage {
  src: string;
  alt: string;
}

interface CommunityGridProps {
  images: CommunityImage[];
}

export default function CommunityGrid({ images }: CommunityGridProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleImageClick = (index: number) => {
    setImageIndex(index);
    setIsOpen(true);
  };

  const selectedImage = images[imageIndex];

  return (
    <>
      <section className="pt-8" id="community">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-tight">
              Community Work
            </h2>
            <p className="pt-1 text-sm text-[rgba(83,83,83,0.72)]">
             Photos and moments from giving workshop sessions and organizing coding events.
            </p>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-[rgba(83,83,83,0.12)] bg-white/55 px-4 py-6 text-sm text-[rgba(83,83,83,0.75)]">
            Add images to <code>public/community</code> and they will appear
            here automatically.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
            <button
              type="button"
              className="col-span-2 row-span-2 min-h-[16rem] cursor-pointer overflow-hidden rounded-2xl border border-[rgba(83,83,83,0.12)] bg-white/60 text-left"
              onClick={() => handleImageClick(0)}
            >
              <img
                src={images[0].src}
                alt={images[0].alt}
                loading="eager"
                className="muted-image h-full w-full object-cover"
              />
            </button>

            {images.slice(1).map((image, index) => (
              <button
                type="button"
                key={image.src}
                className="min-h-[7.75rem] cursor-pointer overflow-hidden rounded-2xl border border-[rgba(83,83,83,0.12)] bg-white/60 text-left"
                onClick={() => handleImageClick(index + 1)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="muted-image h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedImage && (
        <ImageDialog
          isOpen={isOpen}
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

interface ImageDialogProps {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

function ImageDialog({ isOpen, src, alt, onClose }: ImageDialogProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[rgba(243,233,220,0.82)] px-5 transition-all duration-200 ${
        isOpen
          ? "pointer-events-auto visible opacity-100"
          : "pointer-events-none invisible opacity-0"
      }`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        className="relative w-full max-w-6xl rounded-[1.75rem] border border-[rgba(83,83,83,0.14)] bg-[#fffaf4] p-2 shadow-[0_24px_80px_rgba(83,83,83,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-[rgba(83,83,83,0.14)] bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[rgba(83,83,83,0.8)] backdrop-blur"
        >
          Close
        </button>

        <div className="max-h-[88vh] overflow-hidden rounded-[1.1rem]">
          <img
            src={src}
            alt={alt}
            className="h-auto max-h-[88vh] w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
