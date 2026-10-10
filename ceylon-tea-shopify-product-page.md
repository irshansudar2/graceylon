# Ceylon Tea Shopify Product Page — Optimized Template

Replace every `[placeholder]` with verified product information before publishing. Avoid unproven claims (organic, ethical, "best", scarcity, invented reviews).

## What changed and why

| Before | Optimized | Reason |
|---|---|---|
| 11 sections | 8 sections | Buyers reach the purchase and trust information sooner. |
| Story first, then trust | Trust strip directly under the button | Delivery, returns and origin are visible while deciding. |
| Long heritage copy | Short heritage text with expandable "read more" | Keeps emotion without pushing price and button down on mobile. |
| Long FAQ | Six questions | Each answers a real objection. |
| One closing button | Sticky add-to-cart bar on mobile plus closing button | A buying option is always within reach. |
| Generic comparison | "Which tea suits you?" framing | Guides a choice rather than ranking countries. |

## Page structure

1. Buy box with trust strip
2. Pride and experience strip (3 cards)
3. Heritage story, short version
4. Ceylon is an origin, not a leaf grade
5. Ceylon vs other origins
6. Brew and provenance card
7. Reviews and FAQ
8. Closing call to action and related teas

## 1. Buy box

**Eyebrow:** FROM SRI LANKA. CHOSEN WITH PRIDE.

**H1:** `[Product Name]` — Ceylon `[Tea Type]` from Sri Lanka

**Subline:** `[Tasting notes]` in every cup, from an island whose commercial tea story began in 1867.

**Bullets:**
- Taste: `[two or three verified notes]`, best enjoyed `[occasion]`
- Origin: `[region, estate or Sri Lankan-origin blend]`
- What you get: `[net weight or bag count]`, `[format]`, `[packaging]`

**Controls:** price, pack size, quantity, then **Add to cart – [price]** (show the live price on the button).

**Trust strip (each linked to the relevant policy):**
- `[Dispatch time]`
- `[Delivery cost or genuine free-shipping threshold]`
- `[Returns policy]`
- `[Secure checkout]`

**Gift line:** A gift with a story. `[Gift message / gift wrap, only if offered]`

## 2. Pride strip

- **A real origin.** Ceylon is Sri Lanka's tea, with its own identity and traditions.
- **A ritual, not a routine.** One cup is a reason to pause.
- **Worth sharing.** Pour it for someone, or give it with the story.

## 3. Heritage (short version)

**Heading:** Rooted in Ceylon. Alive in Sri Lanka.

> The name Ceylon carries the history of the island now called Sri Lanka. Its commercial tea story began in 1867, when James Taylor established a plantation at Loolecondera, near Kandy. Today it continues through estates and smallholder growers, pluckers, factory teams, blenders and tasters.
> Choosing Ceylon tea means choosing an origin with a story, and making it part of your day.

Expandable "Read more": add one or two paragraphs of longer history (keeps SEO text on the page without pushing the buy box down).

## 4. An origin, not a leaf grade

**Heading:** One island. Many teas.

Ceylon tea is defined by where it comes from, not by leaf size. It includes leafy and broken-leaf black teas, CTC teas, green teas and white teas, including silver and golden tips. Regions and processing give it a wide range, from fuller-bodied low-grown black teas to lighter, brighter high-grown ones.

**Collection links (only categories you stock):** Black · Green · White · Loose leaf · Tea bags · Flavoured

## 5. Which tea suits you?

**Heading:** Ceylon and other tea origins

> Every origin has its own appeal. Here is how Ceylon sits among them.

| Origin | Typical style | Often chosen for |
|---|---|---|
| **Sri Lanka (Ceylon)** | Black, green and white, with a wide range of body and brightness | Variety from one origin, from fuller to lighter cups |
| India | Assam is strong and malty; Darjeeling can be delicate and muscatel | Robust breakfast cups, or delicate seasonal teas |
| China | Green, black, white, oolong and pu-erh | The broadest range of styles |
| Japan | Steamed green teas such as sencha, often vegetal with umami | Green-tea lovers |
| Kenya | Mostly black, often strong and full-bodied | Bold, robust cups |

*Illustrative styles only. Taste varies by region, harvest, processing and brewing.*

**Closer:** Choose Ceylon for a Sri Lankan origin with range. Choose `[Product Name]` for `[its one verified advantage]`.

## 6. Brew and provenance card

| Brew | Know your tea |
|---|---|
| `[Amount]` tea + `[volume]` water | Origin: `[verified]` |
| `[Temperature]` for `[time]` | Ingredients: `[full list]` |
| Serve: `[suggestion]` | Packed in: `[country]` |
| | Storage: `[instructions]` |

**Lion Logo:** show it only if you are authorised. It marks qualifying 100% Pure Ceylon Tea packed in Sri Lanka; Sri Lankan leaf alone does not qualify. Call your own certificate or batch lookup "our verification", not Tea Board certification.

## 7. Reviews and FAQ

Show real reviews for this product only. If none exist yet, hide the block.

**FAQ:**
- What is Ceylon tea? Tea grown and produced in Sri Lanka, in black, green and white styles.
- Is it always whole leaf? No. It also includes broken-leaf and CTC formats.
- What does this tea taste like? `[verified notes]`
- Where is it from? `[verified origin]`
- How do I brew it? `[product instructions]`
- When will it arrive? `[dispatch and delivery details]`

## 8. Close

**Heading:** Bring the story home

> You don't need a special occasion to choose something meaningful. Make your next cup a discovery.

**Button:** Add to cart – `[price]`

**Related teas:** "Explore another expression of Ceylon" — 3 to 4 in-stock products.

## SEO setup

| Field | Template |
|---|---|
| SEO title (~60 chars) | `[Product] – Ceylon [Type] Tea \| [Brand]` |
| Meta description (~155 chars) | `[Product], a Ceylon [type] tea from Sri Lanka with [notes]. [Pack sizes]. [Delivery/returns hook]. Shop now.` |
| URL handle | `[product]-ceylon-[type]-tea` |
| H1 | One per page, matching product name and tea type |
| H2s | Section headings above |
| Image alt text | Describe what is shown, e.g. "100g pack of [Brand] Ceylon black tea beside a brewed cup" |
| Internal links | Matching collection and a Ceylon tea guide/blog post |

- Aim for 600–900 words of useful visible text plus FAQ; don't repeat the keyword in every sentence.
- Give each product its own opening, tasting notes and brewing details to avoid near-duplicate pages.
- **Structured data:** output `Product` JSON-LD (name, image, description, brand, SKU, offers with price/currency/availability/URL, shipping and return details). Add `aggregateRating` only with real reviews. Validate in Google's Rich Results Test. Check what your theme already outputs to avoid duplicate markup. Eligibility for rich results is not a guarantee.

## Shopify build notes

**Product metafields:** `tasting_notes`, `tea_type`, `format`, `region_estate`, `ingredients`, `brew_amount`, `brew_temp`, `brew_time`, `serving_suggestion`, `packed_in`, `storage`, `verification_url`, `gift_available`.

**Shared theme settings:** heritage story, "One island. Many teas" copy, comparison table, pride cards, FAQ items 1 and 2.

**Performance and mobile:**
- Load the first product image eagerly; lazy-load the rest.
- Use compressed WebP images.
- Add a sticky add-to-cart bar showing selected variant and price.
- Stack the comparison table into cards on narrow screens.
- Hide any section whose metafields are empty.

**Tests (one at a time):**
1. Hero image: pack alone vs. brewed cup with pack.
2. Button label: "Add to cart – £x" vs. "Bring Ceylon home – £x".
3. Trust strip under the button vs. lower on the page.
4. Gift option shown vs. hidden.

Judge by add-to-cart rate and conversion, split by mobile and desktop.

## Sources

- Sri Lanka Tea Board, Ceylon tea Geographical Indication specification
- Sri Lanka Tea Board / pureceylontea.com (Lion Logo)
- Teas.co.uk, Tea Regions
- Google Search Central, Product structured data and merchant listing documentation
