// One-off asset pipeline: reads raw files from assets-source/ and writes optimized,
// metadata-stripped images into public/assets/. Re-run with `npm run assets:prepare`
// whenever photos in assets-source/ are replaced.
import sharp from 'sharp';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const SRC = path.join(root, 'assets-source');
const IMAGES_OUT = path.join(root, 'public', 'assets', 'images');
const ICONS_OUT = path.join(root, 'public', 'assets', 'icons');
const DATA_OUT = path.join(root, 'src', 'data');

const MAROON = { r: 74, g: 20, b: 32, alpha: 1 }; // deep burgundy icon background

async function ensureDirs() {
  await mkdir(IMAGES_OUT, { recursive: true });
  await mkdir(ICONS_OUT, { recursive: true });
  await mkdir(DATA_OUT, { recursive: true });
}

/** Resize + strip metadata, emit both webp and jpg at the given widths. */
/** Resize + strip metadata, emit both webp and jpg at the given widths. `crop`
 * (left/top/width/height, in source pixels) trims dead space before resizing —
 * used for the hero couple photo so both faces stay in frame on tall crops. */
async function processPhoto(name, srcFile, crop) {
  const input = path.join(SRC, 'photos', srcFile);
  const source = crop ? sharp(input).rotate().extract(crop) : sharp(input).rotate();
  const widths = [800, 1600];
  for (const width of widths) {
    const base = source.clone().resize({ width, withoutEnlargement: true });
    await base
      .clone()
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(path.join(IMAGES_OUT, `${name}-${width}.jpg`));
    await base
      .clone()
      .webp({ quality: 76 })
      .toFile(path.join(IMAGES_OUT, `${name}-${width}.webp`));
  }
  // Tiny blurred placeholder (LQIP) as a base64 data URI for instant paint.
  const tiny = await source
    .clone()
    .resize({ width: 24 })
    .blur(2)
    .jpeg({ quality: 40 })
    .toBuffer();
  return `data:image/jpeg;base64,${tiny.toString('base64')}`;
}

/** Trim transparent padding and emit PNG + WebP at a max width. */
async function processOrnament(name, srcFile, width) {
  const input = path.join(SRC, 'decorative', srcFile);
  const base = sharp(input).trim().resize({ width, withoutEnlargement: true });
  await base.clone().png({ quality: 90, compressionLevel: 9 }).toFile(path.join(IMAGES_OUT, `${name}.png`));
  await base.clone().webp({ quality: 82 }).toFile(path.join(IMAGES_OUT, `${name}.webp`));
}

async function processPaperTexture() {
  const input = path.join(SRC, 'decorative', 'paper-texture.jpg');
  const base = sharp(input).resize({ width: 1200, withoutEnlargement: true });
  await base.clone().jpeg({ quality: 70 }).toFile(path.join(IMAGES_OUT, 'paper-texture.jpg'));
  await base.clone().webp({ quality: 68 }).toFile(path.join(IMAGES_OUT, 'paper-texture.webp'));
}

/** Build square app icons from the trimmed monogram on a maroon field. */
async function processIcons() {
  const monogramInput = path.join(SRC, 'decorative', 'monogram-jg.png');
  const trimmedMonogram = await sharp(monogramInput).trim().toBuffer();

  const sizes = [
    { file: 'favicon-16x16.png', size: 16, pad: 0.16 },
    { file: 'favicon-32x32.png', size: 32, pad: 0.16 },
    { file: 'apple-touch-icon.png', size: 180, pad: 0.14 },
    { file: 'pwa-192.png', size: 192, pad: 0.14 },
    { file: 'pwa-512.png', size: 512, pad: 0.14 },
  ];

  for (const { file, size, pad } of sizes) {
    const inner = Math.round(size * (1 - pad * 2));
    const monogram = await sharp(trimmedMonogram)
      .resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: MAROON } })
      .composite([{ input: monogram, gravity: 'center' }])
      .png()
      .toFile(path.join(ICONS_OUT, file));
  }

  // Maskable icon needs a larger safe-zone margin (~20%) so Android doesn't clip it.
  const maskableSize = 512;
  const maskableInner = Math.round(maskableSize * 0.6);
  const maskableMonogram = await sharp(trimmedMonogram)
    .resize({ width: maskableInner, height: maskableInner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({ create: { width: maskableSize, height: maskableSize, channels: 4, background: MAROON } })
    .composite([{ input: maskableMonogram, gravity: 'center' }])
    .png()
    .toFile(path.join(ICONS_OUT, 'pwa-maskable-512.png'));

  // Standalone monogram used inside the app UI (seal / emblem), trimmed + transparent.
  // Sized generously (well beyond any on-screen display size) so it stays crisp on
  // high-DPI screens even where the UI shows it fairly large (e.g. the opening seal).
  const emblem = sharp(trimmedMonogram).resize({ width: 720, withoutEnlargement: true });
  await emblem.clone().png({ quality: 90 }).toFile(path.join(IMAGES_OUT, 'monogram-jg.png'));
  await emblem.clone().webp({ quality: 88 }).toFile(path.join(IMAGES_OUT, 'monogram-jg.webp'));
}

async function toBase64(file) {
  const buf = await readFile(file);
  const ext = path.extname(file).slice(1);
  return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${buf.toString('base64')}`;
}

/** Compose a 1200x630 social preview image (couple photo + names + date). */
async function buildOgImage() {
  const photoPath = path.join(IMAGES_OUT, 'couple-1600.jpg');
  const photoBuffer = await sharp(photoPath)
    .resize({ width: 620, height: 630, fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82 })
    .toBuffer();
  const photoB64 = `data:image/jpeg;base64,${photoBuffer.toString('base64')}`;
  const monogramB64 = await toBase64(path.join(IMAGES_OUT, 'monogram-jg.png'));

  const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fbf6ee"/>
        <stop offset="100%" stop-color="#f1e3c8"/>
      </linearGradient>
      <clipPath id="photoClip">
        <rect x="0" y="0" width="620" height="630" />
      </clipPath>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <g clip-path="url(#photoClip)">
      <image href="${photoB64}" x="0" y="0" width="620" height="630" preserveAspectRatio="xMidYMid slice"/>
    </g>
    <rect x="620" y="0" width="6" height="630" fill="#c9a24b"/>
    <rect x="20" y="20" width="580" height="590" fill="none" stroke="#c9a24b" stroke-width="2" opacity="0.001"/>
    <image href="${monogramB64}" x="686" y="70" width="120" height="120"/>
    <text x="650" y="290" font-family="Georgia, 'Times New Roman', serif" font-size="64" fill="#3a1420" font-weight="600">Joy</text>
    <text x="650" y="360" font-family="Georgia, 'Times New Roman', serif" font-size="40" fill="#8a6d3b" font-style="italic">&amp;</text>
    <text x="650" y="440" font-family="Georgia, 'Times New Roman', serif" font-size="64" fill="#3a1420" font-weight="600">Glory</text>
    <rect x="650" y="470" width="220" height="3" fill="#c9a24b"/>
    <text x="650" y="520" font-family="Arial, Helvetica, sans-serif" font-size="28" letter-spacing="2" fill="#5c3a26">25 OCTOBER 2026</text>
    <text x="650" y="560" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#8a6d3b">Tirupathur &amp; Puducherry</text>
  </svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(path.join(IMAGES_OUT, 'og-image.jpg'));
}

async function main() {
  await ensureDirs();

  const [couplePlaceholder, engagement1Placeholder, engagement2Placeholder, groomPlaceholder, bridePlaceholder, groomHeroPlaceholder, brideHeroPlaceholder] = await Promise.all([
    // Cropped to trim the empty background to the right of the groom so both
    // faces stay in frame when the hero renders this as a full-bleed portrait crop.
    processPhoto('couple', 'couple.jpg', { left: 28, top: 0, width: 442, height: 423 }),
    processPhoto('engagement-1', 'engagement-1.jpg'),
    processPhoto('engagement-2', 'engagement-2.jpg'),
    processPhoto('groom-portrait', 'groom.jpg'),
    processPhoto('bride-portrait', 'bride.jpg'),
    // Hero-section-only photos, separate from the CoupleIntro portraits above.
    processPhoto('groom-hero', 'groom-hero.jpg'),
    processPhoto('bride-hero', 'bride-hero.jpg'),
  ]);

  await Promise.all([
    processOrnament('ornament-corner', 'ornament-corner.png', 500),
    processOrnament('ornament-floral', 'ornament-floral.png', 700),
    processOrnament('ornament-divider', 'ornament-divider.png', 900),
    processPaperTexture(),
  ]);

  await processIcons();
  await buildOgImage();

  const placeholders = {
    couple: couplePlaceholder,
    engagement1: engagement1Placeholder,
    engagement2: engagement2Placeholder,
    groomPortrait: groomPlaceholder,
    bridePortrait: bridePlaceholder,
    groomHero: groomHeroPlaceholder,
    brideHero: brideHeroPlaceholder,
  };
  await writeFile(
    path.join(DATA_OUT, 'image-placeholders.json'),
    JSON.stringify(placeholders, null, 2) + '\n',
  );

  console.log('Assets prepared successfully.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
