export default function CommunityGrid() {
  const images = [
    { src: "/community/codeday.webp", alt: "CodeDay" },
    { src: "/community/first_session.webp", alt: "First Session" },
  ];

  return (
    <section className="community-section mt-12 md:mt-14" id="community">
      <div className="max-w-[38rem]">
        <h2 className="section-heading m-0 font-serif text-2xl leading-tight text-title">
          Community Work
        </h2>
        <p className="m-0 mt-2 text-lg leading-8 text-fg">
          Photos and moments from workshop sessions and coding events.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <figure className="community-section__figure">
          <img
            src={images[1].src}
            alt={images[1].alt}
            loading="lazy"
            className="community-section__image"
          />
        </figure>
        <h5 className="text-muted m-0 text-base leading-7">
          ~ Teaching Git to 250+ students
        </h5>
        <figure className="community-section__figure">
          <img
            src={images[0].src}
            alt={images[0].alt}
            loading="lazy"
            className="community-section__image"
          />
        </figure>
        <h5 className="text-muted m-0 text-base leading-7">
          ~ Organizing CodeDay Hyd 2024
        </h5>
      </div>
    </section>
  );
}
