/* ==========================================================================
   grá CEYLON — PRODUCT AUTHENTICITY VERIFICATION ENGINE
   ==========================================================================
   This script drives the interactive verification workflow, including:
   - Prototype mock database for demonstration and stakeholder review
   - Plug-and-play architecture for switching to a live server endpoint
   - URL query parameter pre-fill (?code=...)
   - Rate limiting & abuse protection simulation
   - Certificate rendering with real packaging & GI provenance assets
   - Archival PDF/Print handling and shareable link copying
   ========================================================================== */

/* ─── ARCHITECTURE SETTINGS & PRODUCTION TOGGLE ─── */
// When ready to connect your production backend:
// 1. Set PROTOTYPE_MODE to false
// 2. Set API_ENDPOINT to your backend URL (e.g., "https://api.graceylon.com/v1/verify")
const PROTOTYPE_MODE = true;
const API_ENDPOINT = "/api/verify";

/* ─── PROTOTYPE DATABASE (SAMPLE DATA ONLY) ─── */
// In production, all records are stored securely in your private database.
const MOCK_PROVENANCE_REGISTRY = {
  "GRA-ALBA-2026-X1": {
    status: "AUTHENTIC",
    certificateId: "CERT-CEY-2026-88349-X",
    productName: "True Ceylon Cinnamon Quills – Alba Grade",
    productCategory: "Artisanal Highland Spice",
    botanicalName: "Cinnamomum verum (Lauraceae)",
    imageSrc: "assets/cinnamon.png",
    giLogoSrc: "assets/pure-ceylon-cinnamon-gi-logo.png",
    originEstate: "Morawakkorale Organic Reserve, Southern Ceylon",
    harvestSeason: "Late Monsoonal Flush (May 2026)",
    elevation: "420m Above Sea Level (Low-Grown Sub-Humid)",
    grade: "Alba (Finest & Rarest Pencil Quills)",
    batchNumber: "BATCH-ALBA-26-08",
    firstVerified: "14 October 2026",
    verificationCount: 2,
    productUrl: "product-cinnamon.html",
    masterBlender: "Elena Vance",
    masterBlenderTitle: "Chief Herbal Curator, grá CEYLON",
    masterArtisan: "K. G. Dharmadasa",
    masterArtisanTitle: "Master Quill Peeler, 4th Generation",
    labSpecs: [
      { label: "Coumarin Content", value: "< 0.003%", note: "Daily Therapeutic Safe" },
      { label: "Volatile Essential Oils", value: "3.42%", note: "Rich Sweet Cinnamaldehyde" },
      { label: "Cassia Adulteration", value: "0.00%", note: "100% Pure Ceylon Verum" },
      { label: "Heavy Metal Screening", value: "Undetected", note: "USP / EU Organic Standard" }
    ]
  },

  "GRA-SILVER-7741-T8": {
    status: "AUTHENTIC",
    certificateId: "CERT-CEY-2026-11902-S",
    productName: "Royal Silver Tips Imperial White Tea",
    productCategory: "Imperial Single-Estate White Tea",
    botanicalName: "Camellia sinensis var. assamica",
    imageSrc: "assets/silver_tips.png",
    giLogoSrc: "assets/flag-sri-lanka.png",
    originEstate: "Nuwara Eliya Mist Valley Estate (High Grown)",
    harvestSeason: "Sunrise Spring Flush (April 2026)",
    elevation: "1,890m Above Sea Level (Highland Cloud Forest)",
    grade: "Supreme Hand-Rolled Silver Tips (Tender Bud Only)",
    batchNumber: "BATCH-ST-26-03",
    firstVerified: "28 September 2026",
    verificationCount: 1,
    productUrl: "collections.html",
    masterBlender: "Priya Senanayake",
    masterBlenderTitle: "Head Tea Sommelier",
    masterArtisan: "Anoma Jayawardena",
    masterArtisanTitle: "Master Dawn Harvester",
    labSpecs: [
      { label: "EGCG Antioxidants", value: "24.8%", note: "Unfermented Sun-Withered" },
      { label: "Total Polyphenols", value: "28.2 mg/g", note: "Peak Cellular Vitality" },
      { label: "Natural Caffeine", value: "12 mg/cup", note: "Gentle Morning Sustenance" },
      { label: "Agrochemical Residue", value: "0.00%", note: "100% Certified Organic" }
    ]
  },

  "GRA-ELIXIR-4490-W3": {
    status: "AUTHENTIC",
    certificateId: "CERT-CEY-2026-55420-E",
    productName: "Royal Elixir Botanical Spa Oil",
    productCategory: "Restorative Botanical Wellness",
    botanicalName: "Organic Ceylon Botanical Complex",
    imageSrc: "assets/wellness_oil.png",
    giLogoSrc: "assets/flag-sri-lanka.png",
    originEstate: "Ella Valley Sacred Ayurvedic Sanctuary",
    harvestSeason: "Monsoon Solstice Cold-Press 2026",
    elevation: "1,050m Above Sea Level",
    grade: "Grade 1 Cold-Pressed Virgin Elixir",
    batchNumber: "BATCH-ELX-26-11",
    firstVerified: "02 November 2026",
    verificationCount: 3,
    productUrl: "collections.html",
    masterBlender: "Elena Vance",
    masterBlenderTitle: "Chief Botanical Formulator",
    masterArtisan: "Dr. Ananda Ratnayake",
    masterArtisanTitle: "Ayurvedic Herbal Physician, D.A.M.S.",
    labSpecs: [
      { label: "Virgin Moringa Base", value: "Pure Cold-Press", note: "Unheated Nutritive Base" },
      { label: "Synthetic Fragrances", value: "0.00%", note: "Free from Phthalates" },
      { label: "Fatty Acid Profile", value: "Oleic Acid 73%", note: "Deep Dermal Hydration" },
      { label: "Microbial Purity", value: "Passed", note: "Pharmacopoeia Cleared" }
    ]
  },

  "GRA-EXPIRED-TEST-00": {
    status: "EXPIRED",
    message: "This batch verification code (GRA-EXPIRED-TEST-00) belongs to an archived trial batch that was recalled for archival laboratory retention. It is no longer authorized for commercial distribution."
  }
};

/* ─── CLIENT-SIDE RATE LIMITING SIMULATION ─── */
const RATE_LIMIT_CONFIG = {
  maxAttempts: 6,
  windowMs: 30000, // 30 seconds
  cooldownMs: 60000 // 60 seconds lockout
};
let attemptTimestamps = [];
let rateLimitLockedUntil = 0;

/* ─── STANDALONE TOAST NOTIFICATION HELPER ─── */
function showToast(message, type = "success") {
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const icon = type === "success" ? "🏺" : type === "error" ? "✕" : "✨";

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add("active"), 10);

  setTimeout(() => {
    toast.classList.remove("active");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ─── INITIALIZATION ON DOM READY ─── */
document.addEventListener("DOMContentLoaded", () => {
  const codeInput = document.getElementById("verificationCode");
  const clearBtn = document.getElementById("clearInputBtn");
  const submitBtn = document.getElementById("verifySubmitBtn");
  const form = document.getElementById("verificationForm");
  const loadingCard = document.getElementById("verifyLoadingCard");
  const alertCard = document.getElementById("verifyAlertCard");
  const certificateWrapper = document.getElementById("certificateWrapper");
  const whereToFindBtn = document.getElementById("whereToFindTrigger");
  const whereToFindPanel = document.getElementById("whereToFindPanel");
  const testChips = document.querySelectorAll(".test-chip");

  /* 1. Clear Button Visibility */
  if (codeInput && clearBtn) {
    codeInput.addEventListener("input", () => {
      if (codeInput.value.trim().length > 0) {
        clearBtn.classList.add("visible");
      } else {
        clearBtn.classList.remove("visible");
      }
    });

    clearBtn.addEventListener("click", () => {
      codeInput.value = "";
      clearBtn.classList.remove("visible");
      codeInput.focus();
      hideResults();
    });
  }

  /* 2. "Where to Find Code" Toggle */
  if (whereToFindBtn && whereToFindPanel) {
    whereToFindBtn.addEventListener("click", () => {
      const isExpanded = whereToFindPanel.classList.toggle("active");
      whereToFindBtn.setAttribute("aria-expanded", isExpanded);
      const icon = whereToFindBtn.querySelector(".where-icon");
      if (icon) {
        icon.textContent = isExpanded ? "▲" : "▼";
      }
    });
  }

  /* 3. Prototype Test Chips (One-Click Testing) */
  testChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const code = chip.getAttribute("data-code");
      if (codeInput && code) {
        codeInput.value = code;
        if (clearBtn) clearBtn.classList.add("visible");
        performVerification(code);
      }
    });
  });

  /* 4. Form Submit Handler */
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = codeInput ? codeInput.value.trim() : "";
      if (!code) {
        showToast("Please enter a verification code from your packaging.", "error");
        if (codeInput) codeInput.focus();
        return;
      }
      performVerification(code);
    });
  }

  /* 5. URL Query Parameter Support (?code=GRA-ALBA-2026-X1) */
  const urlParams = new URLSearchParams(window.location.search);
  const codeFromUrl = urlParams.get("code");
  if (codeFromUrl && codeInput) {
    codeInput.value = codeFromUrl.trim().toUpperCase();
    if (clearBtn) clearBtn.classList.add("visible");
    setTimeout(() => {
      performVerification(codeFromUrl.trim().toUpperCase());
    }, 400);
  }

  /* 6. Certificate Interactive Actions */
  setupCertificateActions();

  /* 7. FAQ Accordion */
  setupFaqAccordion();

  /* ==========================================================================
     CORE VERIFICATION DISPATCHER
     ========================================================================== */
  async function performVerification(rawCode) {
    const formattedCode = rawCode.trim().toUpperCase();

    // Check rate limiting
    if (isRateLimited()) {
      const remainingSec = Math.ceil((rateLimitLockedUntil - Date.now()) / 1000);
      showAlert(
        "rate-limited",
        "Verification Rate Limit Reached",
        `To protect our provenance ledger from brute-force queries, please wait ${remainingSec > 0 ? remainingSec : 30} seconds before attempting another verification.`
      );
      showToast("Security rate limit activated. Please pause.", "error");
      return;
    }

    // Record submission attempt
    recordAttempt();

    // Set UI to loading state
    hideResults();
    setLoading(true);

    try {
      let result;

      if (PROTOTYPE_MODE) {
        // Simulated network latency (650ms) for realistic UX
        await new Promise((resolve) => setTimeout(resolve, 650));
        result = simulateMockVerification(formattedCode);
      } else {
        // Production API call
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({ code: formattedCode })
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }
        result = await response.json();
      }

      setLoading(false);
      handleVerificationResult(formattedCode, result);
    } catch (error) {
      console.error("Verification communication error:", error);
      setLoading(false);
      showAlert(
        "invalid",
        "Connection Error",
        "Unable to connect to the grá CEYLON Provenance Ledger. Please check your internet connection and try again."
      );
      showToast("Verification request failed. Please retry.", "error");
    }
  }

  /* ─── MOCK API SIMULATION ─── */
  function simulateMockVerification(code) {
    if (MOCK_PROVENANCE_REGISTRY[code]) {
      return MOCK_PROVENANCE_REGISTRY[code];
    }
    return {
      status: "INVALID",
      message: "The entered code does not exist in our master registry."
    };
  }

  /* ─── RESULT HANDLER ─── */
  function handleVerificationResult(code, data) {
    if (data.status === "AUTHENTIC") {
      renderCertificate(code, data);
      showToast("✓ Authenticity Verified: Single-Estate Origin Confirmed", "success");
      // Smooth scroll to certificate
      setTimeout(() => {
        certificateWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else if (data.status === "EXPIRED") {
      showAlert(
        "expired",
        "Archived or Recalled Batch",
        data.message || "This batch code has expired or has been reserved for archival analysis. Please contact our Concierge for assistance."
      );
      showToast("Warning: Batch record archived or restricted.", "error");
    } else {
      showAlert(
        "invalid",
        "Code Not Found in Master Registry",
        `We could not find a registered grá CEYLON certificate for code "${code}". Please ensure there are no typographical errors, check the hologram label on the packaging, or contact our Concierge team if you believe this is an error.`
      );
      showToast("Verification code not recognized.", "error");
    }
  }

  /* ─── RENDER CERTIFICATE ─── */
  function renderCertificate(code, product) {
    if (!certificateWrapper) return;

    // Update dynamic fields
    const certNumberEl = document.getElementById("certReferenceNumber");
    const certCodeDisplay = document.getElementById("certVerificationCode");
    const certImgEl = document.getElementById("certProductImage");
    const certGiEl = document.getElementById("certGiBadge");
    const certCategoryEl = document.getElementById("certProductCategory");
    const certTitleEl = document.getElementById("certProductName");
    const certBotanicalEl = document.getElementById("certBotanicalName");
    const certEstateEl = document.getElementById("certEstate");
    const certHarvestEl = document.getElementById("certHarvest");
    const certElevationEl = document.getElementById("certElevation");
    const certGradeEl = document.getElementById("certGrade");
    const certBatchEl = document.getElementById("certBatch");
    const certVerifiedCountEl = document.getElementById("certVerifiedCount");
    const certBlenderSignEl = document.getElementById("certBlenderSignature");
    const certBlenderTitleEl = document.getElementById("certBlenderTitle");
    const certArtisanSignEl = document.getElementById("certArtisanSignature");
    const certArtisanTitleEl = document.getElementById("certArtisanTitle");
    const certProductLinkBtn = document.getElementById("certProductLinkBtn");

    if (certNumberEl) certNumberEl.textContent = product.certificateId || "CERT-CEY-2026-X";
    if (certCodeDisplay) certCodeDisplay.textContent = code;
    if (certImgEl) {
      certImgEl.src = product.imageSrc;
      certImgEl.alt = product.productName;
    }
    if (certGiEl && product.giLogoSrc) {
      certGiEl.src = product.giLogoSrc;
    }
    if (certCategoryEl) certCategoryEl.textContent = product.productCategory;
    if (certTitleEl) certTitleEl.textContent = product.productName;
    if (certBotanicalEl) certBotanicalEl.textContent = product.botanicalName;
    if (certEstateEl) certEstateEl.textContent = product.originEstate;
    if (certHarvestEl) certHarvestEl.textContent = product.harvestSeason;
    if (certElevationEl) certElevationEl.textContent = product.elevation;
    if (certGradeEl) certGradeEl.textContent = product.grade;
    if (certBatchEl) certBatchEl.textContent = product.batchNumber;

    if (certVerifiedCountEl) {
      const times = product.verificationCount || 1;
      certVerifiedCountEl.innerHTML = `Verified <strong>${times} time${times > 1 ? "s" : ""}</strong> (First checked: ${product.firstVerified})`;
    }

    if (certBlenderSignEl) certBlenderSignEl.textContent = product.masterBlender || "Elena Vance";
    if (certBlenderTitleEl) certBlenderTitleEl.textContent = product.masterBlenderTitle || "Chief Herbal Curator";
    if (certArtisanSignEl) certArtisanSignEl.textContent = product.masterArtisan || "K. G. Dharmadasa";
    if (certArtisanTitleEl) certArtisanTitleEl.textContent = product.masterArtisanTitle || "Master Artisan";

    if (certProductLinkBtn) {
      certProductLinkBtn.href = product.productUrl || "collections.html";
      certProductLinkBtn.textContent = `Explore ${product.productName.split("–")[0].trim()}`;
    }

    // Render Specs Grid
    const specsContainer = document.getElementById("certSpecsGrid");
    if (specsContainer && product.labSpecs) {
      specsContainer.innerHTML = product.labSpecs
        .map(
          (spec) => `
        <div class="spec-cell">
          <div class="spec-cell-value">${spec.value}</div>
          <div class="spec-cell-label">${spec.label}</div>
          <div style="font-size:0.65rem; color:hsl(var(--accent-cyan)); margin-top:0.25rem;">${spec.note}</div>
        </div>
      `
        )
        .join("");
    }

    certificateWrapper.classList.add("active");
  }

  /* ─── UI STATE CONTROLLERS ─── */
  function setLoading(isLoading) {
    if (submitBtn) {
      submitBtn.disabled = isLoading;
      submitBtn.innerHTML = isLoading
        ? `<span>Consulting Master Ledger...</span>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Verify Authenticity`;
    }
    if (loadingCard) {
      if (isLoading) {
        loadingCard.classList.add("active");
      } else {
        loadingCard.classList.remove("active");
      }
    }
  }

  function hideResults() {
    if (alertCard) alertCard.classList.remove("active");
    if (certificateWrapper) certificateWrapper.classList.remove("active");
    if (loadingCard) loadingCard.classList.remove("active");
  }

  function showAlert(type, title, description) {
    if (!alertCard) return;
    alertCard.className = `verify-alert-card active alert-${type}`;

    const iconHtml =
      type === "invalid"
        ? `✕`
        : type === "expired"
        ? `⚠️`
        : `🛡️`;

    alertCard.innerHTML = `
      <div class="alert-icon-wrapper">${iconHtml}</div>
      <div class="alert-content">
        <h4 class="alert-title">${title}</h4>
        <p class="alert-desc">${description}</p>
        <div class="alert-actions">
          <button type="button" class="alert-link-btn" id="retryVerifyBtn">Re-enter Code</button>
          <a href="mailto:curator@graceylon.com?subject=Provenance%20Verification%20Inquiry" class="alert-link-btn" target="_blank">Contact Concierge</a>
        </div>
      </div>
    `;

    const retryBtn = document.getElementById("retryVerifyBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        hideResults();
        if (codeInput) {
          codeInput.focus();
          codeInput.select();
        }
      });
    }

    setTimeout(() => {
      alertCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  /* ─── RATE LIMITING UTILITIES ─── */
  function recordAttempt() {
    const now = Date.now();
    attemptTimestamps.push(now);
    // keep only attempts in window
    attemptTimestamps = attemptTimestamps.filter((ts) => now - ts < RATE_LIMIT_CONFIG.windowMs);

    if (attemptTimestamps.length >= RATE_LIMIT_CONFIG.maxAttempts) {
      rateLimitLockedUntil = now + RATE_LIMIT_CONFIG.cooldownMs;
    }
  }

  function isRateLimited() {
    return Date.now() < rateLimitLockedUntil;
  }

  /* ─── CERTIFICATE INTERACTIVE ACTIONS ─── */
  function setupCertificateActions() {
    const printBtn = document.getElementById("printCertBtn");
    const shareBtn = document.getElementById("shareCertBtn");
    const verifyAnotherBtn = document.getElementById("verifyAnotherBtn");

    if (printBtn) {
      printBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.print();
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const code = codeInput ? codeInput.value.trim().toUpperCase() : "";
        const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(code)}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(shareUrl);
            showToast("✓ Authenticity link copied to clipboard.", "success");
            return;
          } catch (err) {
            console.warn("Clipboard write failed, using prompt fallback", err);
          }
        }
        window.prompt("Shareable Authenticity Verification Link:", shareUrl);
      });
    }

    if (verifyAnotherBtn) {
      verifyAnotherBtn.addEventListener("click", (e) => {
        e.preventDefault();
        hideResults();
        if (codeInput) {
          codeInput.value = "";
          if (clearBtn) clearBtn.classList.remove("visible");
          codeInput.focus();
        }
        window.scrollTo({ top: 350, behavior: "smooth" });
      });
    }
  }

  /* ─── FAQ ACCORDION ─── */
  function setupFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const trigger = item.querySelector(".faq-trigger");
      if (trigger) {
        trigger.addEventListener("click", () => {
          const isOpen = item.classList.contains("active");
          faqItems.forEach((other) => other.classList.remove("active"));
          if (!isOpen) {
            item.classList.add("active");
          }
        });
      }
    });
  }
});
