(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) return;

  const setExpandedState = (item, answer, expanded) => {
    item.classList.remove("is-animating", "is-closing");
    if (expanded) {
      answer.style.height = "auto";
    } else {
      answer.style.height = "0px";
    }
  };

  faqItems.forEach((item) => {
    const summary = item.querySelector("summary");
    const answer = item.querySelector(".faq-answer");

    if (!summary || !answer) return;

    if (item.open) {
      setExpandedState(item, answer, true);
    } else {
      setExpandedState(item, answer, false);
    }

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      const isOpen = item.hasAttribute("open");

      if (reduceMotion.matches) {
        item.classList.remove("is-animating", "is-closing");
        item.toggleAttribute("open", !isOpen);
        answer.style.height = !isOpen ? "auto" : "0px";
        return;
      }

      if (!isOpen) {
        item.classList.remove("is-closing");
        item.classList.add("is-animating");
        item.setAttribute("open", "");
        answer.style.height = "0px";

        window.requestAnimationFrame(() => {
          answer.style.height = `${answer.scrollHeight}px`;
        });

        const onOpenEnd = (transitionEvent) => {
          if (transitionEvent.propertyName !== "height") return;
          answer.style.height = "auto";
          item.classList.remove("is-animating");
          answer.removeEventListener("transitionend", onOpenEnd);
        };

        answer.addEventListener("transitionend", onOpenEnd);
        return;
      }

      item.classList.add("is-closing");
      item.classList.remove("is-animating");
      answer.style.height = `${answer.scrollHeight}px`;
      void answer.offsetHeight;

      window.requestAnimationFrame(() => {
        answer.style.height = "0px";
      });

      const onCloseEnd = (transitionEvent) => {
        if (transitionEvent.propertyName !== "height") return;
        item.removeAttribute("open");
        item.classList.remove("is-closing");
        answer.removeEventListener("transitionend", onCloseEnd);
      };

      answer.addEventListener("transitionend", onCloseEnd);
    });
  });
})();
