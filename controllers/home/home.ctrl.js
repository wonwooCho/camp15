const models = require('../../models');

exports.index = async(req, res) => {
    const products = await models.Products.findAll({
        include: [{
                model: models.User ,
                as: 'Owner',   // => Products.js belongsTo
                attributes: ['username' , 'displayname']
            }, {
                model: models.Tag,
                as: 'Tag'
            }
        ],
        where: {
            // 객체 안에서 조건걸 때 ...문법
            ...( 
            // 검색어가 있는 경우
            ('name' in req.query && req.query.name) ? 
            {
                // + 태그에서 가져옴 or
                [models.Sequelize.Op.or] : [
                    models.Sequelize.where( models.Sequelize.col('Tag.name') , {
                        [models.Sequelize.Op.like] : `%${req.query.name}%`
                    }),
                    {
                        'name' : {
                            [models.Sequelize.Op.like] : `%${req.query.name}%`
                        }
                    }
                ],
            }
            :
            '' ),
        }
    });

    const userLikes = await require('../../helpers/userLikes')(req);
    res.render('home.html', { products, userLikes });
}