const models = require('../../models');

exports.index = async(req, res) => {
    const products = await models.Products.findAll({
        include: [{
                model: models.User ,
                as: 'Owner',   // => Products.js belongsTo
                attributes: ['username' , 'displayname']
            }]
    });

    const userLikes = await require('../../helpers/userLikes')(req);
    res.render('home.html', { products, userLikes });
}