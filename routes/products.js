const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/' , (_, res) => {
    models.Products.findAll({}).then((data_from_db) => {
        res.render('admin/products/products.html', { products: data_from_db });
    });
});

router.get('/write', (_, res) => {
    res.render('admin/products/form.html');
});

router.get('/detail/:id' , (req, res) => {
    models.Products.findByPk(req.params.id).then((data_from_db) => {
        res.render('admin/products/detail.html', { product: data_from_db });  
    });
});

router.post('/write' , (req, res) => {
    models.Products.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    }).then(() => {
        res.redirect('/admin/products');
    });
});

module.exports = router;