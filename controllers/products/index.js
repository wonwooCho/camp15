const express = require('express');
const router = express.Router();
const models = require('../../models');
const loginRequired = require('../../middleware/loginRequired');

router.get('/:id' , async(req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.id);
        const userLikes = await require('../../helpers/userLikes')(req);
        res.render('products/detail.html', { product, userLikes });  
    } catch(e) {

    }
});

router.post('/like/:product_id(\\d+)', loginRequired, async(req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.product_id);
        const user = await models.User.findByPk(req.user.id);
        const status = await user.addLikes(product);

        res.json({
            status
        });
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;