const express = require('express');
const router = express.Router();
const models = require('../models');

const csrf = require('csurf');
const csrfProtection = csrf({ cookie : true });

///////////////////////////////////////////////////////////////
// products main
///////////////////////////////////////////////////////////////
router.get('/' , async(_, res) => {
    try {
        const data_from_db = await models.Products.findAll();
        res.render('admin/products/products.html', { products : data_from_db });
    } catch(e) {

    }
});

///////////////////////////////////////////////////////////////
// write
///////////////////////////////////////////////////////////////
router.get('/write', csrfProtection, (req, res) => {
    res.render('admin/products/form.html', { csrfToken : req.csrfToken() });
});

router.post('/write', csrfProtection, async(req, res) => {
    // key - body 간 필드명이 동일하면 req.body만 넣어줘도 자동으로 맵핑된다.
    // 즉 { name : req.body.name, ... } 생략 가능
    try {
        await models.Products.create(req.body);
        res.redirect('/admin/products');
    } catch(e) {
        
    }
});

///////////////////////////////////////////////////////////////
// detail
///////////////////////////////////////////////////////////////
router.get('/detail/:id' , async(req, res) => {
    try {
        const data_from_db = await models.Products.findOne({
            where : {
                id : req.params.id
            },
            include : [
                'Memo'
            ]
        });
        res.render('admin/products/detail.html', { product : data_from_db });
    } catch(e) {

    }
});

router.post('/detail/:id', async(req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.id);
        // create + as에 적은 내용 ( Products.js association 에서 적은 내용 )
        await product.createMemo(req.body);
        res.redirect(`/admin/products/detail/${req.params.id}`); 
    } catch(e) {
        
    }
});

///////////////////////////////////////////////////////////////
// edit
///////////////////////////////////////////////////////////////
router.get('/edit/:id', csrfProtection, async(req, res) => {
    try {
        const data_from_db = await models.Products.findByPk(req.params.id);
        res.render('admin/products/form.html', {
            product : data_from_db,
            csrfToken : req.csrfToken()
         });
    } catch(e) {

    }
});

router.post('/edit/:id', csrfProtection, async(req, res) => {
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

///////////////////////////////////////////////////////////////
// delete
///////////////////////////////////////////////////////////////
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

router.get('/delete/:product_id/:memo_id', async(req, res) => {
    try {
        await models.ProductsMemo.destroy({
            where : {
                id : req.params.memo_id
            }
        });
        res.redirect(`/admin/products/detail/${req.params.product_id}`);
    } catch(e) {

    }
});


module.exports = router;