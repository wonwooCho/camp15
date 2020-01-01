const express = require('express');
const router = express.Router();

const products = require('./products');
const contacts = require('./contacts');

// middleware
router.use('/products', products);
router.use('/contacts', contacts);

// admin main
router.get('/', (req, res) => {
    res.send('admin app');
});

module.exports = router;