(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const revealHero = () => {
    if (reduceMotion.matches) {
      root.classList.add("hero-ready");
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.classList.add("hero-ready");
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealHero, { once: true });
  } else {
    revealHero();
  }
})();
