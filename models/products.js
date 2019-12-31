const moment = require('moment');

module.exports = (sequelize, data_types) => {
    var products = sequelize.define('Products', {
        id: { type: data_types.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: data_types.STRING },
        price: { type: data_types.INTEGER },
        description: { type: data_types.TEXT }
    });

    products.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    return products;
}