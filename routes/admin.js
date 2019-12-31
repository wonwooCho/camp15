var express = require('express');
var router = express.Router();
const models = require('../models');

///////////////////////////////////////////////////////////////
// admin main
///////////////////////////////////////////////////////////////
router.get('/', (req, res) => {
    res.send('admin app');
});

///////////////////////////////////////////////////////////////
// products
///////////////////////////////////////////////////////////////
router.get('/products' , (_, res) => {
    models.Products.findAll({}).then((data_from_db) => {
        res.render('admin/products/products.html', { products: data_from_db });
    });
});

router.get('/products/write', (_, res) => {
    res.render('admin/products/form.html');
});

router.get('/products/detail/:id' , (req, res) => {
    models.Products.findByPk(req.params.id).then((data_from_db) => {
        res.render('admin/products/detail.html', { product: data_from_db });  
    });
});

router.post('/products/write' , (req, res) => {
    models.Products.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    }).then(() => {
        // 작성 완료 후 프로덕트 리스트 화면으로 보낸다.
        res.redirect('/admin/products');
    });
});

///////////////////////////////////////////////////////////////
// contacts
///////////////////////////////////////////////////////////////
router.get('/contacts', (_, res) => {
    models.Contacts.findAll({}).then((data_from_db) => {
        res.render('admin/contacts/contacts.html', { contacts: data_from_db });
    });
});

router.get('/contacts/write', (_, res) => {
    res.render('admin/contacts/form.html');
});

router.get('/contacts/detail/:id', (req, res) => {
    models.Contacts.findByPk(req.params.id).then((data_from_db) => {
        res.render('admin/contacts/detail.html', { contact: data_from_db });
    })
});

router.post('/contacts/write', (req, res) => {
    models.Contacts.create({
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description
    }).then(()=> {
        res.redirect('/admin/contacts');
    });
});

module.exports = router;