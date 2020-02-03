const express = require('express');
const router = express.Router();
const models = require('../models');

/* GET home page. */
router.get('/', async (req, res) => {
    const products = await models.Products.findAll({
        include: [{
                model: models.User ,
                as: 'Owner',   // => Products.js belongsTo
                attributes: [ 'username' , 'displayname' ]
            }]
    });

    // console.log(models.Products.findAll());
    res.render('home.html', { products });
});

module.exports = router;