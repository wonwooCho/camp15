const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (_, res) => {
    models.Contacts.findAll({}).then((data_from_db) => {
        res.render('admin/contacts/contacts.html', { contacts : data_from_db });
    });
});

router.get('/write', (_, res) => {
    res.render('admin/contacts/form.html');
});

router.get('/detail/:id', (req, res) => {
    models.Contacts.findByPk(req.params.id).then((data_from_db) => {
        res.render('admin/contacts/detail.html', { contact : data_from_db });
    })
});

router.post('/write', (req, res) => {
    models.Contacts.create({
        name : req.body.name,
        manufacturer : req.body.manufacturer,
        description : req.body.description
    }).then(()=> {
        res.redirect('/admin/contacts');
    });
});

module.exports = router;