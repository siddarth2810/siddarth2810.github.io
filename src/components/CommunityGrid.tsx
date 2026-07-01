export default function CommunityGrid() {
        const images = [
                { src: "/community/codeday.webp", alt: "CodeDay" },
                { src: "/community/first_session.webp", alt: "First Session" },
        ];

        return (
                <section className="home-section community-section" id="community">
                        <div>
                                <h2 className="section-heading">Community Work</h2>
                                <p className="about-copy--lead experience-summary">
                                        Photos and moments from workshop sessions and coding events.
                                </p>
                        </div>

                        <div className="community-section__gallery gap-10">
                                <figure className="community-section__figure">
                                        <img src={images[1].src} alt={images[1].alt} loading="lazy" className="community-section__image" />
                                </figure>
                                <h5 className="text-muted">~ Teaching Git to 250+ students</h5>
                                <figure className="community-section__figure">
                                        <img src={images[0].src} alt={images[0].alt} loading="lazy" className="community-section__image" />
                                </figure>
                                <h5 className="text-muted">~ Organizing CodeDay Hyd 2024</h5>
                        </div>
                </section>
        );
}
