// Generates static QR codes (PNG) that deep-link to each venue's Google Maps search
// URL. Runs at authoring time only — no QR/runtime cost ships to the browser bundle.
// Keep this list in sync with the venue addresses in src/data/wedding.ts.
//
// NOTE: The three current venues (holy-matrimony, tirupathur-reception,
// puducherry-reception) now use the couple's own curated heart-shaped QR art
// from the reference invitation (assets-source/original/pptx-media/) instead of
// generating from this list — see public/assets/images/qr/*.png. This script is
// kept for adding QR codes for any future venue that doesn't have curated art.
import QRCode from 'qrcode';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const OUT_DIR = path.join(root, 'public', 'assets', 'images', 'qr');

const venues = [];

function buildMapsSearchUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const venue of venues) {
    const url = venue.mapsUrl ?? buildMapsSearchUrl(venue.address);
    await QRCode.toFile(path.join(OUT_DIR, `${venue.id}.png`), url, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: '#4a1420ff', light: '#fbf6eeff' },
    });
  }
  console.log(`Generated ${venues.length} QR codes.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
