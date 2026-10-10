# grá CEYLON — Product Authenticity Verification API Contract

This document specifies the server-side API contract, database schema, and security architecture for the **grá CEYLON Authenticity Verification Vault**.

---

## 1. System Architecture

```
[Customer on Web/Mobile]
        │
        ▼ (HTTPS POST /api/verify)
┌──────────────────────────────────────────────┐
│  API Gateway / Rate Limiter (e.g., Redis/IP) │
└──────────────────────┬───────────────────────┘
                       │ Passed rate limit
                       ▼
┌──────────────────────────────────────────────┐
│  Verification Controller                     │
│  - Input sanitization & formatting          │
│  - Check code validity                       │
│  - Audit log append (increment view count)   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  SQL Database (PostgreSQL / SQLite / Supabase)│
│  - verification_codes                        │
│  - batches                                   │
│  - products                                  │
│  - verification_logs                         │
└──────────────────────────────────────────────┘
```

---

## 2. API Endpoint Specification

### `POST /api/verify`

Validates a product packaging security code and returns the associated Archival Certificate of Authenticity.

#### Request Headers
```http
POST /api/verify HTTP/1.1
Host: api.graceylon.com
Content-Type: application/json
Accept: application/json
```

#### Request Payload
```json
{
  "code": "GRA-ALBA-2026-X1"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `code` | string | Yes | Alphanumeric security code from the tamper-evident packaging seal (6-32 chars). Case-insensitive. |

---

### Response Types

#### A. 200 OK — Valid Authentic Certificate
Returned when the code is verified in the master ledger.

```json
{
  "status": "AUTHENTIC",
  "certificateId": "CERT-CEY-2026-88349-X",
  "productName": "True Ceylon Cinnamon Quills – Alba Grade",
  "productCategory": "Artisanal Highland Spice",
  "botanicalName": "Cinnamomum verum (Lauraceae)",
  "imageSrc": "assets/cinnamon.png",
  "giLogoSrc": "assets/pure-ceylon-cinnamon-gi-logo.png",
  "originEstate": "Morawakkorale Organic Reserve, Southern Ceylon",
  "harvestSeason": "Late Monsoonal Flush (May 2026)",
  "elevation": "420m Above Sea Level (Low-Grown Sub-Humid)",
  "grade": "Alba (Finest & Rarest Pencil Quills)",
  "batchNumber": "BATCH-ALBA-26-08",
  "firstVerified": "14 October 2026",
  "verificationCount": 2,
  "productUrl": "product-cinnamon.html",
  "masterBlender": "Elena Vance",
  "masterBlenderTitle": "Chief Herbal Curator, grá CEYLON",
  "masterArtisan": "K. G. Dharmadasa",
  "masterArtisanTitle": "Master Quill Peeler, 4th Generation",
  "labSpecs": [
    {
      "label": "Coumarin Content",
      "value": "< 0.003%",
      "note": "Daily Therapeutic Safe"
    },
    {
      "label": "Volatile Essential Oils",
      "value": "3.42%",
      "note": "Rich Sweet Cinnamaldehyde"
    },
    {
      "label": "Cassia Adulteration",
      "value": "0.00%",
      "note": "100% Pure Ceylon Verum"
    },
    {
      "label": "Heavy Metal Screening",
      "value": "Undetected",
      "note": "USP / EU Organic Standard"
    }
  ]
}
```

#### B. 200 OK / 410 Gone — Archived or Recalled Batch
Returned if a batch was withdrawn, recalled, or archived for lab retention.

```json
{
  "status": "EXPIRED",
  "message": "This batch code has expired or has been reserved for archival analysis. Please contact our Concierge for assistance."
}
```

#### C. 404 Not Found — Invalid Code
Returned if the code does not exist. **Security Note:** Does not disclose any customer data or indicate if near matches exist.

```json
{
  "status": "INVALID",
  "message": "The entered code does not exist in our master registry."
}
```

#### D. 429 Too Many Requests — Abuse Protection
Returned when rate limit is exceeded (e.g., > 10 requests / minute / IP).

```json
{
  "status": "RATE_LIMITED",
  "message": "Too many verification requests. Please wait 60 seconds before trying again.",
  "retryAfter": 60
}
```

---

## 3. Database Schema (PostgreSQL / SQLite)

```sql
-- 1. Master Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    botanical_name VARCHAR(255),
    image_url VARCHAR(512),
    gi_badge_url VARCHAR(512),
    product_page_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Production & Harvest Batches
CREATE TABLE batches (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    batch_number VARCHAR(64) UNIQUE NOT NULL,
    origin_estate VARCHAR(255) NOT NULL,
    harvest_season VARCHAR(128) NOT NULL,
    elevation VARCHAR(128),
    grade VARCHAR(128),
    master_blender VARCHAR(255),
    master_blender_title VARCHAR(255),
    master_artisan VARCHAR(255),
    master_artisan_title VARCHAR(255),
    lab_specs JSONB, -- Stores array of {label, value, note}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Individual Unique Package Verification Codes
CREATE TABLE verification_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE,
    certificate_id VARCHAR(64) UNIQUE NOT NULL,
    verification_count INTEGER DEFAULT 0,
    first_verified_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(32) DEFAULT 'AUTHENTIC', -- 'AUTHENTIC', 'EXPIRED', 'REVOKED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create fast lookup index on the code column
CREATE INDEX idx_verification_code ON verification_codes (UPPER(code));

-- 4. Verification Audit Trail Log (Abuse monitoring & re-verification metrics)
CREATE TABLE verification_logs (
    id SERIAL PRIMARY KEY,
    code_id INTEGER REFERENCES verification_codes(id) ON DELETE SET NULL,
    searched_code VARCHAR(64) NOT NULL,
    ip_address_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for privacy
    user_agent TEXT,
    was_successful BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. How Unique Codes Are Linked to Products

1. **Generation:** During packaging at the estate, a secure random batch generator generates high-entropy codes (e.g. `GRA-ALBA-2026-X1`, `GRA-SILVER-7741-T8`).
2. **Printing:** Codes are printed onto tamper-evident hologram adhesive seals.
3. **QR Integration:** A QR code is printed directly alongside the text code:
   `https://graceylon.com/verify.html?code=GRA-ALBA-2026-X1`
   When the customer scans the QR code with their mobile phone camera, the page opens and automatically authenticates the product.
4. **Re-Verification Safety:** Checking a code does *not* invalidate it. Instead, the backend increments `verification_count` and records `first_verified_at`, so genuine buyers can re-verify anytime while identifying if a code was compromised or duplicated.

---

## 5. Transitioning from Prototype to Production

In [`verify.js`](file:///c:/Users/Irshan%20Sudar/Desktop/0-Projects/personal/graceylon/Main/verify.js):

1. Find lines 17-18:
   ```javascript
   const PROTOTYPE_MODE = true;
   const API_ENDPOINT = "/api/verify";
   ```
2. Switch to:
   ```javascript
   const PROTOTYPE_MODE = false;
   const API_ENDPOINT = "https://your-api-domain.com/api/verify";
   ```
3. Test with live database codes!
