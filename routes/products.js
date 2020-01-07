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
    models.Products.update(req.body, {
        where : {
            id : req.params.id
        }
    }).then(() => {
        res.redirect(`/admin/products/detail/${req.params.id}`);
    });
});

// NOTE @wonwoo
// controller에서 템플릿을 뿌려주는 구조이기 때문에, 모든 데이터를 json으로 처리한다.
// 그래서 restfull 위해 router.delete 사용하지 않고 get요청으로 처리한다.
router.get('/delete/:id', (req, res) => {
    models.Products.destroy({
        where : { 
            id : req.params.id
        }
    }).then(() => {
        res.redirect('/admin/products');
    });
});

module.exports = router;