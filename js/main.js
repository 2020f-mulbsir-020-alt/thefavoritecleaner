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
      el.textContent = cfg.serviceArea || "USA";
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
        el.href = "#booking";
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

    const responseTime = (cfg.responseTime || "").trim();
    document.querySelectorAll("[data-response-time]").forEach((el) => {
      el.textContent = responseTime || "We respond as soon as we can during business hours.";
    });

    const areaDetail = (cfg.serviceAreaDetail || "").trim();
    document.querySelectorAll("[data-area-detail]").forEach((el) => {
      if (areaDetail) el.textContent = areaDetail;
    });

    const paymentNote = (cfg.paymentNote || "").trim();
    document.querySelectorAll("[data-payment-note]").forEach((el) => {
      if (paymentNote) el.textContent = paymentNote;
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
    let path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!path || path === "/") path = "index.html";
    if (!path.includes(".")) path = path + ".html";

    const servicePages = [
      "residential-cleaning.html",
      "commercial-cleaning.html",
      "deep-cleaning.html",
      "move-in-move-out.html",
      "services.html"
    ];

    document.querySelectorAll(".nav-list > li > .nav-link").forEach((link) => {
      const raw = link.getAttribute("href") || "";
      const href = raw.split("#")[0].toLowerCase();
      const hasHash = raw.includes("#");
      link.removeAttribute("aria-current");

      if (!href || href === "#") return;
      if (hasHash) return;

      const isHome = path === "" || path === "index.html";
      if (href === "index.html" && isHome) {
        link.setAttribute("aria-current", "page");
        return;
      }

      if (href === path) {
        link.setAttribute("aria-current", "page");
      }
    });

    if (servicePages.includes(path)) {
      const servicesLink = document.querySelector("[data-services-trigger]");
      if (servicesLink) servicesLink.setAttribute("aria-current", "page");
    }
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

    const reveal = (el) => {
      el.classList.add("is-visible", "is-inview");
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -10px 0px" }
    );

    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        reveal(el);
      } else {
        io.observe(el);
      }
    });
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

  /* ---- Live work photos / Instagram feed ------------------------------- */
  function renderPhotoFeed(feed, posts) {
    if (!feed || !Array.isArray(posts) || !posts.length) return;
    feed.innerHTML = "";
    posts.slice(0, 10).forEach((post) => {
      const el = document.createElement("a");
      el.href = post.permalink || cfg.instagramUrl || "gallery.html";
      if (/^https?:\/\//i.test(el.href) && el.href.indexOf(location.origin) !== 0) {
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
      el.className = "gallery-item reveal";
      el.setAttribute(
        "aria-label",
        post.caption ? post.caption.slice(0, 80) : "Cleaning work photo"
      );
      const img = document.createElement("img");
      img.src = post.media_url;
      img.alt = post.caption
        ? post.caption.slice(0, 120)
        : "Real cleaning work photo from The Favorite Cleaner";
      img.loading = "lazy";
      img.width = 600;
      img.height = 600;
      el.appendChild(img);
      if (post.caption) {
        const cap = document.createElement("span");
        cap.className = "gallery-item__caption";
        cap.textContent = post.caption;
        el.appendChild(cap);
      }
      feed.appendChild(el);
    });
  }

  function initPhotoFeeds() {
    const feeds = document.querySelectorAll("[data-instagram-feed], [data-work-photos]");
    if (!feeds.length) return;

    const igEndpoint = (cfg.instagramFeedEndpoint || "").trim();
    const workEndpoint = (cfg.workPhotosEndpoint || "data/work-photos.json").trim();

    const loadWork = () =>
      fetch(workEndpoint)
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          const posts = data && Array.isArray(data.posts) ? data.posts : [];
          feeds.forEach((feed) => renderPhotoFeed(feed, posts));
        })
        .catch(() => {
          /* Keep curated HTML gallery already in the page */
        });

    if (igEndpoint) {
      fetch(igEndpoint)
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          if (!data || !Array.isArray(data.posts) || !data.posts.length) throw new Error("empty");
          feeds.forEach((feed) => renderPhotoFeed(feed, data.posts));
        })
        .catch(loadWork);
    } else {
      loadWork();
    }
  }

  /* ---- UTM / campaign attribution (scalable lead tracking) ------------- */
  function initLeadAttribution() {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
    const stored = {};
    let hasNew = false;

    keys.forEach((key) => {
      const val = params.get(key);
      if (val) {
        stored[key] = val;
        hasNew = true;
      }
    });

    if (hasNew) {
      try {
        sessionStorage.setItem("tfc_lead_attribution", JSON.stringify(stored));
      } catch (_) {
        /* ignore */
      }
    }

    let attribution = stored;
    if (!hasNew) {
      try {
        attribution = JSON.parse(sessionStorage.getItem("tfc_lead_attribution") || "{}");
      } catch (_) {
        attribution = {};
      }
    }

    document.querySelectorAll("[data-contact-form]").forEach((form) => {
      Object.entries(attribution).forEach(([key, value]) => {
        if (!value) return;
        let input = form.querySelector(`input[name="${key}"]`);
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          form.appendChild(input);
        }
        input.value = String(value);
      });
    });
  }

  /* ---- Booking modal (opens on Book Now; hidden by default) ------------ */
  function initBookingModal() {
    const modal = document.querySelector("[data-booking-modal]");
    if (!modal) return;

    const dialog = modal.querySelector(".booking-modal__dialog");
    const closeBtns = modal.querySelectorAll("[data-booking-close]");
    let lastFocus = null;

    function openModal() {
      if (!modal.hidden && modal.classList.contains("is-open")) return;
      lastFocus = document.activeElement;
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("booking-open");
      window.requestAnimationFrame(() => modal.classList.add("is-open"));
      const firstField = modal.querySelector(
        '.booking-modal__body input:not([type="hidden"]), .booking-modal__body select, .booking-modal__body textarea'
      );
      if (firstField) firstField.focus({ preventScroll: true });
      if (window.location.hash !== "#booking") {
        history.replaceState(null, "", "#booking");
      }
    }

    function closeModal() {
      if (modal.hidden) return;
      modal.classList.remove("is-open");
      document.body.classList.remove("booking-open");
      modal.setAttribute("aria-hidden", "true");
      window.setTimeout(() => {
        modal.hidden = true;
      }, 220);
      if (window.location.hash === "#booking") {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-book-now], a[href='#booking']");
      if (!trigger) return;
      const cfg = window.SITE_CONFIG || {};
      if ((cfg.bookingUrl || "").trim()) return;
      e.preventDefault();
      const nav = document.querySelector(".nav");
      const toggle = document.querySelector(".nav-toggle");
      if (nav) nav.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      openModal();
    });

    closeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });

    if (dialog) {
      dialog.addEventListener("click", (e) => e.stopPropagation());
    }

    if (window.location.hash === "#booking") {
      openModal();
    }

    window.addEventListener("hashchange", () => {
      if (window.location.hash === "#booking") openModal();
      else if (!modal.hidden) closeModal();
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
    initPhotoFeeds();
    initLeadAttribution();
    initBookingModal();
  });
})();
