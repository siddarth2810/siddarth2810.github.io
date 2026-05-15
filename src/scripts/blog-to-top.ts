const blogTopWindow = window as Window & {
  __blogTopBound?: boolean;
  __blogTopCleanup?: () => void;
};

const setupBlogTopButton = () => {
  blogTopWindow.__blogTopCleanup?.();
  blogTopWindow.__blogTopCleanup = undefined;

  const scrollButton = document.getElementById(
    "to-top-btn",
  ) as HTMLButtonElement | null;
  const targetHeader = document.getElementById("blog-hero");

  if (!scrollButton || !targetHeader) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      scrollButton.dataset.show = (!entry.isIntersecting).toString();
    });
  });

  const handleClick = () => {
    document.documentElement.scrollTo({ behavior: "smooth", top: 0 });
  };

  observer.observe(targetHeader);
  scrollButton.addEventListener("click", handleClick);

  blogTopWindow.__blogTopCleanup = () => {
    observer.disconnect();
    scrollButton.removeEventListener("click", handleClick);
  };
};

setupBlogTopButton();

if (!blogTopWindow.__blogTopBound) {
  blogTopWindow.__blogTopBound = true;
  document.addEventListener("astro:page-load", setupBlogTopButton);
}
