# Joy & Glory — Wedding Invitation Website

A premium, animated, single-page wedding invitation for **Joy Aloysius & Glory Deoja**,
built as a free static site that deploys to GitHub Pages. No backend, no database, no
paid services required.

> **New to coding?** This README is written for you. Every section below tells you
> exactly which file to open and what to change — you don't need to understand React
> or TypeScript to update the wedding details, photos, or dates.

---

## Contents

1. [Overview](#overview)
2. [Screenshots](#screenshots)
3. [Technology stack](#technology-stack)
4. [Folder structure](#folder-structure)
5. [Prerequisites](#prerequisites)
6. [Getting started](#getting-started)
7. [Editing wedding content](#editing-wedding-content)
8. [Replacing photos](#replacing-photos)
9. [Wedding date & time zone](#wedding-date--time-zone)
10. [Google Maps configuration](#google-maps-configuration)
11. [Music configuration](#music-configuration)
12. [Calendar configuration](#calendar-configuration)
13. [Deploying to GitHub Pages](#deploying-to-github-pages)
14. [Custom domain setup](#custom-domain-setup)
15. [SEO & social sharing preview](#seo--social-sharing-preview)
16. [PWA & offline behavior](#pwa--offline-behavior)
17. [Privacy considerations](#privacy-considerations)
18. [Accessibility notes](#accessibility-notes)
19. [Performance notes](#performance-notes)
20. [Troubleshooting](#troubleshooting)
21. [QA checklist](#qa-checklist)

---

## Overview

This project was built from the couple's own PowerPoint invitation (names, family
details, ceremony/reception schedule, venues, and photographs). The site opens with a
wax-seal invitation gate, then a premium hero pairing the bride and groom's own
studio portraits, followed by the couple's story, countdown, events, venues (with the
couple's own heart-shaped QR codes), and a save-the-date calendar.

**Content actually supplied and used** (nothing below was invented):

- Couple: Joy Aloysius A (B.E., MBA, software professional) & Glory Deoja A (MBBS.,
  MD, doctor)
- Three events: Holy Matrimony (25 Oct 2026, Tirupathur), Tirupathur Reception (25 Oct
  2026), Puducherry Reception (28 Oct 2026)
- Venue names and addresses for all three events
- Engagement ceremony: 12 July 2026, Bon Séjour, Puducherry (shown with both
  engagement photos in "Our Story")
- Individual studio portraits of the bride and groom (hero and couple-introduction
  cards) and a candid photo together (used for the social share preview image)
- The couple's own gold "JG" monogram, decorative ornaments, and heart-shaped QR
  codes (all extracted from the source presentation)
- All invitation wording (opening message, blessing, closing message)

**Deliberately left out / kept generic** (see inline `// comments` in
[`src/data/wedding.ts`](src/data/wedding.ts)):

- **How they met** — not described in the source material, so "Our Story" shows a
  short symbolic line instead of an invented timeline. Add real chapters any time by
  filling in `story.chapters`.
- **Contact phone/email** — none was supplied, so no Contact section is included at
  all (rather than showing a placeholder or guessed details).
- **Real Google Maps links** — the source only had QR codes (which can't be decoded
  from an image) for two of the three venues, so those addresses are turned into
  Google Maps *search* links instead. The Holy Matrimony venue uses a confirmed exact
  link (`https://maps.app.goo.gl/MqMLP3nsxBDChXc8A`).

---

## Screenshots

> Add real screenshots here after your first deploy — e.g.
> `docs/screenshot-hero.png`, `docs/screenshot-opening.png`, `docs/screenshot-mobile.png`
> — and reference them like:
>
> `![Hero section](docs/screenshot-hero.png)`

| Section | Preview |
| --- | --- |
| Opening (wax seal) | _add screenshot_ |
| Hero | _add screenshot_ |
| Save the Dates calendar | _add screenshot_ |
| Mobile view | _add screenshot_ |

---

## Technology stack

- **React 19 + TypeScript** — component-based UI
- **Vite** — dev server & static production build
- **Tailwind CSS v4** — utility-first styling, configured entirely in
  [`src/styles/index.css`](src/styles/index.css) via `@theme` (v4's CSS-first config
  replaces the old `tailwind.config.js`)
- **Framer Motion** — scroll reveals, the opening animation, the countdown, the
  Bangalore/Pondicherry connection sequence
- **Lucide React** — icons
- **Self-hosted fonts** via `@fontsource` (Playfair Display, Cormorant Garamond, Inter)
  — no third-party font requests, works offline
- **sharp** and **qrcode** (dev-only) — one-time scripts that generate optimized
  images, app icons, the social preview image, and venue QR codes; not shipped to the
  browser
- No router (single page with anchor links) — avoids GitHub Pages 404-on-refresh issues
- No backend/database required

## Folder structure

```
.
├── .github/workflows/deploy.yml   # GitHub Pages deployment workflow
├── assets-source/                 # Raw/original photos (gitignored — see Privacy)
├── public/
│   ├── assets/
│   │   ├── images/                # Optimized JPG/WebP photos, ornaments, OG image
│   │   ├── icons/                 # Favicons & PWA icons
│   │   └── images/qr/             # Generated venue QR codes
│   ├── manifest.webmanifest
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── sw.js                      # Offline-support service worker
│   ├── offline.html
│   └── favicon.svg
├── scripts/
│   ├── prepare-assets.mjs         # Resizes/compresses photos, builds icons + OG image
│   └── generate-qr.mjs            # Builds the venue QR codes
├── src/
│   ├── components/                # Reusable building blocks (Button, Picture, Nav…)
│   ├── sections/                  # One file per page section (Hero, Events, Venue…)
│   ├── data/wedding.ts             # ⭐ All editable wedding content lives here
│   ├── hooks/                     # useCountdown, useLowPowerMode…
│   ├── utils/                     # Dates, maps links, calendar/ICS, share, asset paths
│   ├── styles/index.css           # Tailwind import + design tokens + animations
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) version 20 or newer (Node 22 LTS recommended)
- [Git](https://git-scm.com/) and a free [GitHub](https://github.com/) account
- A code editor such as [VS Code](https://code.visualstudio.com/) (optional but helpful)

You do **not** need to know how to code to update the wedding details — most changes
are edits to plain text inside one file.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
# Open the printed http://localhost:xxxx address in your browser

# 3. Build the production version (outputs to dist/)
npm run build

# 4. Preview the production build locally
npm run preview
```

Other useful scripts:

```bash
npm run lint            # Check for code issues
npm run assets:prepare  # Re-optimize photos after replacing files in assets-source/
npm run assets:qr       # Regenerate venue QR codes after changing addresses
```

## Editing wedding content

Almost everything on the site is driven by **one file**:
[`src/data/wedding.ts`](src/data/wedding.ts). Open it in any text editor and change the
values between quotes. Examples:

```ts
// Change the couple's names
combinedNames: 'Joy & Glory',

// Change an event's venue or time
{
  id: 'holy-matrimony',
  name: 'Holy Matrimony',
  date: '2026-10-25',
  startTime: '10:30',
  venueName: 'Mary Help of Christians Church',
  address: 'Mary Help of Christians Church, Tirupathur, Tamil Nadu',
  ...
}
```

Save the file and, if `npm run dev` is running, the browser updates automatically.

## Replacing photos

1. Put your new photo(s) in `assets-source/photos/` (e.g. `engagement-1.jpg`,
   `engagement-2.jpg`, `groom.jpg`, `bride.jpg` — or new filenames).
2. Run:
   ```bash
   npm run assets:prepare
   ```
   This resizes each photo to two widths, converts to WebP + JPG, strips camera
   metadata, and generates a small blurred placeholder automatically.
3. If you used new filenames, update the matching path(s) in `src/data/wedding.ts`
   (search for `assets/images/`) and in `scripts/prepare-assets.mjs`.
4. `engagement.primary` and `engagement.secondary` both appear together, side by side,
   in the "Our Story" section. `couple.groom.photo` / `couple.bride.photo` are the
   studio portraits used in the Hero and the couple-introduction cards.

Decorative assets (the gold monogram, corner ornaments, divider) and the couple's own
heart-shaped venue QR codes were extracted from the couple's original PowerPoint and
already live in `assets-source/decorative/` and `assets-source/original/pptx-media/`
respectively.

## Wedding date & time zone

All dates live in `src/data/wedding.ts`:

```ts
countdown: {
  label: 'Holy Matrimony',
  date: '2026-10-25',
  time: '10:30',
  timeZone: 'Asia/Kolkata',
  completedMessage: 'The Celebration Has Begun',
},
```

The countdown, event timeline, calendar files, and structured data all read from this
one place. `Asia/Kolkata` never observes daylight saving, so the site uses a fixed
`+05:30` offset — if you ever change `timeZone` to a zone that *does* observe DST, add
its offset to `FIXED_OFFSETS` in [`src/utils/datetime.ts`](src/utils/datetime.ts).

## Google Maps configuration

Each event in `src/data/wedding.ts` has an `address` field. If you don't have a
confirmed Google Maps link, leave `mapsUrl` unset — the site automatically builds a
Google Maps search link from the address (verified working for all three venues in
this project, including resolving two of them to an exact place pin). If you do have a
real Maps link for a venue, paste it into that event's `mapsUrl` field and it will be
used instead. This drives the embedded map and the "Navigate to Venue" button.

The heart-shaped QR image shown under each venue (`qrImage`) is the couple's own
curated artwork from their reference invitation, not generated from `address`/
`mapsUrl` — so changing an address does **not** regenerate it. `npm run assets:qr` is
still available for adding a plain generated QR code for any future venue that
doesn't have its own curated art (see the comments in
[`scripts/generate-qr.mjs`](scripts/generate-qr.mjs)).

## Calendar configuration

The "Save the Date" section offers a combined `.ics` download (all three events),
plus one-click "Add to Google Calendar" / "Add to Outlook Calendar" for the main
ceremony. These are generated automatically from the `events` array — no setup needed.

## Deploying to GitHub Pages

1. Create a new **public** GitHub repository and push this project to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. In the repository on GitHub: **Settings → Pages → Build and deployment → Source**,
   choose **GitHub Actions**.
3. Push any commit to `main` (or re-run the "Deploy to GitHub Pages" workflow from the
   **Actions** tab). The included workflow
   ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) installs
   dependencies, builds the site, and deploys it — no manual steps and no need to
   commit the `dist/` folder.
4. Your site will be live at `https://<your-username>.github.io/<your-repo-name>/`.
   The correct base path is computed automatically from your repository's name.

### Renaming the repository later

Nothing to change — the workflow reads the repository name automatically at build
time (`BASE_PATH` and `VITE_SITE_URL` are both computed from GitHub's own context). If
you prefer to pin them manually, set repository variables `BASE_PATH` and
`VITE_SITE_URL` (Settings → Secrets and variables → Actions → Variables) to override
the defaults.

## Custom domain setup

1. Add a `CNAME` file to `public/` containing your domain (e.g. `wedding.example.com`),
   or configure it under Settings → Pages → Custom domain (GitHub creates the file for
   you).
2. Set repository variables so paths resolve at the domain root instead of a subpath:
   - `BASE_PATH` = `/`
   - `VITE_SITE_URL` = `https://wedding.example.com/`
3. Point your domain's DNS to GitHub Pages per
   [GitHub's custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## SEO & social sharing preview

- Title, description, Open Graph/Twitter tags, and a 1200×630 social preview image
  (`public/assets/images/og-image.jpg`, generated from a real photo + the couple's
  monogram) are already configured in `index.html`.
- The site is set to **discourage search-engine indexing by default**
  (`robots.txt` + a `noindex` meta tag) since it's meant to be shared via a direct
  link. To make it publicly discoverable instead, edit `public/robots.txt` (switch to
  `Allow: /`) and remove the `<meta name="robots" ...>` tag in `index.html`.
- Regenerate the social preview image any time with `npm run assets:prepare`.

## PWA & offline behavior

The site is installable (Add to Home Screen) and shows a small branded offline page if
a guest loses connection mid-visit. The service worker
([`public/sw.js`](public/sw.js)) intentionally uses a **network-first** strategy for
the page itself, so guests always see your latest changes when online — it never
traps them on stale content. If you ever do want to force every returning browser to
drop old cached files (e.g. right after a big content change), bump `CACHE_VERSION` at
the top of `public/sw.js`.

## Privacy considerations

- `assets-source/` (original, unprocessed photos) is excluded from git via
  `.gitignore` because phone photos often embed camera GPS/EXIF metadata. Only the
  optimized copies under `public/assets/images/` are committed, and image processing
  strips metadata automatically.
- No analytics are included by default.
- No contact phone/email is published (none was supplied in the source material).
- Remember: **a public GitHub Pages site is accessible to anyone with the URL.** It is
  not password-protected. Only share the link with people you're comfortable having
  access to the page (and don't index it — see SEO section — if you'd rather keep it
  reachable only via the direct link).

## Accessibility notes

- Semantic landmarks, skip-to-content link, visible focus states, and a logical
  heading hierarchy throughout.
- The photo lightbox and mobile menu trap focus, close on <kbd>Escape</kbd>, and
  restore focus to the triggering element.
- The countdown updates every second visually but is **not** wrapped in an
  `aria-live` region (so screen readers aren't interrupted every second); a single
  static summary sentence is available instead.
- All decorative motion (petals, sparkles, shimmer, parallax) is disabled automatically
  when the browser's `prefers-reduced-motion: reduce` setting is on.
- The Bangalore/Pondicherry sequence is visual by design, but includes a
  screen-reader-only description of what it represents.

## Performance notes

- Fonts are self-hosted, subset to Latin, and loaded as WebP/JPG pairs with responsive
  `srcset`s and blurred placeholders to avoid layout shift.
- Framer Motion animations use only `transform`/`opacity`. Decorative particle counts
  automatically scale down on lower-powered devices and disable entirely under
  reduced motion.
- Run a Lighthouse audit after your first deploy (Chrome DevTools → Lighthouse) to
  confirm scores in your environment; results vary with network conditions and the
  number/size of photos you add.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Blank page after deploying to GitHub Pages | Check that Settings → Pages → Source is "GitHub Actions", and that the workflow run succeeded (Actions tab). |
| Images don't load after deploying | Make sure you didn't hand-edit `vite.config.ts`'s `base` — it should stay driven by `BASE_PATH` from the workflow. |
| Countdown looks wrong | Double-check `date`/`time`/`timeZone` in `src/data/wedding.ts`; the time is interpreted in `timeZone`, not your browser's local time. |
| New photos look blurry or huge | Always run `npm run assets:prepare` after adding files to `assets-source/photos/` — don't reference raw files directly. |
| `npm run build` fails after editing `wedding.ts` | Run `npx tsc -b` to see the exact TypeScript error/line; usually a missing comma or field. |
| Map preview doesn't show | Some networks/ad-blockers block map iframes; the "Navigate to Venue" button always works regardless. |

## QA checklist

- [x] `npm install` completes with no errors
- [x] `npm run dev` starts and the site loads
- [x] `npm run build` (TypeScript + Vite) completes with no errors
- [x] `npm run preview` serves the production build correctly
- [x] Countdown targets 25 Oct 2026, 10:30 AM `Asia/Kolkata`, never shows negative values
- [x] All three venue addresses resolve on the embedded map and the "Navigate" links
- [x] No contact details, invented story details, or fabricated relationship facts appear anywhere
- [x] Reduced-motion mode disables decorative animation
- [x] Mobile menu and skip-link are keyboard operable
- [x] No horizontal overflow at 320–1440px widths
- [ ] **You still need to:** add real screenshots to this README, and update
      `VITE_SITE_URL` once your GitHub Pages URL is live (or rely on the workflow's
      automatic default).
