/**
 * Global site behaviors: header, nav, config binding, animations, floating UI.
 */
(function () {
  "use strict";

  const cfg = window.SITE_CONFIG || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Config binding -------------------------------------------------- */
  function bindConfig() {
    document.querySelectorAll("[data-config-email]").forEach((el) => {
      const email = cfg.email || "contact@thefavoritecleaner.com";
      if (el.tagName === "A") {
        el.href = "mailto:" + email;
        if (!el.textContent.trim() || el.dataset.configEmail === "text") {
          el.textContent = email;
        }
      } else {
        el.textContent = email;
      }
    });

    document.querySelectorAll("[data-config-area]").forEach((el) => {
      el.textContent = cfg.serviceArea || "Texas";
    });

    document.querySelectorAll("[data-config-company]").forEach((el) => {
      el.textContent = cfg.companyName || "The Favorite Cleaner";
    });

    const socialMap = {
      instagram: cfg.instagramUrl,
      facebook: cfg.facebookUrl,
      linkedin: cfg.linkedinUrl
    };

    Object.keys(socialMap).forEach((key) => {
      document.querySelectorAll(`[data-social="${key}"]`).forEach((el) => {
        if (socialMap[key]) {
          el.href = socialMap[key];
          el.target = "_blank";
          el.rel = "noopener noreferrer";
        }
      });
    });

    // Phone / WhatsApp / Booking visibility
    const phone = (cfg.phoneNumber || "").trim();
    const whatsapp = (cfg.whatsappNumber || "").trim();
    const bookingUrl = (cfg.bookingUrl || "").trim();

    document.querySelectorAll("[data-requires-phone]").forEach((el) => {
      if (!phone) {
        el.classList.add("is-hidden-config");
      } else {
        el.classList.remove("is-hidden-config");
        if (el.tagName === "A") el.href = "tel:" + phone.replace(/[^\d+]/g, "");
        const label = el.querySelector("[data-phone-label]");
        if (label) label.textContent = phone;
      }
    });

    document.querySelectorAll("[data-requires-whatsapp]").forEach((el) => {
      if (!whatsapp) {
        el.classList.add("is-hidden-config");
      } else {
        el.classList.remove("is-hidden-config");
        if (el.tagName === "A") {
          const num = whatsapp.replace(/[^\d]/g, "");
          el.href = "https://wa.me/" + num;
          el.target = "_blank";
          el.rel = "noopener noreferrer";
        }
      }
    });

    document.querySelectorAll("[data-book-now]").forEach((el) => {
      if (bookingUrl) {
        el.href = bookingUrl;
        if (/^https?:/i.test(bookingUrl)) {
          el.target = "_blank";
          el.rel = "noopener noreferrer";
        }
      } else {
        el.href = el.dataset.bookFallback || "contact.html#booking";
        el.removeAttribute("target");
        el.removeAttribute("rel");
      }
    });

    // Testimonials
    document.querySelectorAll("[data-testimonials-section]").forEach((el) => {
      if (!cfg.showTestimonials) {
        el.hidden = true;
        el.setAttribute("aria-hidden", "true");
      } else {
        el.hidden = false;
        el.removeAttribute("aria-hidden");
      }
    });

    // Business hours
    const hours = (cfg.businessHours || "").trim();
    document.querySelectorAll("[data-business-hours]").forEach((el) => {
      if (!hours) {
        el.textContent = "Hours available upon request.";
      } else {
        el.textContent = hours;
      }
    });
  }

  /* ---- Copyright year -------------------------------------------------- */
  function setYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---- Active nav ------------------------------------------------------ */
  function setActiveNav() {
    const path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav-link[href], .dropdown a[href]").forEach((link) => {
      const href = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (!href || href === "#") return;
      const isActive =
        href === path ||
        (path === "" && href === "index.html") ||
        (path === "index.html" && href === "index.html");
      if (link.classList.contains("nav-link")) {
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      }
      if (
        ["residential-cleaning.html", "commercial-cleaning.html", "deep-cleaning.html", "move-in-move-out.html", "services.html"].includes(path) &&
        href === "services.html"
      ) {
        const servicesLink = document.querySelector('.nav-link[href="services.html"], .nav-link[data-services-trigger]');
        if (servicesLink) servicesLink.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---- Header scroll --------------------------------------------------- */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const onLightHero = header.classList.contains("header--light-start");

    const update = () => {
      const scrolled = window.scrollY > 24;
      header.classList.toggle("is-scrolled", scrolled && !onLightHero);
      header.classList.toggle("is-scrolled-light", scrolled && onLightHero);
      if (!scrolled && header.dataset.forceSolid !== "true") {
        header.classList.remove("is-solid");
      }
      if (header.dataset.forceSolid === "true") {
        header.classList.add("is-solid");
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---- Mobile nav + dropdown ------------------------------------------- */
  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");
    const dropdownItem = document.querySelector(".nav-item--dropdown");
    const dropdownBtn = document.querySelector("[data-services-trigger]");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : "";
      });

      nav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          if (window.innerWidth <= 1024 && !a.hasAttribute("data-services-trigger")) {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
          }
        });
      });
    }

    if (dropdownItem && dropdownBtn) {
      dropdownBtn.addEventListener("click", (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          dropdownItem.classList.toggle("is-open");
          dropdownBtn.setAttribute(
            "aria-expanded",
            String(dropdownItem.classList.contains("is-open"))
          );
        }
      });

      dropdownBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dropdownItem.classList.toggle("is-open");
          dropdownBtn.setAttribute(
            "aria-expanded",
            String(dropdownItem.classList.contains("is-open"))
          );
        }
        if (e.key === "Escape") {
          dropdownItem.classList.remove("is-open");
          dropdownBtn.setAttribute("aria-expanded", "false");
          dropdownBtn.focus();
        }
      });

      document.addEventListener("click", (e) => {
        if (!dropdownItem.contains(e.target)) {
          dropdownItem.classList.remove("is-open");
          dropdownBtn.setAttribute("aria-expanded", "false");
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
        document.body.style.overflow = "";
      }
    });
  }

  /* ---- FAQ accordion --------------------------------------------------- */
  function initFaq() {
    document.querySelectorAll(".faq-question").forEach((btn) => {
      const panelId = btn.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        panel.classList.toggle("is-open", !expanded);
        panel.hidden = expanded;
      });
    });
  }

  /* ---- Reveal on scroll ------------------------------------------------ */
  function initReveal() {
    const els = document.querySelectorAll(".reveal, .gold-line.draw, .cta-band");
    if (!els.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => {
        el.classList.add("is-visible", "is-inview");
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible", "is-inview");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => io.observe(el));
  }

  /* ---- Soft parallax (desktop) ----------------------------------------- */
  function initParallax() {
    if (reduceMotion || window.innerWidth < 1025) return;
    const media = document.querySelectorAll(".parallax-media img");
    if (!media.length) return;

    const onScroll = () => {
      const y = window.scrollY;
      media.forEach((img) => {
        const parent = img.closest(".parallax-media");
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = (rect.top - window.innerHeight / 2) * 0.04;
        img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.06)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Back to top + floating book ------------------------------------- */
  function initFloating() {
    const topBtn = document.querySelector("[data-back-to-top]");
    const bookFab = document.querySelector(".fab--desktop-book");

    const update = () => {
      const show = window.scrollY > 500;
      if (topBtn) topBtn.classList.toggle("is-visible", show);
      if (bookFab) bookFab.classList.toggle("is-visible", show);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();

    if (topBtn) {
      topBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  }

  /* ---- Hero loaded class ----------------------------------------------- */
  function initHero() {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    requestAnimationFrame(() => hero.classList.add("is-loaded"));
  }

  /* ---- Instagram feed placeholder -------------------------------------- */
  function initInstagramFeed() {
    const feed = document.querySelector("[data-instagram-feed]");
    if (!feed || !cfg.instagramFeedEndpoint) return;

    // Attempt secure serverless endpoint; fall back silently to curated gallery.
    fetch(cfg.instagramFeedEndpoint)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!data || !Array.isArray(data.posts) || !data.posts.length) return;
        feed.innerHTML = "";
        data.posts.slice(0, 8).forEach((post) => {
          const a = document.createElement("a");
          a.href = post.permalink || cfg.instagramUrl;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.className = "gallery-item";
          a.setAttribute("aria-label", post.caption ? post.caption.slice(0, 80) : "Instagram post");
          const img = document.createElement("img");
          img.src = post.media_url;
          img.alt = post.caption ? post.caption.slice(0, 120) : "Instagram photo from The Favorite Cleaner";
          img.loading = "lazy";
          img.width = 600;
          img.height = 600;
          a.appendChild(img);
          feed.appendChild(a);
        });
      })
      .catch(() => {
        /* Keep curated local gallery */
      });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindConfig();
    setYear();
    setActiveNav();
    initHeader();
    initNav();
    initFaq();
    initReveal();
    initParallax();
    initFloating();
    initHero();
    initInstagramFeed();
  });
})();
