const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createOrder, listOrders } = require('../controllers/orderController');

const router = express.Router();

router.get('/', authMiddleware, listOrders);
router.post('/', authMiddleware, createOrder);

module.exports = router;
