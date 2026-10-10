/**
 * ==========================================================================
 * grá CEYLON — Sample Backend Verification Server (Node.js & Express)
 * ==========================================================================
 * This sample server demonstrates the production backend implementation
 * for the grá CEYLON Product Authenticity Verification Vault.
 *
 * Requirements:
 *   npm install express cors express-rate-limit helmet
 *
 * To run:
 *   node server-sample.js
 * ==========================================================================
 */

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Parsing Middleware
app.use(express.json({ limit: "10kb" }));

// Configure CORS for your frontend domain
// [REPLACE BEFORE LAUNCH]: Replace '*' with your production domain, e.g., 'https://graceylon.com'
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Accept"]
  })
);

// ─── RATE LIMITING (ABUSE & BRUTE-FORCE PROTECTION) ───
// Limit each IP to 15 verification requests per 10-minute window
const verifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "RATE_LIMITED",
    message: "Too many verification attempts from this IP address. Please pause for 10 minutes before retrying."
  }
});

// ─── SAMPLE IN-MEMORY DATABASE (REPLACE WITH POSTGRESQL / SQLITE) ───
// In production, connect this to your database via Prisma, TypeORM, or pg pool.
const DATABASE = {
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

  "GRA-EXPIRED-TEST-00": {
    status: "EXPIRED",
    message: "This batch verification code (GRA-EXPIRED-TEST-00) belongs to an archived trial batch that was recalled for archival laboratory retention. It is no longer authorized for commercial distribution."
  }
};

// ─── VERIFICATION ROUTE ───
app.post("/api/verify", verifyLimiter, (req, res) => {
  const { code } = req.body;

  // 1. Validate Input
  if (!code || typeof code !== "string") {
    return res.status(400).json({
      status: "BAD_REQUEST",
      message: "A valid product verification code string is required."
    });
  }

  // 2. Sanitize Code
  const sanitizedCode = code.trim().toUpperCase();

  // Basic regex check: allows alphanumeric characters and hyphens, 5-32 chars
  if (!/^[A-Z0-9-]{5,32}$/.test(sanitizedCode)) {
    return res.status(400).json({
      status: "BAD_REQUEST",
      message: "Invalid code format."
    });
  }

  // 3. Query Database
  const record = DATABASE[sanitizedCode];

  // If not found in registry
  if (!record) {
    // 404 response without leaking internal errors
    return res.status(404).json({
      status: "INVALID",
      message: "The entered code does not exist in our master registry."
    });
  }

  // If batch has been recalled or expired
  if (record.status === "EXPIRED") {
    return res.status(200).json({
      status: "EXPIRED",
      message: record.message
    });
  }

  // If authentic, increment verification counter and record date
  if (record.status === "AUTHENTIC") {
    record.verificationCount = (record.verificationCount || 0) + 1;
    if (!record.firstVerified) {
      record.firstVerified = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }

    // Return the sanitized public certificate payload
    return res.status(200).json(record);
  }

  // Catch-all
  return res.status(404).json({
    status: "INVALID",
    message: "Code verification unsuccessful."
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`grá CEYLON Provenance Verification API running on port ${PORT}`);
  console.log(`POST http://localhost:${PORT}/api/verify`);
});
