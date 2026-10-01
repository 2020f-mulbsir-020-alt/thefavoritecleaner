/**
 * Contact / booking form validation and submission.
 * Uses SITE_CONFIG.formEndpoint when set; otherwise opens Gmail compose
 * to contact@thefavoritecleaner.com with the request pre-filled.
 */
(function () {
  "use strict";

  function contactEmail(cfg) {
    return cfg.email || "contact@thefavoritecleaner.com";
  }

  function composeEmailUrl(cfg, subject, body) {
    const email = contactEmail(cfg);
    const client = String(cfg.emailClient || "gmail").toLowerCase();
    if (client === "gmail") {
      const params = new URLSearchParams({ view: "cm", fs: "1", to: email });
      if (subject) params.set("su", subject);
      if (body) params.set("body", body);
      return "https://mail.google.com/mail/?" + params.toString();
    }
    let href = "mailto:" + email;
    const parts = [];
    if (subject) parts.push("subject=" + encodeURIComponent(subject));
    if (body) parts.push("body=" + encodeURIComponent(body));
    if (parts.length) href += "?" + parts.join("&");
    return href;
  }

  function initForms() {
    document.querySelectorAll("[data-contact-form]").forEach(setupForm);
  }

  function setupForm(form) {
    const cfg = window.SITE_CONFIG || {};
    const success = form.querySelector(".form-message--success");
    const error = form.querySelector(".form-message--error");
    const submitBtn = form.querySelector('[type="submit"]');
    const pagePathField = form.querySelector("[data-page-path]");

    form.setAttribute("novalidate", "");
    if (pagePathField) {
      pagePathField.value = window.location.pathname.split("/").pop() || "index.html";
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideMessages();

      if (!validate(form)) {
        show(error, "Please check the highlighted fields and try again.");
        const firstInvalid = form.querySelector(".is-invalid input, .is-invalid select, .is-invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());
      const endpoint = (cfg.formEndpoint || "").trim();
      const email = contactEmail(cfg);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending…";
      }

      try {
        if (endpoint) {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...payload,
              _subject: "Book Now - The Favorite Cleaner",
              company: cfg.companyName || "The Favorite Cleaner"
            })
          });

          if (!res.ok) throw new Error("Request failed");
          form.reset();
          clearErrors(form);
          if (pagePathField) {
            pagePathField.value = window.location.pathname.split("/").pop() || "index.html";
          }
          show(
            success,
            "Thank you - we received your details and will follow up with a clear plan, usually within 1 business day."
          );
        } else {
          const subject = "Book Now - The Favorite Cleaner";
          const body = formatMailtoBody(payload);
          const href = composeEmailUrl(cfg, subject, body);
          const useGmail = String(cfg.emailClient || "gmail").toLowerCase() === "gmail";
          if (useGmail) {
            window.open(href, "_blank", "noopener,noreferrer");
            show(
              success,
              "Gmail is opening with your booking request to " +
                email +
                ". Sign in if needed, then press Send."
            );
          } else {
            window.location.href = href;
            show(
              success,
              "Your email app should open with your full request. If it does not, please email " +
                email +
                " directly."
            );
          }
        }
      } catch (err) {
        show(
          error,
          "Something went wrong while sending. Please email " + email + " directly."
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText || "Send Booking Request";
        }
      }
    });

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        const wrap = field.closest(".form-field, .checkbox-field");
        if (wrap && wrap.classList.contains("is-invalid")) validateField(field);
      });
    });

    function hideMessages() {
      if (success) success.classList.remove("is-visible");
      if (error) error.classList.remove("is-visible");
    }

    function show(el, msg) {
      if (!el) return;
      el.textContent = msg;
      el.classList.add("is-visible");
    }
  }

  function formatMailtoBody(payload) {
    const lines = [
      "Book Now - cleaning inquiry",
      "--------------------------",
      `Name: ${payload.name || ""}`,
      `Phone: ${payload.phone || ""}`,
      `Email: ${payload.email || ""}`,
      `Service Needed: ${payload.service || ""}`,
      `Property Type: ${payload.propertyType || ""}`,
      `City / ZIP: ${payload.location || ""}`,
      `How Soon: ${payload.urgency || ""}`,
      `Preferred Date: ${payload.preferredDate || ""}`,
      `Preferred Time: ${payload.preferredTime || ""}`,
      `Pets: ${payload.pets || ""}`,
      `Form Location: ${payload.formLocation || ""}`,
      `Page: ${payload.pagePath || ""}`,
      `UTM Source: ${payload.utm_source || ""}`,
      `UTM Medium: ${payload.utm_medium || ""}`,
      `UTM Campaign: ${payload.utm_campaign || ""}`,
      "",
      "Notes:",
      payload.message || ""
    ];
    return lines.join("\n");
  }

  function validate(form) {
    let ok = true;
    form.querySelectorAll("[required]").forEach((field) => {
      if (!validateField(field)) ok = false;
    });
    form.querySelectorAll('input[type="email"]').forEach((field) => {
      if (field.value && !validateField(field)) ok = false;
    });
    return ok;
  }

  function validateField(field) {
    const wrap = field.closest(".form-field, .checkbox-field");
    if (!wrap) return true;

    let valid = true;
    let message = "";

    if (field.type === "checkbox" && field.required && !field.checked) {
      valid = false;
      message = "Please confirm before submitting.";
    } else if (field.required && !String(field.value || "").trim()) {
      valid = false;
      message = "This field is required.";
    } else if (field.type === "email" && field.value) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(field.value.trim())) {
        valid = false;
        message = "Enter a valid email address.";
      }
    } else if (field.type === "tel" && field.value) {
      const digits = field.value.replace(/\D/g, "");
      if (digits.length < 7) {
        valid = false;
        message = "Enter a valid phone number.";
      }
    }

    wrap.classList.toggle("is-invalid", !valid);
    const err = wrap.querySelector(".field-error");
    if (err) err.textContent = message;
    field.setAttribute("aria-invalid", String(!valid));
    return valid;
  }

  function clearErrors(form) {
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
  }

  document.addEventListener("DOMContentLoaded", initForms);
})();
