(function () {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const mobileBtn = document.getElementById("theme-toggle-mobile");
  const menuBtn = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");
  const siteHeader = document.querySelector(".site-header");
  const navLinks = siteNav ? Array.from(siteNav.querySelectorAll('a[href^="#"]')) : [];
  const storedTheme = localStorage.getItem("theme");

  const syncHeaderHeight = () => {
    if (!siteHeader) return;

    const navIsOpen = siteNav && siteNav.classList.contains("is-open") && window.innerWidth <= 860;
    if (navIsOpen) return;

    root.style.setProperty("--header-height", `${Math.ceil(siteHeader.getBoundingClientRect().height)}px`);
  };

  if (storedTheme === "light") {
    root.setAttribute("data-theme", "light");
  }

  const setButtonLabel = () => {
    if (!btn) return;

    const isLight = root.getAttribute("data-theme") === "light";
    const label = isLight ? "#141414" : "#FFFFFF";
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

  if (menuBtn && siteNav) {
    const closeMenu = () => {
      siteNav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      window.requestAnimationFrame(syncHeaderHeight);
    };

    menuBtn.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));

      if (!isOpen) {
        window.requestAnimationFrame(syncHeaderHeight);
      }
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) {
        closeMenu();
      }

      window.requestAnimationFrame(syncHeaderHeight);
    });
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
