# VEXORA — Product Showcase Website

A premium, framework-free (HTML5 + CSS3 + Vanilla JS) product catalog site.
No cart, no checkout — visitors browse products and contact you via **WhatsApp, phone, or email**.

---

## 1. Open it in VS Code

```
1. Unzip the folder.
2. Open the "vexora" folder in VS Code.
3. Install the "Live Server" extension (by Ritwick Dey) — free, one click.
4. Right-click index.html → "Open with Live Server".
```

That's it — no npm install, no build step, no credentials, no API keys.
Everything runs as static files. (Opening `index.html` by double-clicking
also works, but Live Server gives you auto-reload while you edit.)

---

## 2. Folder structure

```
vexora/
├── index.html                 → Homepage (Hero, About, Categories, Featured, Why Us, Gallery, Contact, Footer)
├── pages/
│   ├── categories.html        → All categories grid
│   ├── subcategories.html     → Subcategories for one category (?category=slug)
│   ├── products.html          → Product listing, filterable (?category=&subcategory=)
│   └── product.html           → Product detail page (?id=product-id)
├── css/
│   └── style.css              → Entire design system (CSS variables, components, animations)
├── js/
│   ├── app.js                 → Navbar, mobile menu, scroll reveal, transitions, toasts, contact links
│   └── catalog.js             → Loads JSON data and renders every product/category view
├── data/
│   ├── site-config.json       → Brand name, WhatsApp number, phone, email, social links
│   ├── categories.json        → Categories + subcategories
│   └── products.json          → All products
└── assets/
    └── images/
        ├── logo/logo.svg      → Placeholder logo (replace with your real logo)
        ├── categories/        → Category & subcategory images
        ├── products/          → Product photos
        ├── gallery/           → Homepage gallery images
        └── misc/               → Hero / about images
```

---

## 3. Update your contact details (do this first)

Open **`data/site-config.json`**:

```json
{
  "brandName": "VEXORA",
  "whatsappNumber": "918428817610",   ← country code + number, no + or spaces
  "phoneNumber": "+918428817610",
  "email": "vedanexus8@gmail.com",
  "address": "Your City, State, Country"
}
```

Every WhatsApp/Call/Email button on every page reads from this one file.

---

## 4. Replace the logo

Swap `assets/images/logo/logo.svg` with your real logo file. If you use a
`.png` or `.jpg` instead of `.svg`, update the two `<img src="...logo.svg">`
references per page (search for `logo.svg` across the project) — or simply
keep the filename `logo.svg` and it'll work with no HTML changes at all
(browsers don't require SVGs to literally be vector art saved with that
extension, but for best results export your logo as an actual `.svg`, or
rename your `.png` to replace the file and update the `type="image/svg+xml"`
mime hint in the `<link rel="icon">` tag to `image/png`).

---

## 5. Add / edit products — no HTML editing required

Open **`data/products.json`** and copy an existing entry:

```json
{
  "id": "unique-slug-here",
  "name": "Product Name",
  "category": "stationery",          ← must match a slug in categories.json
  "subcategory": "notebooks",        ← must match a subcategory slug
  "price": "₹399",
  "badge": "New",                    ← optional: "New", "Bestseller", or ""
  "shortDesc": "One-line summary shown on cards.",
  "description": "Full paragraph shown on the product detail page.",
  "images": [
    "assets/images/products/your-image-1.jpg",
    "assets/images/products/your-image-2.jpg"
  ],
  "specs": {
    "Material": "...",
    "Size": "..."
  }
}
```

Drop your photos into `assets/images/products/` and point to them from the
`images` array. The listing page, homepage featured grid, and related-products
section all update automatically — no template code to touch.

## 6. Add / edit categories

Open **`data/categories.json`** — each category has a `slug`, `name`,
`tagline`, `image`, and a list of `subcategories` (each with its own `slug`,
`name`, `image`). Add a new object to the array and it will appear on the
homepage and the Categories page automatically.

---

## 7. Placeholder images

Every image currently in `assets/images/` is an auto-generated blue/orange
placeholder labeled with the product or category name, so the site runs
out of the box. Replace them with real photography before going live —
same filenames, same folders, no code changes needed. Recommended sizes:
- Category/subcategory images: 800×600 (4:3)
- Product images: 1000×1000 (1:1, square)

---

## 8. Design system

All colors, spacing, radii, shadows, and animation timings live as CSS
custom properties at the top of `css/style.css` under `:root`. Change a
value once — e.g. `--color-primary` — and it updates everywhere.

- Primary: Royal Blue `#007BFF`
- Base: White `#FFFFFF`
- Accent (CTAs only): Orange `#F59E0B`

---

## 9. Performance & accessibility notes

- Images lazy-load via `IntersectionObserver` (`data-src` attribute).
- Scroll-reveal and animated counters also use `IntersectionObserver` —
  no scroll-jank, no external libraries.
- `prefers-reduced-motion` is respected globally.
- All interactive elements are keyboard-navigable with visible focus rings.
- Page transitions intercept internal link clicks for a smooth fade
  before navigating (see `initPageTransitions` in `js/app.js`).

---

## 10. Deploying

Since this is 100% static, you can drag-and-drop the whole folder onto
**Netlify**, **Vercel**, **GitHub Pages**, or any static host — no build
command, no environment variables, no backend required.
