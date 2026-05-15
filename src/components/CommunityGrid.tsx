interface CommunityImage {
  src: string;
  alt: string;
}

interface CommunityGridProps {
  images: CommunityImage[];
}

export default function CommunityGrid({ images }: CommunityGridProps) {
  const visibleImages = images.slice(0, 2);

  return (
    <section className="pt-8" id="community">
      <div>
        <h2 className="font-serif text-[1.55rem] font-semibold leading-tight tracking-normal text-title">
          Community Work
        </h2>
        <p className="max-w-2xl pt-1 text-sm font-normal leading-relaxed text-muted">
          Photos and moments from workshop sessions and coding events.
        </p>
      </div>

      {visibleImages.length === 0 ? (
        <div className="mt-4 rounded-lg border border-[rgba(var(--color-primary-rgb),0.12)] bg-[var(--surface)] px-4 py-6 text-sm font-normal text-muted">
          Add images to <code>public/community</code> and they will appear here
          automatically.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          {visibleImages.map((image) => (
            <figure
              key={image.src}
              className="min-w-0 flex-1 overflow-hidden rounded-lg border border-[rgba(var(--color-primary-rgb),0.12)] bg-[var(--surface)]"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
