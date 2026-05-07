import express from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.API_PORT || 3001;

// ─── Multer: memory storage, 10 MB limit, images only ────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, or WebP images are accepted'));
    }
  },
});

// ─── Gemini client (key read from .env — NEVER exposed to frontend) ───────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const OCR_PROMPT = `Extract all purchased items from this receipt image.
Return ONLY valid JSON array with format:
[
  {
    "name": string,
    "price": number,
    "qty": number
  }
]

Rules:
- Ignore totals, tax, discounts, subtotals, service charges
- Ignore non-item text (store name, address, date, cashier, etc.)
- If qty not found, set qty = 1
- Price must be number only (no currency symbol)
- Do not return explanation, only JSON`;

// ─── Validate + sanitise raw AI output ───────────────────────────────────────
function validateItems(raw) {
  if (!Array.isArray(raw)) return [];

  const generateId = () => Math.random().toString(36).substring(2, 11);

  return raw
    .filter((item) => {
      if (typeof item !== 'object' || item === null) return false;
      if (typeof item.name !== 'string' || item.name.trim() === '') return false;
      if (typeof item.price !== 'number' || isNaN(item.price) || item.price < 0) return false;
      if (typeof item.qty !== 'number' || item.qty < 1 || isNaN(item.qty)) return false;
      return true;
    })
    .map((item) => ({
      id: generateId(),
      name: item.name.trim(),
      price: Math.abs(item.price),
      qty: Math.max(1, Math.floor(item.qty)),
    }));
}

// ─── POST /api/scan ───────────────────────────────────────────────────────────
app.post('/api/scan', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in .env');
      return res.status(500).json({ error: 'Server configuration error: missing API key' });
    }

    // Convert buffer → base64 (Gemini inlineData format)
    const base64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent([
      OCR_PROMPT,
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
    ]);

    const rawText = result.response.text() ?? '';

    // Strip markdown code fences if model wraps output in ```json ... ```
    const cleanText = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch {
      console.error('Gemini returned non-JSON content:', rawText);
      return res.status(422).json({ error: 'AI returned invalid JSON' });
    }

    const items = validateItems(parsed);

    if (items.length === 0) {
      return res.status(422).json({ error: 'No valid items found in receipt' });
    }

    console.log(`✅ Scanned ${items.length} item(s) from receipt`);
    return res.json(items);
  } catch (err) {
    console.error('Scan error:', err?.message ?? err);
    return res.status(500).json({ error: err?.message ?? 'Internal server error' });
  }
});

// ─── GET /api/health ──────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', model: 'gemini-2.5-flash', timestamp: new Date().toISOString() });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ SplitBill API (Gemini)  →  http://localhost:${PORT}/api/health`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY is not set — scan will fail until you add it to .env');
  }
});
