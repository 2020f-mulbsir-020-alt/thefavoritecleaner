/**
 * Gallery lightbox and before/after comparison sliders.
 */
(function () {
  "use strict";

  /* ---- Lightbox -------------------------------------------------------- */
  function initLightbox() {
    const items = Array.from(document.querySelectorAll("[data-lightbox]"));
    if (!items.length) return;

    let current = 0;
    let previouslyFocused = null;

    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image gallery");
    lightbox.innerHTML = `
      <button type="button" class="lightbox__close" aria-label="Close gallery">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div class="lightbox__inner">
        <img src="" alt="" />
        <p class="lightbox__caption"></p>
      </div>
      <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next image">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    `;
    document.body.appendChild(lightbox);

    const img = lightbox.querySelector("img");
    const caption = lightbox.querySelector(".lightbox__caption");
    const closeBtn = lightbox.querySelector(".lightbox__close");
    const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
    const nextBtn = lightbox.querySelector(".lightbox__nav--next");

    function show(index) {
      current = (index + items.length) % items.length;
      const el = items[current];
      const full = el.getAttribute("data-full") || el.querySelector("img")?.src;
      const alt = el.querySelector("img")?.alt || "";
      const cap = el.getAttribute("data-caption") || alt;
      img.src = full;
      img.alt = alt;
      caption.textContent = cap;
    }

    function open(index) {
      previouslyFocused = document.activeElement;
      show(index);
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      img.src = "";
      if (previouslyFocused) previouslyFocused.focus();
    }

    items.forEach((el, i) => {
      el.addEventListener("click", () => open(i));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(i);
        }
      });
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
      if (!el.getAttribute("role")) el.setAttribute("role", "button");
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(current - 1));
    nextBtn.addEventListener("click", () => show(current + 1));

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---- Before / After slider ------------------------------------------- */
  function initBeforeAfter() {
    const sliders = document.querySelectorAll(".ba-slider");
    sliders.forEach(setupSlider);

    const tabs = document.querySelectorAll(".ba-tab");
    const panels = document.querySelectorAll(".ba-panel");
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("aria-controls");
        tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");
        panels.forEach((p) => {
          const show = p.id === id;
          p.hidden = !show;
        });
      });

      tab.addEventListener("keydown", (e) => {
        const list = Array.from(tabs);
        const i = list.indexOf(tab);
        if (e.key === "ArrowRight") {
          e.preventDefault();
          list[(i + 1) % list.length].focus();
          list[(i + 1) % list.length].click();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          list[(i - 1 + list.length) % list.length].focus();
          list[(i - 1 + list.length) % list.length].click();
        }
      });
    });
  }

  function setupSlider(root) {
    const wrap = root.querySelector(".ba-slider__before-wrap");
    const handle = root.querySelector(".ba-slider__handle");
    const btn = root.querySelector(".ba-slider__handle-btn");
    if (!wrap || !handle || !btn) return;

    let dragging = false;

    function setPosition(clientX) {
      const rect = root.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(5, Math.min(95, pct));
      wrap.style.width = pct + "%";
      handle.style.left = pct + "%";
      btn.setAttribute("aria-valuenow", String(Math.round(pct)));
    }

    function onPointerDown(e) {
      dragging = true;
      root.setPointerCapture?.(e.pointerId);
      setPosition(e.clientX);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      setPosition(e.clientX);
    }

    function onPointerUp() {
      dragging = false;
    }

    btn.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointerdown", (e) => {
      if (e.target === btn || btn.contains(e.target)) return;
      setPosition(e.clientX);
      dragging = true;
    });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    btn.setAttribute("role", "slider");
    btn.setAttribute("aria-valuemin", "5");
    btn.setAttribute("aria-valuemax", "95");
    btn.setAttribute("aria-valuenow", "50");
    btn.setAttribute("aria-label", "Compare before and after");
    btn.setAttribute("tabindex", "0");

    btn.addEventListener("keydown", (e) => {
      const now = Number(btn.getAttribute("aria-valuenow") || 50);
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const pct = Math.max(5, now - 5);
        wrap.style.width = pct + "%";
        handle.style.left = pct + "%";
        btn.setAttribute("aria-valuenow", String(pct));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const pct = Math.min(95, now + 5);
        wrap.style.width = pct + "%";
        handle.style.left = pct + "%";
        btn.setAttribute("aria-valuenow", String(pct));
      }
    });

    // Keep before image full-bleed width synced
    const beforeImg = wrap.querySelector("img");
    const syncWidth = () => {
      if (beforeImg) beforeImg.style.width = root.offsetWidth + "px";
    };
    syncWidth();
    window.addEventListener("resize", syncWidth);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLightbox();
    initBeforeAfter();
  });
})();
