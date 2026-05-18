const express = require('express');
const { createVendor, listVendors } = require('../controllers/vendorController');

const router = express.Router();

router.get('/', listVendors);
router.post('/', createVendor);

module.exports = router;
