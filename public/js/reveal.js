(function () {
  const selectors = [
    ".intro h2",
    ".intro-intro",
    ".intro-card",
    ".services h2",
    ".services-intro",
    ".services-compare",
    ".services-cta",
    ".service-card",
    ".process h2",
    ".process-lead",
    ".process-step",
    ".faq h2",
    ".faq-intro",
    ".faq-item",
    ".contact h2",
    ".contact-lead",
    ".form-grid",
    ".contact-form-followup"
  ];
  const items = document.querySelectorAll(selectors.join(", "));

  if (!items.length || !("IntersectionObserver" in window)) return;

  items.forEach((item, index) => {
    item.classList.add("reveal-up");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 90}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((item) => observer.observe(item));

  document.querySelectorAll(".contact-form").forEach((form) => {
    const followup = form.querySelector(".contact-form-followup");

    if (!followup) return;

    form.addEventListener("focusin", () => {
      followup.classList.add("is-visible");
      observer.unobserve(followup);
    });
  });
})();
