/**
 * Contact / booking form validation and submission.
 * Uses SITE_CONFIG.formEndpoint when set; otherwise mailto fallback.
 */
(function () {
  "use strict";

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
              _subject: "Book Now — The Favorite Cleaner",
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
            "Thank you — we received your details and will follow up with a clear plan, usually within 1 business day."
          );
        } else {
          // Graceful mailto fallback — no secrets exposed
          const email = cfg.email || "contact@thefavoritecleaner.com";
          const subject = encodeURIComponent("Book Now — The Favorite Cleaner");
          const body = encodeURIComponent(formatMailtoBody(payload));
          window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
          show(
            success,
            "Your email app should open with your full request. If it does not, please email " + email + " directly."
          );
        }
      } catch (err) {
        show(
          error,
          "Something went wrong while sending. Please email " +
            (cfg.email || "contact@thefavoritecleaner.com") +
            " directly."
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText || "Book Now — Send My Request";
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
      "Book Now — cleaning inquiry",
      "--------------------------",
      `Name: ${payload.name || ""}`,
      `Email: ${payload.email || ""}`,
      `Phone: ${payload.phone || ""}`,
      `Preferred Contact: ${payload.preferredContact || ""}`,
      `Best Time to Reach: ${payload.callbackWindow || ""}`,
      `Property Type: ${payload.propertyType || ""}`,
      `Service Needed: ${payload.service || ""}`,
      `Urgency: ${payload.urgency || ""}`,
      `Preferred Date: ${payload.preferredDate || ""}`,
      `Preferred Time: ${payload.preferredTime || ""}`,
      `Property Size: ${payload.propertySize || ""}`,
      `Frequency: ${payload.frequency || ""}`,
      `Pets: ${payload.pets || ""}`,
      `Product Preference: ${payload.productPreference || ""}`,
      `How Found Us: ${payload.hearAbout || ""}`,
      `Referrer: ${payload.referralName || ""}`,
      `City / Address / ZIP: ${payload.location || ""}`,
      `Form Location: ${payload.formLocation || ""}`,
      `Page: ${payload.pagePath || ""}`,
      `UTM Source: ${payload.utm_source || ""}`,
      `UTM Medium: ${payload.utm_medium || ""}`,
      `UTM Campaign: ${payload.utm_campaign || ""}`,
      `UTM Content: ${payload.utm_content || ""}`,
      `UTM Term: ${payload.utm_term || ""}`,
      "",
      "What Matters Most:",
      payload.priorities || "",
      "",
      "Access & Arrival Notes:",
      payload.accessNotes || "",
      "",
      "Anything Else:",
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
