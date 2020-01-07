const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/' , (_, res) => {
    models.Products.findAll({}).then((data_from_db) => {
        res.render('admin/products/products.html', { products : data_from_db });
    });
});

router.get('/write', (_, res) => {
    res.render('admin/products/form.html');
});

router.get('/detail/:id' , (req, res) => {
    models.Products.findByPk(req.params.id).then((data_from_db) => {
        res.render('admin/products/detail.html', { product : data_from_db });  
    });
});

router.post('/write' , (req, res) => {
    // key - body 간 필드명이 동일하면 req.body만 넣어줘도 자동으로 맵핑된다.
    // 즉 { name : req.body.name, ... } 생략 가능
    models.Products.create(req.body).then(() => {
        res.redirect('/admin/products');
    });
});

router.get('/edit/:id', (req, res) => {
    models.Products.findByPk(req.params.id).then((data_from_db) => {
        res.render('admin/products/form.html', { product : data_from_db });
    });
});

router.post('/edit/:id', (req, res) => {
    models.Products.update({
        name : req.body.name,
        price : req.body.price,
        description : req.body.description
    }, {
        where : { id : req.params.id }
    }).then(() => {
        res.redirect('/admin/products/detail/' + req.params.id);
        // res.redirect(`/products/detail/${req.params.id}`);
    });
});

module.exports = router;