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

router.get('/edit/:id', async(req, res) => {
    try {
        const data_from_db = await models.Contacts.findByPk(req.params.id);
        res.render('admin/contacts/form.html', {
            contact : data_from_db
        });
    } catch(e) {
        console.log(e);
    }
});

router.post('/edit/:id', async(req, res) => {
    try {
        await models.Contacts.update(req.body, {
            where : {
                id : req.params.id
            }
        });
        res.redirect(`/admin/contacts/detail/${req.params.id}`);
    } catch(e) {
        console.log(e);
    }
});

router.get('/delete/:id', async(req, res) => {
    try {
        await models.Contacts.destroy({
            where : {
                id : req.params.id
            }
        });
        res.redirect('/admin/contacts');
    } catch(e) {

    }
});

module.exports = router;