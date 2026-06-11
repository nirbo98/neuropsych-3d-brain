// @ts-nocheck
/**
 * build-lectures.mjs — zero-dependency lecture extractor.
 *
 * The lecturer's decks live in lectures-src/ as *.pdf files that are actually
 * ZIP archives (mostly STORED, i.e. uncompressed). Each slide is a pair:
 *   <name>.jpeg  — the rendered slide image (figure / graph)
 *   <name>.txt   — the slide's text (with leaked PowerPoint bullet glyphs)
 *
 * This script:
 *   1. Parses each archive with a tiny built-in ZIP reader (no deps).
 *   2. Cleans the slide text.
 *   3. Merges hand-authored mappings from src/data/lectures.annotations.json.
 *   4. Writes only the *mapped* slide images into public/lectures/<id>/.
 *   5. Regenerates src/data/lectures.generated.ts (typed, committed).
 *
 * Re-run safely after dropping a new file into lectures-src/:
 *   npm run lectures
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'lectures-src');
const PUBLIC_DIR = path.join(ROOT, 'public', 'lectures');
const ANNOTATIONS_FILE = path.join(ROOT, 'src', 'data', 'lectures.annotations.json');
const OUT_FILE = path.join(ROOT, 'src', 'data', 'lectures.generated.ts');

// Lecture-source files to exclude (not actual lecture decks).
const EXCLUDE = new Set(['Maintenance_reserve_and_compensation_Nat_Rev_2018.pdf']);

const IMAGE_DOMINANT_MAX_WORDS = 8;

// ── Minimal ZIP reader (STORED + DEFLATE), no dependencies ──────────────────
function readZipEntries(buf) {
  // Locate End Of Central Directory record (signature 0x06054b50) from the tail.
  const EOCD_SIG = 0x06054b50;
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i >= buf.length - 22 - 0xffff; i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) { eocd = i; break; }
  }
  if (eocd === -1) throw new Error('EOCD not found — not a ZIP archive');

  const total = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16); // start of central directory

  const entries = [];
  for (let n = 0; n < total; n++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) break; // central dir header
    const method = buf.readUInt16LE(off + 10);
    const compSize = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const localOff = buf.readUInt32LE(off + 42);
    const name = buf.toString('utf8', off + 46, off + 46 + nameLen);
    entries.push({ name, method, compSize, localOff });
    off += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

function extractEntry(buf, entry) {
  // Local file header is variable-length; read its name/extra lengths.
  const lo = entry.localOff;
  if (buf.readUInt32LE(lo) !== 0x04034b50) throw new Error(`bad local header: ${entry.name}`);
  const nameLen = buf.readUInt16LE(lo + 26);
  const extraLen = buf.readUInt16LE(lo + 28);
  const dataStart = lo + 30 + nameLen + extraLen;
  const data = buf.subarray(dataStart, dataStart + entry.compSize);
  if (entry.method === 0) return Buffer.from(data); // STORED
  if (entry.method === 8) return zlib.inflateRawSync(data); // DEFLATE
  throw new Error(`unsupported compression method ${entry.method} for ${entry.name}`);
}

// ── Text + id helpers ───────────────────────────────────────────────────────
function slugify(s) {
  return s
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanText(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s ]*[nqvl]\s+/, '').replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function wordCount(text) {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

// ── Annotations ─────────────────────────────────────────────────────────────
function loadAnnotations() {
  if (!fs.existsSync(ANNOTATIONS_FILE)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(ANNOTATIONS_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn(`⚠️  Could not parse ${path.relative(ROOT, ANNOTATIONS_FILE)}: ${e.message}`);
    return [];
  }
}

// ── Build ───────────────────────────────────────────────────────────────────
function build() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`✗ Missing ${path.relative(ROOT, SRC_DIR)}/ — drop the lecture .pdf files there first.`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => f.toLowerCase().endsWith('.pdf') && !EXCLUDE.has(f))
    .sort();

  if (files.length === 0) {
    console.error(`✗ No lecture files found in ${path.relative(ROOT, SRC_DIR)}/`);
    process.exit(1);
  }

  const annotations = loadAnnotations();
  // index annotations by `${lectureId}/${slideId}`
  const annoByKey = new Map();
  for (const a of annotations) annoByKey.set(`${a.lectureId}/${a.slideId}`, a);
  const usedAnnoKeys = new Set();

  // Reset the generated image output dir (only mapped images are re-written).
  fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });

  const lectures = [];
  let totalSlides = 0;
  let mappedImages = 0;

  for (const file of files) {
    const buf = fs.readFileSync(path.join(SRC_DIR, file));
    let entries;
    try {
      entries = readZipEntries(buf);
    } catch (e) {
      console.warn(`⚠️  Skipping ${file}: ${e.message}`);
      continue;
    }

    const lectureId = slugify(file);
    const title = file.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();

    // Group entries by base name (slide stem), pairing .jpeg + .txt.
    const stems = new Map(); // stem -> { jpeg?, txt? }
    for (const e of entries) {
      const base = e.name.split('/').pop() || e.name;
      const m = base.match(/^(.*)\.(jpe?g|txt)$/i);
      if (!m) continue;
      const stem = m[1];
      const ext = m[2].toLowerCase();
      const rec = stems.get(stem) || {};
      if (ext === 'txt') rec.txt = e;
      else rec.jpeg = e;
      stems.set(stem, rec);
    }

    const sortedStems = [...stems.keys()].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }),
    );

    const slides = [];
    sortedStems.forEach((stem, i) => {
      const rec = stems.get(stem);
      const slideId = slugify(stem) || `slide-${i + 1}`;
      const text = rec.txt ? cleanText(extractEntry(buf, rec.txt).toString('utf8')) : '';
      const wc = wordCount(text);
      const key = `${lectureId}/${slideId}`;
      const anno = annoByKey.get(key);

      const slide = {
        id: slideId,
        index: i + 1,
        text,
        wordCount: wc,
        isImageDominant: wc <= IMAGE_DOMINANT_MAX_WORDS,
      };

      if (anno) {
        usedAnnoKeys.add(key);
        slide.regionId = anno.regionId;
        if (anno.deficitFocus) slide.deficitFocus = anno.deficitFocus;
        // Only mapped slides get their image written into public/.
        if (rec.jpeg) {
          const outDir = path.join(PUBLIC_DIR, lectureId);
          fs.mkdirSync(outDir, { recursive: true });
          fs.writeFileSync(path.join(outDir, `${slideId}.jpeg`), extractEntry(buf, rec.jpeg));
          slide.image = `lectures/${lectureId}/${slideId}.jpeg`;
          mappedImages++;
        }
      }

      slides.push(slide);
    });

    totalSlides += slides.length;
    lectures.push({ id: lectureId, title, slides });
    console.log(`  • ${title} — ${slides.length} slides`);
  }

  // Warn about annotations that didn't match any slide.
  for (const a of annotations) {
    const key = `${a.lectureId}/${a.slideId}`;
    if (!usedAnnoKeys.has(key)) console.warn(`⚠️  Annotation has no matching slide: ${key}`);
  }

  writeGenerated(lectures);

  console.log(
    `\n✓ ${lectures.length} lectures, ${totalSlides} slides, ${mappedImages} mapped images written.`,
  );
  console.log(`✓ ${path.relative(ROOT, OUT_FILE)} regenerated.`);
}

function writeGenerated(lectures) {
  const header =
    '// AUTO-GENERATED by scripts/build-lectures.mjs — DO NOT EDIT.\n' +
    '// Run `npm run lectures` to regenerate.\n' +
    "import type { Lecture } from '../types/brain.types';\n\n";
  const body = `export const lectures: Lecture[] = ${JSON.stringify(lectures, null, 2)};\n`;
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, header + body);
}

build();
