/**
 * routes/productRoutes.js
 *
 * Thin routing layer — maps HTTP verbs + paths to controller methods.
 * No business logic lives here.
 */

'use strict';

const { Router }                         = require('express');
const { getAllProducts, getProductById } = require('../controllers/productController');

const router = Router();

// GET /api/products         → list all
// GET /api/products/:id     → single product
router.get('/',    getAllProducts);
router.get('/:id', getProductById);

module.exports = router;
