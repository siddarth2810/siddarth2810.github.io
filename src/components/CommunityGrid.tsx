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
    <section className="home-section community-section" id="community">
      <div>
        <h2 className="section-heading">Community Work</h2>
        <p className="about-copy--lead experience-summary">
          Photos and moments from workshop sessions and coding events.
        </p>
      </div>

      {visibleImages.length === 0 ? (
        <div className="community-section__empty">
          Add images to <code>public/community</code> and they will appear here
          automatically.
        </div>
      ) : (
        <div className="community-section__gallery">
          {visibleImages.map((image) => (
            <figure key={image.src} className="community-section__figure">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="community-section__image"
              />
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
