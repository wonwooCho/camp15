const express = require('express');
const router = express.Router();

const products = require('./products');

// products
router.use('/products', products);

// admin main
router.get('/', (req, res) => {
    res.send('admin app');
});

module.exports = router;