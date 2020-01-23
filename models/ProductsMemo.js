const moment = require('moment');

module.exports = (sequelize, dataTypes) => {
    const ProductsMemo = sequelize.define('ProductsMemo', {
            id: { 
                type: dataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true
            },
            content:  { 
                type: dataTypes.TEXT,
                validate: {
                    len: [0, 500]
                }
            }
        }, {
            tableName: 'ProductsMemo'
        });

    ProductsMemo.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD // hh:mm')
    );

    return ProductsMemo;
}