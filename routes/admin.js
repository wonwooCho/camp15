var express = require('express');
var router = express.Router();
const models = require('../models');

router.get('/', function (req, res) {
    res.send('admin app');
});

router.get('/products' , function(_, res) {
    models.Products.findAll({}).then((data_from_db) => {
        res.render('admin/products.html', { products : data_from_db });
    });
});

router.get('/products/write', function (req, res) {
    res.render('admin/form.html');
});

router.get('/products/detail/:id' , function(req, res) {
    models.Products.findByPk(req.params.id).then((data_from_db) => {
        res.render('admin/detail.html', { product: data_from_db });  
    });
});

router.post('/products/write' , (req, res) => {
    models.Products.create({
        name : req.body.name,
        price : req.body.price ,
        description : req.body.description
    }).then(() => {
        // 작성 완료 후 프로덕트 리스트 화면으로 보낸다.
        res.redirect('/admin/products');
    });
});

module.exports = router;