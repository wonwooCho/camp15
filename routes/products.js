const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/' , async(_, res) => {
    try {
        const data_from_db = await models.Products.findAll();
        res.render('admin/products/products.html', { products : data_from_db });
    } catch(e) {

    }
});

router.get('/write', (_, res) => {
    res.render('admin/products/form.html');
});

router.get('/detail/:id' , async(req, res) => {
    try {
        const data_from_db = await models.Products.findByPk(req.params.id);
        res.render('admin/products/detail.html', { product : data_from_db });
    } catch(e) {

    }
});

router.post('/write' , async(req, res) => {
    // key - body 간 필드명이 동일하면 req.body만 넣어줘도 자동으로 맵핑된다.
    // 즉 { name : req.body.name, ... } 생략 가능
    try {
        await models.Products.create(req.body);
        res.redirect('/admin/products');
    } catch(e) {
        
    }
});

router.get('/edit/:id', async(req, res) => {
    try {
        const data_from_db = await models.Products.findByPk(req.params.id);
        res.render('admin/products/form.html', { product : data_from_db });
    } catch(e) {

    }
});

router.post('/edit/:id', async(req, res) => {
    try {
        await models.Products.update(req.body, {
            where : {
                id : req.params.id
            }
        });
        res.redirect(`/admin/products/detail/${req.params.id}`);
    } catch(e) {

    }
});

router.get('/delete/:id', async(req, res) => {
    try {
        await models.Products.destroy({
            where : { 
                id : req.params.id
            }
        });
        res.redirect('/admin/products');
    } catch(e) {

    }
});

module.exports = router;