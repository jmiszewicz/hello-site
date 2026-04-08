(function () {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const mobileBtn = document.getElementById("theme-toggle-mobile");
  const menuBtn = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");
  const siteHeader = document.querySelector(".site-header");
  const navLinks = siteNav ? Array.from(siteNav.querySelectorAll('a[href^="#"]')) : [];
  const storedTheme = localStorage.getItem("theme");
  const updateMenuButtonState = (isOpen) => {
    if (!menuBtn) return;

    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.classList.toggle("is-active", isOpen);
    menuBtn.textContent = isOpen ? "Zamknij" : "Menu";
  };

  const syncHeaderHeight = () => {
    if (!siteHeader) return;

    root.style.setProperty("--header-height", `${Math.ceil(siteHeader.getBoundingClientRect().height)}px`);
  };

  if (storedTheme === "light") {
    root.setAttribute("data-theme", "light");
  }

  const setButtonLabel = () => {
    if (!btn) return;

    const isLight = root.getAttribute("data-theme") === "light";
    const label = isLight ? "Ciemny" : "Jasny";
    btn.textContent = label;

    if (mobileBtn) {
      mobileBtn.textContent = label;
    }
  };

  setButtonLabel();

  if (btn) {
    btn.addEventListener("click", function () {
      const isLight = root.getAttribute("data-theme") === "light";
      if (isLight) {
        root.removeAttribute("data-theme");
        localStorage.setItem("theme", "dark");
      } else {
        root.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
      setButtonLabel();
    });
  }

  if (mobileBtn && btn) {
    mobileBtn.addEventListener("click", function () {
      btn.click();
    });
  }

  syncHeaderHeight();
  window.addEventListener("load", syncHeaderHeight);

  if (siteHeader && "ResizeObserver" in window) {
    const headerObserver = new ResizeObserver(syncHeaderHeight);
    headerObserver.observe(siteHeader);
  }

  if (menuBtn && siteNav) {
    const closeMenu = () => {
      siteNav.classList.remove("is-open");
      updateMenuButtonState(false);
      menuBtn.blur();
    };

    menuBtn.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("is-open");
      updateMenuButtonState(isOpen);
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        closeMenu();
        this.blur();
      });
    });

    document.addEventListener("pointerdown", function (event) {
      if (!siteNav.classList.contains("is-open")) return;
      if (siteNav.contains(event.target) || menuBtn.contains(event.target)) return;

      closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) {
        closeMenu();
      }
    });

    updateMenuButtonState(siteNav.classList.contains("is-open"));
  }

  if (navLinks.length) {
    const sections = navLinks
      .map((link) => {
        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return null;

        const section = document.querySelector(hash);
        if (!section) return null;

        return { link, section };
      })
      .filter(Boolean);

    const setActiveLink = (activeId) => {
      sections.forEach(({ link, section }) => {
        link.classList.toggle("is-active", section.id === activeId);
      });
    };

    const updateActiveLink = () => {
      const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
      const marker = window.scrollY + headerHeight + window.innerHeight * 0.18;
      let activeId = sections[0].section.id;

      sections.forEach(({ section }, index) => {
        const sectionTop = section.offsetTop;
        const nextSectionTop =
          index < sections.length - 1
            ? sections[index + 1].section.offsetTop
            : Number.POSITIVE_INFINITY;

        if (marker >= sectionTop && marker < nextSectionTop) {
          activeId = section.id;
        }
      });

      const nearPageBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

      if (nearPageBottom) {
        activeId = sections[sections.length - 1].section.id;
      }

      setActiveLink(activeId);
    };

    let isTicking = false;
    const requestUpdateActiveLink = () => {
      if (isTicking) return;

      isTicking = true;
      window.requestAnimationFrame(() => {
        updateActiveLink();
        isTicking = false;
      });
    };

    updateActiveLink();
    window.addEventListener("scroll", requestUpdateActiveLink, { passive: true });
    window.addEventListener("resize", requestUpdateActiveLink);
    window.addEventListener("load", requestUpdateActiveLink);
  }
})();
