const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { addToCart, getCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addToCart);

module.exports = router;
