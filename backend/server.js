/**
 * server.js — Hxni Ecommerce Store API
 *
 * Entry point. Responsibilities:
 *  1. Load environment variables
 *  2. Initialise Express + global middleware
 *  3. Mount route modules
 *  4. Attach centralised error handler
 *  5. Start listening on 0.0.0.0 so Expo Go on a physical
 *     device can reach the server via your laptop's LAN IP.
 */

'use strict';

require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const productRoutes = require('./routes/productRoutes');

// ─── App ────────────────────────────────────────────────────

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ───────────────────────────────────────────────────
// Parse comma-separated ALLOWED_ORIGINS from .env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, RN fetch)
      if (!origin || allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin))         return callback(null, true);
      callback(new Error(`CORS: origin "${origin}" is not allowed.`));
    },
    methods: ['GET'],
  })
);

// ─── Middleware ──────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logger (dev-friendly, no external deps)
app.use((req, _res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}]  ${req.method}  ${req.originalUrl}`);
  next();
});

// ─── Routes ─────────────────────────────────────────────────

app.use('/api/products', productRoutes);

// Health check — useful for uptime monitoring and CI
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'hxni-api', ts: Date.now() });
});

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Centralised Error Handler ───────────────────────────────

// Must have exactly 4 params for Express to recognise it as an error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);

  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal server error.' : err.message,
  });
});

// ─── Listen ─────────────────────────────────────────────────

// Bind to 0.0.0.0 so the server is reachable on the LAN
// (required for Expo Go on a physical device)
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ██╗  ██╗██╗  ██╗███╗  ██╗██╗');
  console.log('  ██║  ██║╚██╗██╔╝████╗ ██║██║');
  console.log('  ███████║ ╚███╔╝ ██╔██╗██║██║');
  console.log('  ██╔══██║ ██╔██╗ ██║╚████║██║');
  console.log('  ██║  ██║██╔╝╚██╗██║ ╚███║██║');
  console.log('  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚══╝╚═╝');
  console.log('');
  console.log(`  Hxni Ecommerce API running`);
  console.log(`  → http://0.0.0.0:${PORT}`);
  console.log(`  → http://localhost:${PORT}/api/products`);
  console.log('');
});
