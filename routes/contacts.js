const express = require('express');
const router = express.Router();
const models = require('../models');

const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

///////////////////////////////////////////////////////////////
// contacts main
///////////////////////////////////////////////////////////////
router.get('/', (_, res) => {
    models.Contacts.findAll({}).then((data_from_db) => {
        res.render('admin/contacts/contacts.html', { contacts: data_from_db });
    });
});

///////////////////////////////////////////////////////////////
// write
///////////////////////////////////////////////////////////////
router.get('/write', csrfProtection, (req, res) => {
    res.render('admin/contacts/form.html', { csrfToken: req.csrfToken() });
});

router.post('/write', csrfProtection, (req, res) => {
    models.Contacts.create({
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description
    }).then(()=> {
        res.redirect('/admin/contacts');
    });
});

///////////////////////////////////////////////////////////////
// detail
///////////////////////////////////////////////////////////////
router.get('/detail/:id', async(req, res) => {
    try {
        const data_from_db = await models.Contacts.findOne({
            where: {
                id: req.params.id
            },
            include: [
                'Memo'
            ]
        });
        res.render('admin/contacts/detail.html', { contact: data_from_db });
    } catch(e) {

    }
});

router.post('/detail/:id', async(req, res) => {
    try {
        const contact = await models.Contacts.findByPk(req.params.id);
        await contact.createMemo(req.body);
        res.redirect(`/admin/contacts/detail/${req.params.id}`);
    } catch(e) {

    }
});

///////////////////////////////////////////////////////////////
// edit
///////////////////////////////////////////////////////////////
router.get('/edit/:id', csrfProtection, async(req, res) => {
    try {
        const data_from_db = await models.Contacts.findByPk(req.params.id);
        res.render('admin/contacts/form.html', {
            contact: data_from_db,
            csrfToken: req.csrfToken()
        });
    } catch(e) {

    }
});

router.post('/edit/:id', csrfProtection, async(req, res) => {
    try {
        await models.Contacts.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.redirect(`/admin/contacts/detail/${req.params.id}`);
    } catch(e) {

    }
});

router.get('/edit/:contact_id/:memo_id', async(req, res) => {
    try {
        const data_from_db = await models.ContactsMemo.findByPk(req.params.memo_id);
        res.render('admin/contacts/form_memo.html', {
            memo: data_from_db
        });
    } catch(e) {

    }
});

router.post('/edit/:contact_id/:memo_id', async(req, res) => {
    try {
        await models.ContactsMemo.update(req.body, {
            where: {
                id: req.params.memo_id
            }
        });
        res.redirect(`/admin/contacts/detail/${req.params.contact_id}`);
    } catch(e) {

    }
});

///////////////////////////////////////////////////////////////
// delete
///////////////////////////////////////////////////////////////
router.get('/delete/:id', async(req, res) => {
    try {
        await models.Contacts.destroy({
            where: {
                id: req.params.id
            }
        });
        res.redirect('/admin/contacts');
    } catch(e) {

    }
});

router.get('/delete/:contact_id/:memo_id', async(req, res) => {
    try {
        await models.ContactsMemo.destroy({
            where: {
                id: req.params.memo_id
            }
        });
        res.redirect(`/admin/contacts/detail/${req.params.contact_id}`);
    } catch(e) {

    }
});

module.exports = router;