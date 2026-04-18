/**
 * controllers/productController.js
 *
 * All business logic for the /api/products resource lives here.
 * Controllers receive (req, res, next) and delegate data access
 * to the pool. They never contain raw SQL — that belongs here
 * in the controller, not scattered across routes.
 */

'use strict';

const pool = require('../config/db');

// ─── Helpers ────────────────────────────────────────────────

/**
 * Wrap a controller function with a try/catch so we never forget
 * to call next(err) on async failures.
 *
 * @param {Function} fn  async (req, res, next) controller
 * @returns {Function}   express-compatible middleware
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ─── Queries ─────────────────────────────────────────────────

const SQL = {
  ALL_PRODUCTS: `
    SELECT
      id,
      name,
      price,
      description,
      image_url  AS imageUrl,
      category,
      created_at AS createdAt
    FROM products
    ORDER BY created_at DESC
  `,
  PRODUCT_BY_ID: `
    SELECT
      id,
      name,
      price,
      description,
      image_url  AS imageUrl,
      category,
      created_at AS createdAt
    FROM products
    WHERE id = ?
    LIMIT 1
  `,
};

// ─── Controller Methods ───────────────────────────────────────

/**
 * GET /api/products
 * Returns every product ordered by newest first.
 */
const getAllProducts = asyncHandler(async (_req, res) => {
  const [rows] = await pool.execute(SQL.ALL_PRODUCTS);

  // Consistent envelope: { data, count }
  res.status(200).json({
    data:  rows,
    count: rows.length,
  });
});

/**
 * GET /api/products/:id
 * Returns a single product or 404 if not found.
 */
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate: id must be a positive integer
  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'Invalid product id. Must be a positive integer.',
    });
  }

  const [rows] = await pool.execute(SQL.PRODUCT_BY_ID, [id]);

  if (rows.length === 0) {
    return res.status(404).json({
      error: `Product with id ${id} not found.`,
    });
  }

  res.status(200).json({ data: rows[0] });
});

module.exports = { getAllProducts, getProductById };
